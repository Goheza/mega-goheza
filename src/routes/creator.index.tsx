import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, Wallet, Megaphone, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { DashCard, StatCard, StatusPill, BrandAvatar } from "@/components/creator/dash-ui";
import { applications, campaigns, creator, earningsTrend, formatMoney, formatNumber, notifications, transactions } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/")({
  component: DashboardHome,
});

function DashboardHome() {
  const active = applications.filter((a) => a.status === "Approved" || a.status === "Selected").length;
  const pending = applications.filter((a) => a.status === "Pending Review" || a.status === "Needs Revision").length;
  const lifetime = earningsTrend.reduce((s, e) => s + e.earnings, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">{creator.name} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your campaigns today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Earnings" value={formatMoney(lifetime)} delta="+18.4% this month" icon={<DollarSign className="h-4 w-4" />} tone="orange" />
        <StatCard label="Wallet Balance" value={formatMoney(818.9)} delta="Ready to withdraw" icon={<Wallet className="h-4 w-4" />} tone="green" />
        <StatCard label="Active Campaigns" value={String(active)} delta={`${campaigns.length} open globally`} icon={<Megaphone className="h-4 w-4" />} tone="indigo" />
        <StatCard label="Pending Reviews" value={String(pending)} delta="Avg. 2 days" icon={<Clock className="h-4 w-4" />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Earnings Trend</p>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Link to="/creator/earnings" className="inline-flex items-center gap-1 text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">
              Details <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--color-hairline)", background: "var(--color-surface-elevated)" }}
                  formatter={(v: number) => formatMoney(v)}
                />
                <Line type="monotone" dataKey="earnings" stroke="oklch(0.66 0.20 42)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.66 0.20 42)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Creator Progress</p>
            <span className="rounded-full bg-[oklch(0.94_0.07_55)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.5_0.18_45)]">{creator.level}</span>
          </div>
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">{creator.progress}%</p>
              <p className="text-xs text-muted-foreground">to next tier</p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/5">
              <div className="h-full rounded-full" style={{ width: `${creator.progress}%`, backgroundImage: "var(--gradient-primary)" }} />
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
            <li>• Complete 3 more campaigns to reach Elite</li>
            <li>• Maintain a 90%+ approval rate</li>
            <li>• Submit on time for 5 campaigns in a row</li>
          </ul>
        </DashCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Recent Campaigns</p>
            <Link to="/creator/campaigns" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">Browse all</Link>
          </div>
          <ul className="mt-4 divide-y divide-hairline">
            {campaigns.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <BrandAvatar initial={c.brandInitial} color={c.brandColor} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.brand} · {c.platforms.join(", ")}</p>
                </div>
                <p className="hidden text-right text-xs text-muted-foreground sm:block">{formatMoney(c.rewardPerK)} / 1k views</p>
                <Link
                  to="/creator/campaigns/$id"
                  params={{ id: c.id }}
                  className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink/85"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </DashCard>

        <DashCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Latest Payments</p>
            <Link to="/creator/wallet" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">Wallet</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {transactions.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{t.desc}</p>
                  <p className="text-[11px] text-muted-foreground">{t.date}</p>
                </div>
                <p className={`text-sm font-semibold ${t.kind === "credit" ? "text-[oklch(0.45_0.14_152)]" : "text-ink"}`}>
                  {t.kind === "credit" ? "+" : ""}{formatMoney(t.amount)}
                </p>
              </li>
            ))}
          </ul>
        </DashCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Recent Notifications</p>
            <Link to="/creator/notifications" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">View all</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className="flex gap-3">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-primary" : "bg-ink/20"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                </div>
                <p className="text-[11px] text-muted-foreground/80">{n.time}</p>
              </li>
            ))}
          </ul>
        </DashCard>

        <DashCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Suggested Campaigns</p>
            <Sparkles className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />
          </div>
          <ul className="mt-4 space-y-3">
            {campaigns.slice(2, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-background p-3">
                <BrandAvatar initial={c.brandInitial} color={c.brandColor} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">Est. {formatMoney(c.estEarnings.min)}–{formatMoney(c.estEarnings.max)} · {formatNumber(c.creatorsNeeded)} creators</p>
                </div>
                <StatusPill status={c.status} />
              </li>
            ))}
          </ul>
        </DashCard>
      </div>
    </div>
  );
}
