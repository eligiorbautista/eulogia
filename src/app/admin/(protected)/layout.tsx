import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/session";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-full flex-col">
      <header className="no-print border-b bg-background px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-primary">Eulogia</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <form action={logoutAdmin} className="no-print">
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
