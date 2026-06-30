import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { adminGrowth, adminRevenue, formatMoney } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Platform Analytics</h1>
        <p className="text-sm text-muted-foreground">Growth, financial and content health across all of Goheza.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="DAU" value="3,124" />
        <Stat label="WAU" value="11,820" />
        <Stat label="MAU" value="38,940" />
        <Stat label="Creator growth (MoM)" value="+22%" />
        <Stat label="Brand acquisition (MoM)" value="+11%" />
        <Stat label="Campaign conversion" value="58%" />
        <Stat label="Approval rate" value="74%" />
        <Stat label="Avg ROI / campaign" value="3.8×" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="User Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminGrowth}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.18 268)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 268)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="creators" stroke="oklch(0.55 0.18 268)" fill="url(#ag)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Revenue Trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminRevenue}>
                <defs>
                  <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.66 0.20 42)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.66 0.20 42)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.66 0.20 42)" fill="url(#ar)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-elevated p-5">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-elevated p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}
