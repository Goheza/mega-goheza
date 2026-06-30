import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  UserPlus, Users, Megaphone, Inbox, CheckCircle2, DollarSign, ArrowDownToLine,
  Wallet, FileText, AlertTriangle, MessageCircle, Sparkles,
} from "lucide-react";
import { adminMetrics, adminActivity, adminGrowth, adminRevenue, formatMoney, type ActivityKind } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

const iconForKind: Record<ActivityKind, React.ReactNode> = {
  brand_signup: <UserPlus className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  creator_signup: <Users className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  campaign_created: <Megaphone className="h-4 w-4 text-[oklch(0.55_0.18_45)]" />,
  submission_new: <Inbox className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  submission_approved: <CheckCircle2 className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  submission_rejected: <AlertTriangle className="h-4 w-4 text-[oklch(0.5_0.18_25)]" />,
  wallet_topup: <Wallet className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  withdrawal: <ArrowDownToLine className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  invoice_request: <FileText className="h-4 w-4 text-ink-soft" />,
  support_open: <MessageCircle className="h-4 w-4 text-[oklch(0.5_0.14_268)]" />,
  support_resolved: <CheckCircle2 className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />,
  fraud_alert: <AlertTriangle className="h-4 w-4 text-[oklch(0.55_0.18_25)]" />,
};

function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Platform Snapshot</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time view of every brand, creator, campaign and dollar flowing through Goheza.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {adminMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Brand & Creator Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="brands" stroke="oklch(0.55 0.18 268)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="creators" stroke="oklch(0.66 0.20 42)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Platform Revenue (MoM)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Bar dataKey="revenue" fill="oklch(0.66 0.20 42)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Live Activity Feed" desc="Last few hours">
        <ul className="divide-y divide-hairline">
          {adminActivity.map((a) => (
            <li key={a.id} className="flex items-start gap-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-elevated ring-1 ring-hairline">
                {iconForKind[a.kind]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="truncate text-[12px] text-muted-foreground">{a.meta}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "orange" | "indigo" | "green" | "navy" }) {
  const toneClass =
    tone === "orange" ? "border-[oklch(0.85_0.10_55)] bg-[oklch(0.98_0.04_55)]" :
    tone === "indigo" ? "border-[oklch(0.85_0.06_268)] bg-[oklch(0.98_0.02_268)]" :
    tone === "green"  ? "border-[oklch(0.85_0.10_152)] bg-[oklch(0.98_0.03_152)]" :
    tone === "navy"   ? "border-[oklch(0.40_0.06_268)] bg-ink text-white"
                      : "border-hairline bg-surface-elevated";
  const textTone = tone === "navy" ? "text-white/70" : "text-muted-foreground";
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${textTone}`}>{label}</p>
      <p className={`font-display mt-1 text-2xl font-semibold ${tone === "navy" ? "text-white" : "text-ink"}`}>{value}</p>
      {delta && <p className={`mt-1 text-[11px] ${tone === "navy" ? "text-white/70" : "text-muted-foreground"}`}>{delta}</p>}
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-elevated p-5 shadow-card sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-ink"><Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-[oklch(0.55_0.18_45)]" />{title}</p>
        {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
