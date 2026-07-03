import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/sidebar-nav";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "LUMA Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <SidebarProvider>
      <AdminSidebar email={admin.email} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            LUMA Operations
          </p>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
