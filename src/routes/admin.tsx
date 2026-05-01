import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import sanroquelogo from "@/assets/sanroquelogo.jpg";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, ShieldAlert, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.navigate({ to: "/login", search: { error: undefined } });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const isAdmin = roles?.some((r) => r.role === "admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        router.navigate({ to: "/login", search: { error: "not_admin" } });
        return;
      }
      if (mounted) {
        setEmail(session.user.email ?? null);
        setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading admin dashboard…
      </div>
    );
  }

  const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/residents", label: "Residents", icon: Users },
    { to: "/admin/certificates", label: "Certificates", icon: FileText },
    { to: "/admin/blotter", label: "Blotter", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r bg-sidebar hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-11 w-11 overflow-hidden rounded-lg bg-white shadow-sm">
              <img src={sanroquelogo} alt="San Roque logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-display font-semibold leading-tight">Barangay</div>
              <div className="text-xs text-muted-foreground">Admin Console</div>
            </div>
          </Link>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors text-sidebar-foreground"
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t space-y-2">
          <div className="px-3 text-xs text-muted-foreground truncate">{email}</div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={async () => {
              await supabase.auth.signOut();
              router.navigate({ to: "/login", search: { error: undefined } });
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b p-4 flex items-center gap-3 overflow-x-auto">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="px-3 py-1.5 rounded-md text-sm whitespace-nowrap"
            >
              {it.label}
            </Link>
          ))}
        </div>
        <div className="p-6 md:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
