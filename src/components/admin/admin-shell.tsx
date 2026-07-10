"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarHeart, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAdmin } from "@/app/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/guests", label: "Guests", icon: Users },
  { href: "/admin/event-details", label: "Event Details", icon: CalendarHeart },
];

function NavList({ closeOnNavigate = false }: { closeOnNavigate?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const link = (
          <Link
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
        return (
          <div key={item.href}>
            {closeOnNavigate ? (
              <SheetClose asChild>{link}</SheetClose>
            ) : (
              link
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-lg font-semibold text-primary">Eulogia</span>
      <span className="text-xs text-muted-foreground">Admin</span>
    </div>
  );
}

function LogoutForm() {
  return (
    <form action={logoutAdmin}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
      >
        <LogOut className="mr-2 h-5 w-5" />
        Logout
      </Button>
    </form>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:bg-card lg:px-3 lg:py-4">
        <div className="mb-6 px-3">
          <Brand />
        </div>
        <div className="flex-1">
          <NavList />
        </div>
        <div className="border-t pt-4">
          <LogoutForm />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
        <Brand />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-60 flex-col p-4">
            <SheetHeader className="text-left">
              <SheetTitle className="text-left">Eulogia Admin</SheetTitle>
            </SheetHeader>
            <div className="flex-1 py-6">
              <NavList closeOnNavigate />
            </div>
            <div className="border-t pt-4">
              <LogoutForm />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
