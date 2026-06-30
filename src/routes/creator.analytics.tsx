import { createFileRoute } from "@tanstack/react-router";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Line, LineChart } from "recharts";
import { DashCard, PageHeader, StatCard } from "@/components/creator/dash-ui";
import { findCampaign, formatMoney, formatNumber, platformShare, submissions, viewsTrend } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/analytics")({
  component: Analytics,
});

const followerGrowth = [
  { m: "Jan", f: 4200 }, { m: "Feb", f: 5100 }, { m: "Mar", f: 6800 },
  { m: "Apr", f: 9400 }, { m: "May", f: 12200 }, { m: "Jun", f: 16800 },
];
const COLORS = ["oklch(0.66 0.20 42)", "oklch(0.55 0.18 268)", "oklch(0.5 0.14 152)"];
const REWARDS_PER_K = 4.2;

function Analytics() {
  const published = submissions.filter((s) => s.status === "Live");
  const totalViews = published.reduce((s, x) => s + x.views, 0);
  const totalLikes = published.reduce((s, x) => s + x.likes, 0);
  const totalComments = published.reduce((s, x) => s + x.comments, 0);
  const totalShares = Math.round(totalLikes * 0.18);
  const engagement = totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews) * 100 : 0;
  const totalEarnings = (totalViews / 1000) * REWARDS_PER_K;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Your performance hub — account-wide insights and per-video results." />

      {/* Overall stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Views" value={formatNumber(totalViews)} delta="+24% MoM" tone="orange" />
        <StatCard label="Total Likes" value={formatNumber(totalLikes)} tone="indigo" />
        <StatCard label="Total Comments" value={formatNumber(totalComments)} />
        <StatCard label="Total Shares" value={formatNumber(totalShares)} />
        <StatCard label="Engagement Rate" value={`${engagement.toFixed(1)}%`} delta="+0.4 pts" tone="green" />
        <StatCard label="Estimated Reach" value={formatNumber(Math.round(totalViews * 1.4))} />
        <StatCard label="Avg Views / Campaign" value={formatNumber(Math.round(totalViews / Math.max(published.length, 1)))} />
        <StatCard label="Total Earnings" value={formatMoney(totalEarnings)} tone="orange" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashCard className="lg:col-span-2">
          <p className="text-sm font-semibold text-ink">Views — This Week</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-hairline)", background: "var(--color-surface-elevated)" }} />
                <Bar dataKey="v" fill="oklch(0.66 0.20 42)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard>
          <p className="text-sm font-semibold text-ink">Top Platforms</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformShare} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {platformShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashCard>
      </div>

      <DashCard>
        <p className="text-sm font-semibold text-ink">Follower Growth</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={followerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 80)" />
              <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-hairline)", background: "var(--color-surface-elevated)" }} />
              <Line type="monotone" dataKey="f" stroke="oklch(0.55 0.18 268)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashCard>

      {/* Per-video analytics */}
      <DashCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold text-ink">Per-Video Analytics</p>
            <p className="text-xs text-muted-foreground">Every approved and published video, with detailed metrics.</p>
          </div>
        </div>

        {/* Mobile cards */}
        <ul className="space-y-3 px-4 pb-5 md:hidden">
          {published.map((s) => {
            const c = findCampaign(s.campaignId);
            const shares = Math.round(s.likes * 0.18);
            const eng = s.views > 0 ? ((s.likes + s.comments + shares) / s.views) * 100 : 0;
            const earned = (s.views / 1000) * REWARDS_PER_K;
            return (
              <li key={s.id} className="rounded-2xl border border-hairline bg-background p-3">
                <div className="flex gap-3">
                  <img src={s.thumb} alt="" loading="lazy" className="h-16 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{c?.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{c?.brand} · {c?.platforms[0]} · {s.submittedAt}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <MiniStat label="Views" value={formatNumber(s.views)} />
                  <MiniStat label="Likes" value={formatNumber(s.likes)} />
                  <MiniStat label="Comments" value={formatNumber(s.comments)} />
                  <MiniStat label="Shares" value={formatNumber(shares)} />
                  <MiniStat label="Eng." value={`${eng.toFixed(1)}%`} />
                  <MiniStat label="Earnings" value={formatMoney(earned)} />
                </div>
              </li>
            );
          })}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-y border-hairline bg-[oklch(0.97_0.012_78)] text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Video</th>
                <th className="px-3 py-3">Platform</th>
                <th className="px-3 py-3 text-right">Views</th>
                <th className="px-3 py-3 text-right">Likes</th>
                <th className="px-3 py-3 text-right">Comments</th>
                <th className="px-3 py-3 text-right">Shares</th>
                <th className="px-3 py-3 text-right">Eng. Rate</th>
                <th className="px-3 py-3 text-right">Earnings</th>
                <th className="px-5 py-3 text-right">CPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {published.map((s) => {
                const c = findCampaign(s.campaignId);
                const shares = Math.round(s.likes * 0.18);
                const eng = s.views > 0 ? ((s.likes + s.comments + shares) / s.views) * 100 : 0;
                const earned = (s.views / 1000) * REWARDS_PER_K;
                return (
                  <tr key={s.id} className="hover:bg-ink/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.thumb} alt="" loading="lazy" className="h-12 w-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{c?.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c?.brand} · Published {s.submittedAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c?.platforms[0]}</td>
                    <td className="px-3 py-3 text-right font-semibold text-ink">{formatNumber(s.views)}</td>
                    <td className="px-3 py-3 text-right text-ink">{formatNumber(s.likes)}</td>
                    <td className="px-3 py-3 text-right text-ink">{formatNumber(s.comments)}</td>
                    <td className="px-3 py-3 text-right text-ink">{formatNumber(shares)}</td>
                    <td className="px-3 py-3 text-right text-[oklch(0.45_0.14_152)]">{eng.toFixed(1)}%</td>
                    <td className="px-3 py-3 text-right font-semibold text-ink">{formatMoney(earned)}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{formatMoney(REWARDS_PER_K)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DashCard>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink/5 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-ink">{value}</p>
    </div>
  );
}
