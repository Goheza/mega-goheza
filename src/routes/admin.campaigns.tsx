import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { adminCampaigns, formatMoney, formatNumber, type AdminCampaignRow } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/campaigns")({
  component: AdminCampaignsPage,
});

const STATUSES = ["All", "Active", "Pending Payment", "Completed", "Paused", "Draft"] as const;

function AdminCampaignsPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [query, setQuery] = useState("");
  const list = useMemo(
    () =>
      adminCampaigns.filter(
        (c) =>
          (status === "All" || c.status === status) &&
          (!query || `${c.brand} ${c.name}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [status, query],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Campaigns</h1>
        <p className="text-sm text-muted-foreground">Every campaign across the platform — pause, edit, refund or close.</p>
      </header>

      <div className="rounded-2xl border border-hairline bg-surface-elevated p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === s ? "bg-ink text-white" : "border border-hairline bg-background text-ink hover:bg-ink/5"
              }`}
            >
              {s}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or campaign…"
            className="ml-auto w-full rounded-full border border-hairline bg-background px-4 py-1.5 text-sm sm:w-64"
          />
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {list.map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-hairline bg-surface-elevated md:block">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="border-b border-hairline bg-[oklch(0.97_0.012_78)] text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Campaign</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Budget</th>
              <th className="px-3 py-3 text-right">Spend</th>
              <th className="px-3 py-3 text-right">Views</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-ink/[0.02]">
                <td className="px-5 py-3">
                  <p className="font-semibold text-ink">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.brand} · {c.starts} → {c.ends}</p>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{c.type}</td>
                <td className="px-3 py-3"><StatusChip status={c.status} /></td>
                <td className="px-3 py-3 text-right text-ink">{formatMoney(c.budget)}</td>
                <td className="px-3 py-3 text-right text-ink">{formatMoney(c.spend)}</td>
                <td className="px-3 py-3 text-right text-ink">{formatNumber(c.views)}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <IconBtn label="Pause"><Pause className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn label="Resume"><Play className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn label="Close" tone="danger"><X className="h-3.5 w-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CampaignCard({ c }: { c: AdminCampaignRow }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-elevated p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{c.name}</p>
          <p className="text-[11px] text-muted-foreground">{c.brand} · {c.type}</p>
        </div>
        <StatusChip status={c.status} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <Mini label="Budget" value={formatMoney(c.budget)} />
        <Mini label="Spend" value={formatMoney(c.spend)} />
        <Mini label="Views" value={formatNumber(c.views)} />
      </div>
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

function StatusChip({ status }: { status: string }) {
  const m: Record<string, string> = {
    Active: "bg-[oklch(0.94_0.08_152)] text-[oklch(0.36_0.12_152)]",
    "Pending Payment": "bg-[oklch(0.96_0.06_55)] text-[oklch(0.45_0.16_45)]",
    Completed: "bg-ink/10 text-ink",
    Paused: "bg-[oklch(0.94_0.05_25)] text-[oklch(0.5_0.18_25)]",
    Draft: "bg-ink/5 text-ink-soft",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${m[status] ?? "bg-ink/5 text-ink"}`}>{status}</span>;
}

function IconBtn({ children, label, tone }: { children: React.ReactNode; label: string; tone?: "danger" }) {
  return (
    <button
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
        tone === "danger"
          ? "border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]"
          : "border-hairline bg-background text-ink hover:bg-ink/5"
      }`}
    >
      {children}
    </button>
  );
}
