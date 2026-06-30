import { createFileRoute } from "@tanstack/react-router";
import { Copy, Gift, Share2 } from "lucide-react";
import { useState } from "react";
import { DashCard, PageHeader, StatCard } from "@/components/creator/dash-ui";

export const Route = createFileRoute("/creator/referrals")({
  component: Referrals,
});

const leaderboard = [
  { name: "Liyana M.", refs: 142, earned: 1420 },
  { name: "Tunde A.", refs: 96, earned: 960 },
  { name: "You", refs: 12, earned: 120 },
  { name: "Kwame O.", refs: 8, earned: 80 },
];

function Referrals() {
  const link = "https://goheza.com/r/naledi";
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Referral Program" subtitle="Invite friends to Goheza. Earn rewards when they complete their first campaign." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your Referrals" value="12" tone="orange" icon={<Gift className="h-4 w-4" />} />
        <StatCard label="Total Earned" value="$120" tone="green" />
        <StatCard label="Pending" value="$45" tone="indigo" />
      </div>

      <DashCard>
        <p className="text-sm font-semibold text-ink">Your Referral Link</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-full border border-hairline bg-background px-4 py-3 text-sm text-ink"
          />
          <button
            onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-background px-5 py-3 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Share2 className="h-4 w-4" /> Invite Friends
          </button>
        </div>
      </DashCard>

      <DashCard>
        <p className="text-sm font-semibold text-ink">Top Referrers — This Month</p>
        <ol className="mt-4 space-y-2">
          {leaderboard.map((r, i) => (
            <li key={r.name} className={`flex items-center justify-between rounded-xl px-4 py-3 ${r.name === "You" ? "bg-[oklch(0.96_0.04_55)] ring-1 ring-[oklch(0.55_0.18_45)]/30" : "bg-background"}`}>
              <span className="flex items-center gap-3">
                <span className="font-display text-base font-semibold text-ink">#{i + 1}</span>
                <span className="text-sm font-medium text-ink">{r.name}</span>
              </span>
              <span className="text-sm text-muted-foreground">{r.refs} refs · ${r.earned}</span>
            </li>
          ))}
        </ol>
      </DashCard>
    </div>
  );
}
