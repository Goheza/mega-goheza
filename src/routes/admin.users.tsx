import { createFileRoute } from "@tanstack/react-router";
import { adminUsers, formatMoney } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">User Management</h1>
        <p className="text-sm text-muted-foreground">All brands and creators on the platform. Suspend, verify, adjust wallets and review flags.</p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-hairline bg-surface-elevated">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-hairline bg-[oklch(0.97_0.012_78)] text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Country</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Flag</th>
              <th className="px-3 py-3 text-right">Spent / Earned</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {adminUsers.map((u) => (
              <tr key={u.id} className="hover:bg-ink/[0.02]">
                <td className="px-5 py-3">
                  <p className="font-semibold text-ink">{u.name}</p>
                  {u.handle && <p className="text-[11px] text-muted-foreground">{u.handle}</p>}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{u.type}</td>
                <td className="px-3 py-3 text-muted-foreground">{u.country}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    u.status === "Active" ? "bg-[oklch(0.94_0.08_152)] text-[oklch(0.36_0.12_152)]" :
                    u.status === "Pending" ? "bg-[oklch(0.96_0.06_55)] text-[oklch(0.45_0.16_45)]" :
                    "bg-[oklch(0.95_0.05_25)] text-[oklch(0.5_0.18_25)]"
                  }`}>{u.status}</span>
                </td>
                <td className="px-3 py-3">
                  {u.flag === "fraud" && <span className="rounded-full bg-[oklch(0.95_0.05_25)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.5_0.18_25)]">⚠️ Fraud</span>}
                  {u.flag === "review" && <span className="rounded-full bg-[oklch(0.96_0.06_55)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.5_0.18_45)]">Review</span>}
                  {u.flag === "none" && <span className="text-[11px] text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-3 text-right font-semibold text-ink">{formatMoney(u.spent ?? u.earned ?? 0)}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1.5">
                    <button className="rounded-full border border-hairline bg-background px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-ink/5">Verify</button>
                    <button className="rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]">Suspend</button>
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
