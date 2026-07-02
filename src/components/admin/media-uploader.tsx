"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Upload, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { attachMedia, reorderMedia } from "@/lib/actions/admin/listings";

const ACCEPT = { image: "image/*", video: "video/*" };
const BUCKET = "listing-media";

function SortableThumb({
  url,
  kind,
  onRemove,
}: {
  url: string;
  kind: "image" | "video";
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10"
    >
      {kind === "image" ? (
        <Image src={url} alt="" fill className="object-cover" sizes="150px" />
      ) : (
        <div className="flex size-full items-center justify-center bg-black/80">
          <PlayCircle className="size-8 text-white/80" />
        </div>
      )}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 flex size-6 items-center justify-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Remove"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

export function MediaUploader({
  listingId,
  kind,
  urls: initialUrls,
}: {
  listingId: string;
  kind: "image" | "video";
  urls: string[];
}) {
  const [urls, setUrls] = useState(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const path = `${listingId}/${kind}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setUploading(false);
    if (!uploaded.length) return;

    const next = [...urls, ...uploaded];
    setUrls(next);
    const result = await attachMedia(listingId, uploaded, kind);
    if ("error" in result) toast.error(result.error);
  }

  function handleRemove(url: string) {
    const next = urls.filter((u) => u !== url);
    setUrls(next);
    startTransition(async () => {
      const result = await reorderMedia(listingId, next, kind);
      if ("error" in result) toast.error(result.error);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setUrls((current) => {
      const oldIndex = current.indexOf(String(active.id));
      const newIndex = current.indexOf(String(over.id));
      const next = arrayMove(current, oldIndex, newIndex);
      startTransition(async () => {
        const result = await reorderMedia(listingId, next, kind);
        if ("error" in result) toast.error(result.error);
      });
      return next;
    });
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={urls} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {urls.map((url) => (
              <SortableThumb key={url} url={url} kind={kind} onRemove={() => handleRemove(url)} />
            ))}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
            >
              <Upload className="size-4" />
              <span className="text-[11px]">{uploading ? "Uploading…" : "Add"}</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        multiple
        hidden
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
