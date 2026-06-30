import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DashCard, PageHeader, StatusPill } from "@/components/brand/brand-ui";
import { brandSubmissions, brandCampaigns, formatNumber, type BrandSubmission } from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/submissions")({
  head: () => ({ meta: [{ title: "Submissions — Goheza" }] }),
  component: SubmissionsQueue,
});

const STATUS_FILTERS = ["All", "Pending Review", "Approved", "Needs Revision", "Rejected"] as const;
type StatusF = (typeof STATUS_FILTERS)[number];

function SubmissionsQueue() {
  const grouped = useMemo(() => {
    return brandCampaigns
      .map((c) => ({
        campaign: c,
        subs: brandSubmissions.filter((s) => s.campaignId === c.id),
      }))
      .filter((g) => g.subs.length > 0);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Submissions" subtitle="Review submissions grouped by campaign. Each campaign respects its own submission and approval limits." />
      {grouped.map(({ campaign, subs }) => (
        <CampaignGroup key={campaign.id} campaignId={campaign.id} campaignName={campaign.name} campaignCover={campaign.cover} subs={subs} approvalCap={campaign.creatorsRequested} approvedSoFar={campaign.approvedVideos} />
      ))}
      {grouped.length === 0 && (
        <DashCard className="text-center text-sm text-muted-foreground">No submissions yet.</DashCard>
      )}
    </div>
  );
}

function CampaignGroup({
  campaignId, campaignName, campaignCover, subs, approvalCap, approvedSoFar,
}: {
  campaignId: string;
  campaignName: string;
  campaignCover: string;
  subs: BrandSubmission[];
  approvalCap: number;
  approvedSoFar: number;
}) {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<StatusF>("All");
  const slotCap = approvalCap * 2;
  const visibleSubs = subs.slice(0, slotCap);
  const filtered = visibleSubs.filter((s) => filter === "All" || s.status === filter);

  return (
    <DashCard className="p-0 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-ink/[0.02] sm:px-6"
      >
        <img src={campaignCover} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold text-ink sm:text-lg">{campaignName}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {visibleSubs.length} of {slotCap} submission slots · {approvedSoFar} / {approvalCap} approved
          </p>
        </div>
        <Link to="/brand/campaigns/$id" params={{ id: campaignId }} onClick={(e) => e.stopPropagation()} className="hidden text-xs font-semibold text-[oklch(0.55_0.18_45)] hover:underline sm:inline">
          Open campaign →
        </Link>
        {open ? <ChevronDown className="h-4 w-4 text-ink-soft" /> : <ChevronRight className="h-4 w-4 text-ink-soft" />}
      </button>

      {open && (
        <div className="border-t border-hairline px-4 py-5 sm:px-6">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => {
              const count = f === "All" ? visibleSubs.length : visibleSubs.filter((s) => s.status === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    filter === f ? "bg-ink text-white" : "border border-hairline bg-background text-ink hover:bg-ink/5"
                  }`}
                >
                  {f} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {approvedSoFar >= approvalCap && (
            <div className="mt-4 rounded-xl border border-[oklch(0.85_0.06_55)] bg-[oklch(0.97_0.04_55)] p-3">
              <p className="text-xs font-semibold text-[oklch(0.5_0.18_45)]">
                Approval limit reached — unlock more slots from the campaign page to approve additional creators.
              </p>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="mt-4 py-6 text-center text-sm text-muted-foreground">No submissions in this filter.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <article key={s.id} className="overflow-hidden rounded-2xl border border-hairline bg-background">
                  <div className="relative aspect-video overflow-hidden bg-ink">
                    <img src={s.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3"><StatusPill status={s.status} /></span>
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-ink">{s.platform}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={s.creatorAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{s.creatorName}</p>
                        <p className="text-[11px] text-muted-foreground">Submitted {s.submittedAt}</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{s.caption}</p>
                    {s.views !== undefined && s.status === "Approved" && (
                      <p className="mt-2 text-[11px] text-muted-foreground">{formatNumber(s.views)} views</p>
                    )}
                    {s.status === "Pending Review" && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                          disabled={approvedSoFar >= approvalCap}
                          className="rounded-full bg-[oklch(0.5_0.14_152)] px-3 py-2 text-xs font-semibold text-white hover:bg-[oklch(0.45_0.14_152)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button className="rounded-full border border-hairline bg-background px-3 py-2 text-xs font-semibold text-ink hover:bg-ink/5">Revise</button>
                        <button className="rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-3 py-2 text-xs font-semibold text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]">Reject</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </DashCard>
  );
}
