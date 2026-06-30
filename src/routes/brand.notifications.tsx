import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Sparkles, DollarSign, Clock, FileText, Users, Award, Calendar, Zap, MessageCircle, Inbox } from "lucide-react";
import { DashCard, PageHeader } from "@/components/brand/brand-ui";
import { brandNotifications, type BrandNotifKind } from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Goheza" }] }),
  component: NotificationsPage,
});

const FILTERS = ["All", "Campaigns", "Submissions", "Wallet", "Analytics", "Support", "Platform"] as const;

const ICONS: Record<BrandNotifKind, React.ReactNode> = {
  application: <Users className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  submission: <Sparkles className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  revision: <AlertTriangle className="h-4 w-4 text-[oklch(0.5_0.18_45)]" />,
  approval: <CheckCircle2 className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  submission_limit: <Inbox className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  phase_change: <Zap className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  campaign_end: <Clock className="h-4 w-4 text-ink-soft" />,
  milestone_payment: <DollarSign className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  milestone_views: <Award className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  wallet_low: <AlertTriangle className="h-4 w-4 text-[oklch(0.5_0.18_25)]" />,
  payment_processed: <DollarSign className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  invoice: <FileText className="h-4 w-4 text-ink-soft" />,
  platform: <Sparkles className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  support: <MessageCircle className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  meeting: <Calendar className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
};

function NotificationsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(
    () => brandNotifications.filter((n) => filter === "All" || n.category === filter),
    [filter],
  );

  const groups = useMemo(() => {
    const today: typeof filtered = [];
    const yesterday: typeof filtered = [];
    const earlier: typeof filtered = [];
    filtered.forEach((n) => {
      if (n.daysAgo === 0) today.push(n);
      else if (n.daysAgo === 1) yesterday.push(n);
      else earlier.push(n);
    });
    return { today, yesterday, earlier };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Everything that's happened across your campaigns, wallet and account."
        action={
          <button className="rounded-full border border-hairline bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
            Mark all read
          </button>
        }
      />

      <DashCard>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f ? "text-primary-foreground shadow-sm" : "border border-hairline bg-background text-ink hover:bg-ink/5"
              }`}
              style={filter === f ? { backgroundImage: "var(--gradient-primary)" } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
      </DashCard>

      <DashCard className="p-0 overflow-hidden">
        <Group title="Today" items={groups.today} />
        <Group title="Yesterday" items={groups.yesterday} />
        <Group title="Earlier" items={groups.earlier} />
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground">
            <Bell className="h-6 w-6" />
            No notifications in this category.
          </div>
        )}
      </DashCard>
    </div>
  );
}

function Group({ title, items }: { title: string; items: typeof brandNotifications }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="border-b border-hairline bg-[oklch(0.97_0.012_78)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <ul className="divide-y divide-hairline">
        {items.map((n) => (
          <li key={n.id} className={`flex items-start gap-3 px-5 py-4 transition-colors hover:bg-ink/[0.02] ${!n.read ? "bg-[oklch(0.97_0.02_75)]" : ""}`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-elevated ring-1 ring-hairline">
              {ICONS[n.kind]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">{n.category}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
            </div>
            {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
