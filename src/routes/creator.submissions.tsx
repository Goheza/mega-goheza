import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Eye, DollarSign } from "lucide-react";
import { DashCard, PageHeader, StatusPill, BrandAvatar } from "@/components/creator/dash-ui";
import { applications, findCampaign, formatMoney, formatNumber, submissions } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/submissions")({
  head: () => ({ meta: [{ title: "My Campaigns — Goheza" }] }),
  component: MyCampaigns,
});

const STAGES = ["Applied", "Submitted", "Pending Review", "Approved", "Live"] as const;

type StageName = typeof STAGES[number];

function stageIndexFor(appStatus: string, hasSubmission: boolean, subStatus?: string): number {
  if (appStatus === "Rejected") return 0;
  if (!hasSubmission) {
    if (appStatus === "Pending Review") return 0;
    return 0; // applied only
  }
  if (subStatus === "Live") return 4;
  if (subStatus === "Approved") return 3;
  if (subStatus === "Pending Review" || subStatus === "Needs Revision") return 2;
  return 1; // submitted
}

const REWARDS_PER_K = 4.2; // demo

function MyCampaigns() {
  const items = applications.map((app) => {
    const campaign = findCampaign(app.campaignId)!;
    const sub = submissions.find((s) => s.campaignId === app.campaignId);
    const stageIdx = stageIndexFor(app.status, !!sub, sub?.status);
    const earnings = sub?.views ? (sub.views / 1000) * REWARDS_PER_K : 0;
    return { app, campaign, sub, stageIdx, earnings };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Campaigns"
        subtitle="Your complete campaign journey — from application to live performance."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {items.map(({ app, campaign, sub, stageIdx, earnings }) => (
          <DashCard key={app.id} className="p-0 overflow-hidden">
            <div className="flex gap-4 p-5 sm:p-6">
              {sub ? (
                <img src={sub.thumb} alt="" loading="lazy" className="h-24 w-20 shrink-0 rounded-xl object-cover sm:h-28 sm:w-24" />
              ) : (
                <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-ink/5 sm:h-28 sm:w-24">
                  <BrandAvatar initial={campaign.brandInitial} color={campaign.brandColor} size={48} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{campaign.brand}</p>
                    <p className="truncate font-display text-base font-semibold text-ink">{campaign.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Applied {app.appliedAt}{sub ? ` · Submitted ${sub.submittedAt}` : ""}
                    </p>
                  </div>
                  <StatusPill status={sub?.status ?? app.status} />
                </div>

                {sub && sub.status === "Live" && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <Metric icon={<Eye className="h-3 w-3" />} label="Views" value={formatNumber(sub.views)} />
                    <Metric icon={<DollarSign className="h-3 w-3" />} label="Earned" value={formatMoney(earnings)} />
                  </div>
                )}
                {(app.note || sub?.feedback) && (
                  <p className="mt-3 rounded-xl bg-[oklch(0.96_0.04_55)] p-2.5 text-[11px] text-[oklch(0.45_0.14_45)]">
                    <span className="font-semibold">Feedback:</span> {sub?.feedback ?? app.note}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-hairline bg-[oklch(0.97_0.012_78)] px-5 py-4 sm:px-6">
              <ProgressTracker currentStage={stageIdx} rejected={app.status === "Rejected"} />
              <div className="mt-4 flex justify-end">
                <Link
                  to="/creator/campaigns/$id"
                  params={{ id: campaign.id }}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink/85"
                >
                  View Details
                </Link>
              </div>
            </div>
          </DashCard>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-ink/5 px-3 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="ml-auto text-[11px] font-semibold text-ink">{value}</span>
    </div>
  );
}

function ProgressTracker({ currentStage, rejected }: { currentStage: number; rejected: boolean }) {
  return (
    <div className="flex items-center">
      {STAGES.map((stage, i) => {
        const done = !rejected && i <= currentStage;
        const isCurrent = !rejected && i === currentStage;
        return (
          <div key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : rejected
                      ? "bg-[oklch(0.94_0.05_25)] text-[oklch(0.5_0.18_25)]"
                      : "bg-ink/10 text-ink/40"
                } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-[oklch(0.97_0.012_78)]" : ""}`}
                style={done ? { backgroundImage: "var(--gradient-primary)" } : undefined}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={`whitespace-nowrap text-[9px] font-medium sm:text-[10px] ${done || isCurrent ? "text-ink" : "text-muted-foreground"}`}>
                {stage as StageName}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span className={`mx-1 h-0.5 flex-1 sm:mx-2 ${i < currentStage && !rejected ? "bg-primary" : "bg-ink/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
