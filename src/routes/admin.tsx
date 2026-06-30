import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Megaphone, Inbox, Wallet, FileText, MessageCircle, Users,
  BarChart3, Shield, Settings as SettingsIcon, Bell, Menu, X, AlertTriangle, LogOut, ScaleIcon,
  BookOpen, Sparkles,
} from "lucide-react";

import { useState } from "react";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Goheza Admin — Platform Control" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const primary: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/admin/templates", label: "Campaign Templates", icon: BookOpen },
  { to: "/admin/examples", label: "Content Examples", icon: Sparkles },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },

  { to: "/admin/wallet", label: "Wallet & Finance", icon: Wallet },
  { to: "/admin/invoices", label: "Invoices", icon: FileText },
  { to: "/admin/support", label: "Support", icon: MessageCircle },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Platform Analytics", icon: BarChart3 },
  { to: "/admin/disputes", label: "Disputes", icon: ScaleIcon },
  { to: "/admin/moderation", label: "Moderation", icon: Shield },
  { to: "/admin/config", label: "Configuration", icon: SettingsIcon },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openMobile, setOpenMobile] = useState(false);

  const isActive = (i: NavItem) =>
    i.exact ? pathname === i.to : pathname === i.to || pathname.startsWith(i.to + "/");

  const SidebarBody = (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto bg-ink px-3 py-5 text-white/90">
      <div className="px-2 pb-4">
        <div className="inline-flex items-center gap-2">
          <Logo className="h-7 w-auto invert" />
          <span className="rounded-full bg-[oklch(0.66_0.20_42)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Admin</span>
        </div>
      </div>
      <ul className="flex flex-col gap-0.5">
        {primary.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpenMobile(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-4">
        <Link to="/" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" /> Exit Admin
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.965_0.012_78)] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{SidebarBody}</aside>

      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpenMobile(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-elevated">
            <div className="absolute right-3 top-3 z-10">
              <button onClick={() => setOpenMobile(false)} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X className="h-4 w-4" /></button>
            </div>
            {SidebarBody}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-hairline bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-3 sm:px-6">
            <button onClick={() => setOpenMobile(true)} className="rounded-xl p-2 text-ink hover:bg-ink/5 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className="flex-1">
              <p className="font-display text-base font-semibold text-ink sm:text-lg">Platform Control Center</p>
              <p className="text-[11px] text-muted-foreground">Goheza Admin · production environment</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-[oklch(0.95_0.06_25)] px-3 py-1 text-[11px] font-semibold text-[oklch(0.5_0.18_25)] sm:inline-flex">
                <AlertTriangle className="h-3 w-3" /> 3 fraud alerts
              </span>
              <button className="relative rounded-xl border border-hairline bg-background p-2 text-ink hover:bg-ink/5">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[oklch(0.66_0.20_42)] px-1 text-[10px] font-bold text-white">9</span>
              </button>
              <div className="flex items-center gap-2 rounded-full border border-hairline bg-background py-1 pl-1 pr-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">G</span>
                <span className="hidden text-sm font-medium text-ink sm:inline">Owner</span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
