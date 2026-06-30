import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { DashCard, PageHeader, StatusPill, BrandAvatar } from "@/components/creator/dash-ui";
import { campaigns, type Campaign, formatMoney, formatNumber } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/campaigns")({
  component: BrowseCampaigns,
});

const platforms = ["All", "TikTok", "Instagram", "YouTube"];
const categories = ["All", "Beauty", "Fitness", "Tech", "Food", "Gaming", "Lifestyle"];
const countries = ["All", "Global", "Uganda", "Kenya", "Nigeria", "South Africa", "Ghana", "Tanzania", "Rwanda"];
const sorts = ["Newest", "Trending", "Highest reward"];

function BrowseCampaigns() {
  const [platform, setPlatform] = useState("All");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All");
  const [sort, setSort] = useState("Newest");

  const filtered = useMemo(() => {
    let list: Campaign[] = campaigns;
    if (platform !== "All") list = list.filter((c) => c.platforms.includes(platform as Campaign["platforms"][number]));
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (country !== "All") list = list.filter((c) => c.country === country || (country === "Global" && c.country?.toLowerCase().includes("global")));
    if (sort === "Highest reward") list = [...list].sort((a, b) => b.rewardPerK - a.rewardPerK);
    return list;
  }, [platform, category, country, sort]);

  return (
    <div className="space-y-6">
      <PageHeader title="Browse Campaigns" subtitle="Find briefs from brands that match your niche. Apply, create, and earn per 1,000 views." />

      <DashCard>
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect label="Platform" value={platform} onChange={setPlatform} options={platforms} />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={categories} />
          <FilterSelect label="Country" value={country} onChange={setCountry} options={countries} />
          <FilterSelect label="Sort" value={sort} onChange={setSort} options={sorts} />
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} campaigns</span>
        </div>
      </DashCard>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <article key={c.id} className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-elevated shadow-card transition-transform hover:-translate-y-0.5">
            <div className="relative aspect-[16/9] overflow-hidden bg-ink">
              <img src={c.cover} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink shadow-card backdrop-blur hover:bg-white" aria-label="Bookmark">
                <Bookmark className="h-4 w-4" />
              </button>
              <span className="absolute left-3 top-3"><StatusPill status={c.status} /></span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                <BrandAvatar initial={c.brandInitial} color={c.brandColor} size={36} />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{c.brand}</p>
                  <p className="truncate font-display text-lg font-semibold tracking-[-0.01em] text-ink">{c.name}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-ink-soft">
                {c.platforms.map((p) => (
                  <span key={p} className="rounded-full bg-ink/5 px-2 py-1">{p}</span>
                ))}
                <span className="rounded-full bg-ink/5 px-2 py-1">{c.category}</span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <Stat label="Reward / 1k" value={formatMoney(c.rewardPerK)} />
                <Stat label="Est. earnings" value={`${formatMoney(c.estEarnings.min)}–${formatMoney(c.estEarnings.max)}`} />
                <Stat label="Deadline" value={c.deadline} icon={<Calendar className="h-3 w-3" />} />
                <Stat label="Creators" value={`${formatNumber(c.creatorsNeeded)} needed`} icon={<Users className="h-3 w-3" />} />
              </dl>

              <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" /> {c.country}
              </p>

              <div className="mt-5 flex gap-2">
                <Link
                  to="/creator/campaigns/$id"
                  params={{ id: c.id }}
                  className="flex-1 rounded-full border border-hairline bg-background px-4 py-2.5 text-center text-sm font-semibold text-ink hover:bg-ink/5"
                >
                  View Details
                </Link>
                <Link
                  to="/creator/campaigns/$id"
                  params={{ id: c.id }}
                  className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02]"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="relative inline-flex items-center gap-2 rounded-full border border-hairline bg-background py-2 pl-3 pr-9 text-sm text-ink">
      <span className="text-muted-foreground">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-transparent font-medium focus:outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted-foreground" />
    </label>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 inline-flex items-center gap-1 text-[13px] font-semibold text-ink">{icon}{value}</dd>
    </div>
  );
}
