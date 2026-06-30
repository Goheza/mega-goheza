import { createFileRoute } from "@tanstack/react-router";
import { Shield, AlertTriangle, Ban, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/moderation")({
  component: AdminModerationPage,
});

const flagged = [
  { id: "f1", user: "@ghost_views", reason: "Suspiciously high view velocity — possible bot traffic", level: "Urgent" },
  { id: "f2", user: "Obima", reason: "Off-policy brief language flagged by automated scan", level: "High" },
  { id: "f3", user: "@bayosounds", reason: "Reused identical caption across 4 campaigns", level: "Medium" },
];

function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Moderation</h1>
        <p className="text-sm text-muted-foreground">Keep Goheza safe — review flagged content, ban accounts, resolve disputes.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {flagged.map((f) => (
          <article key={f.id} className="rounded-2xl border border-hairline bg-surface-elevated p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.95_0.05_25)] text-[oklch(0.5_0.18_25)]">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                f.level === "Urgent" ? "bg-[oklch(0.95_0.05_25)] text-[oklch(0.5_0.18_25)]" :
                f.level === "High" ? "bg-[oklch(0.96_0.06_55)] text-[oklch(0.5_0.18_45)]" :
                "bg-[oklch(0.95_0.04_268)] text-[oklch(0.4_0.14_268)]"
              }`}>{f.level}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">{f.user}</p>
            <p className="mt-1 text-xs text-muted-foreground">{f.reason}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <button className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-ink/5"><EyeOff className="h-3 w-3" /> Hide</button>
              <button className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-ink/85"><Shield className="h-3 w-3" /> Review</button>
              <button className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]"><Ban className="h-3 w-3" /> Ban</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
