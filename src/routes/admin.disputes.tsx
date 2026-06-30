import { createFileRoute } from "@tanstack/react-router";
import { adminDisputes, formatMoney } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/disputes")({
  component: AdminDisputesPage,
});

function AdminDisputesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Dispute Resolution</h1>
        <p className="text-sm text-muted-foreground">Review evidence and decide each dispute: refund brand, pay creator, or split.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {adminDisputes.map((d) => (
          <article key={d.id} className="rounded-2xl border border-hairline bg-surface-elevated p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[oklch(0.55_0.18_45)]">{d.type}</p>
                <p className="font-display mt-1 text-lg font-semibold text-ink">{d.campaign}</p>
                <p className="text-[12px] text-muted-foreground">{d.brand} vs {d.creator}</p>
              </div>
              <p className="font-display shrink-0 text-xl font-bold text-ink">{formatMoney(d.amount)}</p>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Opened {d.opened} · {d.status}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button className="rounded-full bg-[oklch(0.5_0.14_152)] px-3 py-2 text-xs font-semibold text-white hover:bg-[oklch(0.45_0.14_152)]">Pay creator</button>
              <button className="rounded-full border border-hairline bg-background px-3 py-2 text-xs font-semibold text-ink hover:bg-ink/5">Split</button>
              <button className="rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-3 py-2 text-xs font-semibold text-[oklch(0.5_0.18_25)]">Refund brand</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
