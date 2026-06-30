import { createFileRoute } from "@tanstack/react-router";
import { adminTickets } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupportPage,
});

const PRIORITY_TONE: Record<string, string> = {
  Urgent: "bg-[oklch(0.95_0.05_25)] text-[oklch(0.5_0.18_25)]",
  High: "bg-[oklch(0.96_0.06_55)] text-[oklch(0.5_0.18_45)]",
  Medium: "bg-[oklch(0.95_0.04_268)] text-[oklch(0.4_0.14_268)]",
  Low: "bg-ink/5 text-ink-soft",
};

function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Support Tickets</h1>
        <p className="text-sm text-muted-foreground">All brand and creator tickets, filter by priority and category. Reply, escalate or refund.</p>
      </header>

      <div className="grid gap-3 md:hidden">
        {adminTickets.map((t) => (
          <article key={t.id} className="rounded-2xl border border-hairline bg-surface-elevated p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{t.subject}</p>
                <p className="text-[11px] text-muted-foreground">{t.user} · {t.category}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_TONE[t.priority]}`}>{t.priority}</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{t.status} · {t.updated}</p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-hairline bg-surface-elevated md:block">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-hairline bg-[oklch(0.97_0.012_78)] text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Subject</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {adminTickets.map((t) => (
              <tr key={t.id} className="hover:bg-ink/[0.02]">
                <td className="px-5 py-3 font-semibold text-ink">{t.subject}</td>
                <td className="px-3 py-3 text-muted-foreground">{t.user}</td>
                <td className="px-3 py-3 text-muted-foreground">{t.category}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_TONE[t.priority]}`}>{t.priority}</span></td>
                <td className="px-3 py-3 text-muted-foreground">{t.status}</td>
                <td className="px-3 py-3 text-muted-foreground">{t.updated}</td>
                <td className="px-5 py-3 text-right">
                  <button className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-ink/85">Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
