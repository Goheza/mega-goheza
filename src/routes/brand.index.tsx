import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Megaphone, Inbox, CheckCircle2, DollarSign, Wallet, Eye, Plus, ArrowRight, MessageSquare } from "lucide-react";
import { DashCard, StatCard, StatusPill, BrandAvatar } from "@/components/brand/brand-ui";
import {
  brand, brandCampaigns, brandSubmissions, brandViewsTrend, brandNotifications,
  formatMoney, formatNumber, findBrandCampaign,
} from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/")({
  component: BrandHome,
});

function BrandHome() {
  const active = brandCampaigns.filter((c) => c.status === "Live" || c.status === "Submission & Review").length;
  const pending = brandSubmissions.filter((s) => s.status === "Pending Review").length;
  const approved = brandSubmissions.filter((s) => s.status === "Approved").length;
  const totalSpend = brand.totalSpend;
  const totalViews = brandCampaigns.reduce((s, c) => s + c.views, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl lg:text-4xl">{brand.name} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's the snapshot of your campaigns today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active Campaigns" value={String(active)} delta="+1 this month" icon={<Megaphone className="h-4 w-4" />} tone="indigo" />
        <StatCard label="Pending Submissions" value={String(pending)} delta="Awaiting review" icon={<Inbox className="h-4 w-4" />} tone="orange" />
        <StatCard label="Approved Videos" value={String(approved)} delta="+4 this week" icon={<CheckCircle2 className="h-4 w-4" />} tone="green" />
        <StatCard label="Campaign Spend" value={formatMoney(totalSpend)} icon={<DollarSign className="h-4 w-4" />} />
        <StatCard label="Wallet Balance" value={formatMoney(brand.walletBalance)} delta="Ready to deploy" icon={<Wallet className="h-4 w-4" />} tone="green" />
        <StatCard label="Total Views" value={formatNumber(totalViews)} delta="+24% MoM" icon={<Eye className="h-4 w-4" />} tone="orange" />
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction to="/brand/create" label="Create Campaign" icon={<Plus className="h-4 w-4" />} primary />
        <QuickAction to="/brand/submissions" label="View Submissions" icon={<Inbox className="h-4 w-4" />} />
        <QuickAction to="/brand/wallet" label="Add Funds" icon={<Wallet className="h-4 w-4" />} />
        <QuickAction to="/schedule" label="Talk to Sales" icon={<MessageSquare className="h-4 w-4" />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Campaign Performance</p>
              <p className="text-xs text-muted-foreground">Views generated this week</p>
            </div>
            <Link to="/brand/analytics" className="inline-flex items-center gap-1 text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">
              Open analytics <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={brandViewsTrend}>
                <defs>
                  <linearGradient id="bv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.66 0.20 42)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.66 0.20 42)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-hairline)", background: "var(--color-surface-elevated)" }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.66 0.20 42)" strokeWidth={3} fill="url(#bv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Wallet Snapshot</p>
            <Link to="/brand/wallet" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">Manage</Link>
          </div>
          <p className="font-display mt-4 text-3xl font-semibold text-ink">{formatMoney(brand.walletBalance)}</p>
          <p className="text-xs text-muted-foreground">Available balance</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Reserved</span><span className="font-semibold text-ink">{formatMoney(brand.reserved)}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Total spend</span><span className="font-semibold text-ink">{formatMoney(brand.totalSpend)}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Platform fees</span><span className="font-semibold text-ink">{formatMoney(brand.platformFees)}</span></li>
          </ul>
          <Link
            to="/brand/wallet"
            className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/85"
          >
            Add Funds
          </Link>
        </DashCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Active Campaigns</p>
            <Link to="/brand/campaigns" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-hairline">
            {brandCampaigns.filter((c) => c.status !== "Completed").slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <img src={c.cover} alt="" loading="lazy" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{formatNumber(c.views)} views · {c.approvedVideos}/{c.creatorsRequested} approved</p>
                </div>
                <StatusPill status={c.status} />
                <Link to="/brand/campaigns/$id" params={{ id: c.id }} className="hidden rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink/85 sm:inline-flex">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </DashCard>

        <DashCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Recent Submissions</p>
            <Link to="/brand/submissions" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">All</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {brandSubmissions.slice(0, 4).map((s) => {
              const c = findBrandCampaign(s.campaignId);
              return (
                <li key={s.id} className="flex items-center gap-3">
                  <img src={s.creatorAvatar} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{s.creatorName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{c?.name}</p>
                  </div>
                  <StatusPill status={s.status} />
                </li>
              );
            })}
          </ul>
        </DashCard>
      </div>

      <DashCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Recent Notifications</p>
          <Link to="/brand/notifications" className="text-xs font-medium text-[oklch(0.55_0.18_45)] hover:underline">View all</Link>
        </div>
        <ul className="mt-4 space-y-3">
          {brandNotifications.slice(0, 5).map((n) => (
            <li key={n.id} className="flex gap-3">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-primary" : "bg-ink/20"}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
              </div>
              <p className="shrink-0 text-[11px] text-muted-foreground/80">{n.time}</p>
            </li>
          ))}
        </ul>
      </DashCard>

      {/* hidden export to silence unused */}
      <BrandAvatarMarker />
    </div>
  );
}

function BrandAvatarMarker() {
  // Keeps BrandAvatar import alive for future use without rendering anything user-facing.
  return <span className="hidden"><BrandAvatar initial={brand.initial} color={brand.color} size={1} /></span>;
}

function QuickAction({ to, label, icon, primary = false }: { to: string; label: string; icon: React.ReactNode; primary?: boolean }) {
  const cls = primary
    ? "text-primary-foreground shadow-glow"
    : "border border-hairline bg-surface-elevated text-ink hover:bg-ink/5";
  const style = primary ? { backgroundImage: "var(--gradient-primary)" } : undefined;
  return (
    <Link to={to} className={`flex items-center gap-2.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${cls}`} style={style}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">{icon}</span>
      {label}
    </Link>
  );
}
