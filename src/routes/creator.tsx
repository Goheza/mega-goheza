import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Megaphone, Briefcase, DollarSign, Wallet, BarChart3, Bell, Lightbulb,
  HelpCircle, Gift, MessageCircle, User, Settings, LogOut, Search, Menu, X, CheckCircle2,
  AlertTriangle, Sparkles, Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { creator, notifications } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator")({
  head: () => ({ meta: [{ title: "Creator Dashboard — Goheza" }] }),
  component: CreatorLayout,
});

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean };

const primary: NavItem[] = [
  { to: "/creator", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/creator/campaigns", label: "Browse Campaigns", icon: Megaphone },
  { to: "/creator/submissions", label: "My Submissions", icon: Briefcase },
  { to: "/creator/earnings", label: "Earnings", icon: DollarSign },
  { to: "/creator/wallet", label: "Wallet", icon: Wallet },
  { to: "/creator/analytics", label: "Analytics", icon: BarChart3 },
];

const secondary: NavItem[] = [
  { to: "/creator/tips", label: "Creator Tips", icon: Lightbulb },
  { to: "/creator/how-it-works", label: "How Goheza Works", icon: HelpCircle },
  { to: "/creator/referrals", label: "Referral Program", icon: Gift },
  { to: "/creator/support", label: "Support", icon: MessageCircle },
  { to: "/creator/profile", label: "Profile", icon: User },
  { to: "/creator/settings", label: "Settings", icon: Settings },
];

const notifIcon: Record<string, React.ReactNode> = {
  approval: <CheckCircle2 className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  new: <Sparkles className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  payment: <DollarSign className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  revision: <AlertTriangle className="h-4 w-4 text-[oklch(0.5_0.18_45)]" />,
  deadline: <Clock className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
};

function CreatorLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openMobile, setOpenMobile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => { setOpenNotif(false); }, [pathname]);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");

  const SidebarBody = (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-5">
      <div className="px-2 pb-4" onClick={() => setOpenMobile(false)}>
        <Logo className="h-8 w-auto" />
      </div>
      <SidebarSection items={primary} isActive={isActive} onNav={() => setOpenMobile(false)} />
      <div className="my-3 h-px bg-hairline" />
      <SidebarSection items={secondary} isActive={isActive} onNav={() => setOpenMobile(false)} />
      <div className="mt-auto pt-4">
        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.965_0.012_78)] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-hairline bg-surface-elevated lg:block">
        {SidebarBody}
      </aside>

      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpenMobile(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-surface-elevated shadow-elevated">
            <div className="absolute right-3 top-3">
              <button onClick={() => setOpenMobile(false)} className="rounded-full bg-ink/5 p-2 text-ink hover:bg-ink/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            {SidebarBody}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-hairline bg-surface-elevated/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setOpenMobile(true)} className="rounded-xl p-2 text-ink hover:bg-ink/5 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden flex-1 items-center sm:flex sm:max-w-md">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search campaigns, brands…"
                  className="w-full rounded-full border border-hairline bg-background py-2 pl-9 pr-4 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div className="flex-1 sm:hidden" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenNotif(true)}
                className="relative rounded-xl border border-hairline bg-background p-2 text-ink hover:bg-ink/5"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white shadow-[0_0_0_2px_var(--color-background)]">
                    {unread}
                  </span>
                )}
              </button>

              <Link to="/creator/profile" className="flex items-center gap-2 rounded-full border border-hairline bg-background py-1 pl-1 pr-3 hover:bg-ink/5">
                <img src={creator.avatar} alt={creator.name} className="h-7 w-7 rounded-full object-cover" />
                <span className="hidden text-sm font-medium text-ink sm:inline">{creator.name}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>

      {/* Notification slide-out panel */}
      {openNotif && (
        <div className="fixed inset-0 z-50">
          <button aria-label="Close notifications" className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpenNotif(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-elevated shadow-elevated animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-display text-lg font-semibold text-ink">Notifications</p>
                <p className="text-xs text-muted-foreground">{unread} unread</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
                  Mark all read
                </button>
                <button onClick={() => setOpenNotif(false)} className="rounded-full bg-ink/5 p-2 text-ink hover:bg-ink/10" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ul className="flex-1 divide-y divide-hairline overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className={`flex items-start gap-3 px-5 py-4 transition-colors hover:bg-ink/[0.02] ${!n.read ? "bg-[oklch(0.97_0.02_75)]" : ""}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-elevated ring-1 ring-hairline">
                    {notifIcon[n.kind] ?? <Bell className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{n.title}</p>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-hairline px-5 py-3">
              <Link
                to="/creator/notifications"
                onClick={() => setOpenNotif(false)}
                className="block w-full rounded-full bg-ink py-2.5 text-center text-sm font-semibold text-white hover:bg-ink/85"
              >
                View all notifications
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SidebarSection({
  items, isActive, onNav,
}: {
  items: NavItem[];
  isActive: (i: NavItem) => boolean;
  onNav: () => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNav}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
              style={active ? { backgroundImage: "var(--gradient-primary)" } : undefined}
            >
              {active && <span aria-hidden className="absolute left-0 top-1/2 h-5 w-1 -translate-x-1.5 -translate-y-1/2 rounded-full bg-coral" />}
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
