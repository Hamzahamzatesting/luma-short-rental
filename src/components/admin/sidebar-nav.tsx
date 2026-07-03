"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck2,
  Users,
  Star,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/actions/auth";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  {
    href: "/admin/properties",
    label: "Properties",
    icon: Building2,
    exact: false,
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: CalendarCheck2,
    exact: false,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
    exact: false,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: Star,
    exact: false,
  },
];

export function AdminSidebar({ email }: { email?: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5">
        <Link href="/admin" className="flex items-baseline gap-2 px-1">
          <span className="font-heading text-xl tracking-[0.22em] text-gold">
            LUMA
          </span>
          <span className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Admin
          </span>
        </Link>
      </SidebarHeader>
      <Separator className="mx-3 w-auto bg-sidebar-border" />
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-medium tracking-[0.14em] text-muted-foreground/70 uppercase">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className="relative h-9 rounded-md text-sidebar-foreground/75 data-active:bg-gold/10 data-active:text-gold data-active:before:absolute data-active:before:inset-y-1.5 data-active:before:left-0 data-active:before:w-0.5 data-active:before:rounded-full data-active:before:bg-gold hover:bg-sidebar-accent/60 hover:text-sidebar-foreground [&_svg]:size-4"
                      render={
                        <Link href={item.href}>
                          <item.icon />
                          <span className="text-sm tracking-wide">
                            {item.label}
                          </span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 px-3 pb-4">
        <Separator className="mb-1 bg-sidebar-border" />
        {email ? (
          <p className="truncate px-1.5 text-xs text-muted-foreground">
            {email}
          </p>
        ) : null}
        <form action={signOut}>
          <SidebarMenuButton
            type="submit"
            tooltip="Sign out"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <LogOut />
            <span className="text-sm tracking-wide">Sign out</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
