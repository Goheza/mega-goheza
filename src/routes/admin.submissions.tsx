import { createFileRoute } from "@tanstack/react-router";
import { adminCampaigns } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/submissions")({
  component: AdminSubmissionsPage,
});

const STATUS_OPTIONS = ["All", "Pending", "Approved", "Rejected", "Revision"] as const;

function AdminSubmissionsPage() {
  // Stub: surface across campaigns
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Submissions Review</h1>
        <p className="text-sm text-muted-foreground">Global submissions feed across all brands. Override decisions, flag content, mark disputes.</p>
      </header>

      <div className="rounded-2xl border border-hairline bg-surface-elevated p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button key={s} className="rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">{s}</button>
          ))}
          <input placeholder="Filter by campaign, brand, creator…" className="ml-auto w-full rounded-full border border-hairline bg-background px-4 py-1.5 text-sm sm:w-64" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminCampaigns.slice(0, 6).map((c) => (
          <article key={c.id} className="rounded-2xl border border-hairline bg-surface-elevated p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{c.brand}</p>
            <p className="font-display mt-1 text-base font-semibold text-ink">{c.name}</p>
            <p className="mt-2 text-xs text-muted-foreground">{Math.floor(Math.random() * 12 + 2)} pending · {Math.floor(Math.random() * 30 + 4)} approved</p>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-full bg-[oklch(0.5_0.14_152)] px-3 py-2 text-xs font-semibold text-white hover:bg-[oklch(0.45_0.14_152)]">Force approve</button>
              <button className="flex-1 rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-3 py-2 text-xs font-semibold text-[oklch(0.5_0.18_25)]">Flag</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
