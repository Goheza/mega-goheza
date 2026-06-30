import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, DashCard, StatusPill, StatCard } from "@/components/brand/brand-ui";
import { brandCampaigns, CAMPAIGN_TYPE_META, formatMoney, formatNumber } from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/analytics/")({
  head: () => ({ meta: [{ title: "Analytics — Goheza" }] }),
  component: AnalyticsPicker,
});

function AnalyticsPicker() {
  const totals = brandCampaigns.reduce(
    (acc, c) => ({
      views: acc.views + c.views,
      spend: acc.spend + c.budgetUsed,
      approved: acc.approved + c.approvedVideos,
    }),
    { views: 0, spend: 0, approved: 0 },
  );
  const cpm = totals.views > 0 ? (totals.spend / totals.views) * 1000 : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Select a campaign to view enterprise-grade insights — engagement, demographics, traffic and per-video performance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Views" value={formatNumber(totals.views)} tone="orange" />
        <StatCard label="Total Spend" value={formatMoney(totals.spend)} tone="indigo" />
        <StatCard label="Avg CPM" value={formatMoney(cpm)} tone="green" />
        <StatCard label="Approved Videos" value={String(totals.approved)} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {brandCampaigns.map((c) => {
          const meta = CAMPAIGN_TYPE_META[c.type];
          return (
            <Link
              key={c.id}
              to="/brand/analytics/$id"
              params={{ id: c.id }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-elevated shadow-card transition-transform hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                <img src={c.cover} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3"><StatusPill status={c.status} /></span>
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{meta.label}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-display text-lg font-semibold text-ink">{c.name}</p>
                <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <Mini label="Views" value={formatNumber(c.views)} />
                  <Mini label="Spend" value={formatMoney(c.budgetUsed)} />
                  <Mini label="Approved" value={String(c.approvedVideos)} />
                </dl>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[oklch(0.55_0.18_45)]">
                  View analytics <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {brandCampaigns.length === 0 && (
        <DashCard className="text-center text-sm text-muted-foreground">No campaigns yet. Launch one to see analytics.</DashCard>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink/5 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-ink">{value}</p>
    </div>
  );
}
