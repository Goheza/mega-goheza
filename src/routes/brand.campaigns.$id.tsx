import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Unlock } from "lucide-react";
import { DashCard, StatCard, StatusPill, PhaseTimeline } from "@/components/brand/brand-ui";
import {
  brandSubmissions, findBrandCampaign, formatMoney, formatNumber, CAMPAIGN_TYPE_META,
  type BrandSubmission,
} from "@/components/brand/brand-data";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/brand/campaigns/$id")({
  head: ({ params }) => {
    const c = findBrandCampaign(params.id);
    return { meta: [{ title: `${c?.name ?? "Campaign"} — Goheza` }] };
  },
  loader: ({ params }) => {
    if (!findBrandCampaign(params.id)) throw notFound();
    return null;
  },
  component: CampaignDetail,
  notFoundComponent: () => <div className="p-8 text-center text-sm text-muted-foreground">Campaign not found.</div>,
});

type Tab = "overview" | "submissions" | "analytics" | "settings";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "submissions", label: "Submissions" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

function CampaignDetail() {
  const { id } = useParams({ from: "/brand/campaigns/$id" });
  const c = findBrandCampaign(id)!;
  const [tab, setTab] = useState<Tab>("overview");
  const meta = CAMPAIGN_TYPE_META[c.type];

  const subs = useMemo(() => brandSubmissions.filter((s) => s.campaignId === id), [id]);
  const submissionSlots = c.creatorsRequested * 2; // 2x allowance
  const approvalsUsed = subs.filter((s) => s.status === "Approved").length;
  const atApprovalLimit = approvalsUsed >= c.creatorsRequested;

  return (
    <div className="space-y-6">
      <Link to="/brand/campaigns" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All campaigns
      </Link>

      <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated shadow-card">
        <div className="relative aspect-[24/9] overflow-hidden bg-ink sm:aspect-[32/9]">
          <img src={c.cover} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={c.status} />
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{meta.label}</span>
            </div>
            <h1 className="font-display mt-2 text-xl font-semibold text-white sm:text-3xl">{c.name}</h1>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-hairline px-4 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                tab === t.id ? "border-primary text-ink" : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Creators Approved" value={`${c.approvedVideos} / ${c.creatorsRequested}`} tone="indigo" />
            <StatCard label="Submissions" value={`${c.submissionsReceived} / ${submissionSlots}`} tone="orange" delta={`${submissionSlots} slot cap`} />
            <StatCard label="Total Views" value={formatNumber(c.views)} tone="green" />
            <StatCard label="Budget Used" value={formatMoney(c.budgetUsed)} delta={`of ${formatMoney(c.budgetTotal)}`} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              <DashCard>
                <p className="text-sm font-semibold text-ink">Submission slots</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.submissionsReceived} of {submissionSlots} submission slots received. Brands can review up to 2× their requested creators.
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (c.submissionsReceived / submissionSlots) * 100)}%`,
                      backgroundImage: "var(--gradient-primary)",
                    }}
                  />
                </div>
              </DashCard>

              <DashCard>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Approval limit</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      You can approve up to {c.creatorsRequested} creators on this campaign. ({approvalsUsed} approved)
                    </p>
                  </div>
                  {atApprovalLimit && (
                    <button className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink/85">
                      <Unlock className="h-3.5 w-3.5" /> Unlock Additional Videos
                    </button>
                  )}
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full bg-[oklch(0.5_0.14_152)]"
                    style={{ width: `${Math.min(100, (approvalsUsed / c.creatorsRequested) * 100)}%` }}
                  />
                </div>
              </DashCard>
            </div>

            <PhaseTimeline campaign={c} />
          </div>
        </div>
      )}

      {tab === "submissions" && <SubmissionsList subs={subs} approvalsUsed={approvalsUsed} approvalCap={c.creatorsRequested} />}

      {tab === "analytics" && <CampaignAnalytics campaign={c} />}

      {tab === "settings" && (
        <DashCard>
          <p className="text-sm font-semibold text-ink">Campaign settings</p>
          <p className="mt-1 text-xs text-muted-foreground">Pause, archive or edit your campaign brief.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-full border border-hairline bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">Edit Brief</button>
            <button className="rounded-full border border-hairline bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">Pause Campaign</button>
            <button className="rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-4 py-2 text-sm font-semibold text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]">Archive</button>
          </div>
        </DashCard>
      )}
    </div>
  );
}

function SubmissionsList({ subs, approvalsUsed, approvalCap }: { subs: BrandSubmission[]; approvalsUsed: number; approvalCap: number }) {
  const [reasonFor, setReasonFor] = useState<{ id: string; mode: "reject" | "revision" } | null>(null);
  const [reason, setReason] = useState("");

  if (subs.length === 0) {
    return <DashCard className="text-center text-sm text-muted-foreground">No submissions yet for this campaign.</DashCard>;
  }

  return (
    <div className="space-y-5">
      {approvalsUsed >= approvalCap && (
        <DashCard className="border-[oklch(0.85_0.06_55)] bg-[oklch(0.97_0.04_55)]">
          <p className="text-sm font-semibold text-[oklch(0.5_0.18_45)]">Approval limit reached</p>
          <p className="mt-1 text-xs text-[oklch(0.5_0.18_45)]/80">
            You've approved {approvalsUsed} of {approvalCap} paid creator slots. Unlock more to approve additional videos.
          </p>
        </DashCard>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {subs.map((s) => (
          <DashCard key={s.id} className="p-0 overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-ink">
              <img src={s.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3"><StatusPill status={s.status} /></span>
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-ink">{s.platform}</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <img src={s.creatorAvatar} alt="" loading="lazy" className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{s.creatorName}</p>
                  <p className="text-[11px] text-muted-foreground">Submitted {s.submittedAt}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{s.caption}</p>
              {s.reason && (
                <p className="mt-2 rounded-xl bg-[oklch(0.96_0.04_55)] p-2.5 text-[11px] text-[oklch(0.45_0.14_45)]">
                  <span className="font-semibold">Feedback:</span> {s.reason}
                </p>
              )}
              {s.status === "Pending Review" && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    disabled={approvalsUsed >= approvalCap}
                    className="rounded-full bg-[oklch(0.5_0.14_152)] px-3 py-2 text-xs font-semibold text-white hover:bg-[oklch(0.45_0.14_152)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { setReasonFor({ id: s.id, mode: "revision" }); setReason(""); }}
                    className="rounded-full border border-hairline bg-background px-3 py-2 text-xs font-semibold text-ink hover:bg-ink/5"
                  >
                    Revise
                  </button>
                  <button
                    onClick={() => { setReasonFor({ id: s.id, mode: "reject" }); setReason(""); }}
                    className="rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-3 py-2 text-xs font-semibold text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]"
                  >
                    Reject
                  </button>
                </div>
              )}
              {s.views !== undefined && s.status === "Approved" && (
                <p className="mt-3 text-[11px] text-muted-foreground">{formatNumber(s.views)} views</p>
              )}
            </div>
          </DashCard>
        ))}
      </div>

      {reasonFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
          <DashCard className="w-full max-w-md">
            <p className="font-display text-lg font-semibold text-ink">
              {reasonFor.mode === "reject" ? "Reject submission" : "Request revision"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Please provide a clear reason. The creator will see this and can {reasonFor.mode === "reject" ? "appeal" : "update their submission"}.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="e.g. The opening 3s needs to feature the product clearly."
              className="mt-4 w-full rounded-xl border border-hairline bg-background p-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setReasonFor(null)} className="rounded-full border border-hairline bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
                Cancel
              </button>
              <button
                disabled={!reason.trim()}
                onClick={() => setReasonFor(null)}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </DashCard>
        </div>
      )}
    </div>
  );
}

function CampaignAnalytics({ campaign }: { campaign: ReturnType<typeof findBrandCampaign> & {} }) {
  const c = campaign!;
  const series = [
    { d: "W1", v: Math.round(c.views * 0.1) },
    { d: "W2", v: Math.round(c.views * 0.18) },
    { d: "W3", v: Math.round(c.views * 0.27) },
    { d: "W4", v: Math.round(c.views * 0.45) },
  ];
  const cpm = c.views > 0 ? (c.budgetUsed / c.views) * 1000 : 0;
  const remaining = c.budgetTotal - c.budgetUsed;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Views" value={formatNumber(c.views)} tone="orange" />
        <StatCard label="Spend" value={formatMoney(c.budgetUsed)} />
        <StatCard label="Cost / 1k views" value={formatMoney(cpm)} tone="indigo" />
        <StatCard label="Remaining Budget" value={formatMoney(remaining)} tone="green" />
      </div>
      <DashCard>
        <p className="text-sm font-semibold text-ink">Views over time</p>
        <div className="mt-4 h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
              <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-hairline)", background: "var(--color-surface-elevated)" }} />
              <Bar dataKey="v" fill="oklch(0.66 0.20 42)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashCard>
    </div>
  );
}
