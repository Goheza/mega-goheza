import { createFileRoute } from "@tanstack/react-router";
import { formatMoney } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/wallet")({
  component: AdminWalletPage,
});

const flows = [
  { label: "Total Money in Platform", value: 1_420_000, tone: "navy" as const },
  { label: "Brand Deposits (MTD)", value: 384_000, tone: "indigo" as const },
  { label: "Creator Earnings Pending", value: 48_210, tone: "orange" as const },
  { label: "Creator Withdrawals Paid", value: 162_400, tone: "green" as const },
  { label: "Platform Revenue", value: 284_910, tone: "orange" as const },
  { label: "Reserved Campaign Funds", value: 612_300, tone: "indigo" as const },
  { label: "Outstanding Invoices", value: 72_580 },
];

function AdminWalletPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Wallet & Finance</h1>
        <p className="text-sm text-muted-foreground">The financial core of Goheza — deposits, payouts, reserved funds and revenue.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {flows.map((f) => (
          <FlowCard key={f.label} {...f} />
        ))}
      </div>

      <section className="rounded-2xl border border-hairline bg-surface-elevated p-5 sm:p-6">
        <p className="text-sm font-semibold text-ink">Admin Treasury Actions</p>
        <p className="mt-1 text-xs text-muted-foreground">Direct overrides only — every action is logged and audited.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Action label="Top up brand wallet" tone="primary" />
          <Action label="Deduct brand wallet" />
          <Action label="Freeze wallet" tone="danger" />
          <Action label="Issue refund" />
          <Action label="Approve creator payout" tone="primary" />
          <Action label="Reject creator payout" tone="danger" />
          <Action label="Adjust earnings" />
          <Action label="Flag suspicious activity" tone="danger" />
        </div>
      </section>
    </div>
  );
}

function FlowCard({ label, value, tone }: { label: string; value: number; tone?: "orange" | "indigo" | "green" | "navy" }) {
  const toneClass =
    tone === "orange" ? "border-[oklch(0.85_0.10_55)] bg-[oklch(0.98_0.04_55)]" :
    tone === "indigo" ? "border-[oklch(0.85_0.06_268)] bg-[oklch(0.98_0.02_268)]" :
    tone === "green"  ? "border-[oklch(0.85_0.10_152)] bg-[oklch(0.98_0.03_152)]" :
    tone === "navy"   ? "border-[oklch(0.40_0.06_268)] bg-ink text-white"
                      : "border-hairline bg-surface-elevated";
  const muted = tone === "navy" ? "text-white/70" : "text-muted-foreground";
  const big = tone === "navy" ? "text-white" : "text-ink";
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${muted}`}>{label}</p>
      <p className={`font-display mt-1 text-2xl font-semibold ${big}`}>{formatMoney(value)}</p>
    </div>
  );
}

function Action({ label, tone }: { label: string; tone?: "primary" | "danger" }) {
  const cls =
    tone === "primary" ? "bg-ink text-white hover:bg-ink/85" :
    tone === "danger" ? "border border-[oklch(0.85_0.04_25)] bg-[oklch(0.97_0.02_25)] text-[oklch(0.5_0.18_25)] hover:bg-[oklch(0.94_0.04_25)]" :
    "border border-hairline bg-background text-ink hover:bg-ink/5";
  return <button className={`rounded-full px-4 py-2 text-xs font-semibold ${cls}`}>{label}</button>;
}
