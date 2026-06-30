import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Target,
  FileText,
  ImageIcon,
  DollarSign,
  Users,
  Globe2,
  Clock,
  Sparkles,
  Hash,
  Languages,
  Video,
  Share2,
  Bookmark,
  Download,
  ExternalLink,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  X,
  ChevronRight,
} from "lucide-react";
import { DashCard, StatusPill, BrandAvatar } from "@/components/creator/dash-ui";
import {
  campaigns,
  findCampaign,
  formatMoney,
  formatNumber,
  applications,
  submissions,
  creator,
} from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/campaigns/$id")({
  loader: ({ params }) => {
    const campaign = findCampaign(params.id);
    if (!campaign) throw notFound();
    return { campaign };
  },
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-lg font-semibold text-ink">Campaign not found.</p>
      <Link to="/creator/campaigns" className="mt-4 inline-block text-sm text-primary hover:underline">
        ← Back to Browse
      </Link>
    </div>
  ),
  component: CampaignDetails,
});

// ---- Demo enrichment (synthetic but deterministic per campaign) ----
const CAMPAIGN_TYPES = ["Creator Campaign", "Referral Campaign", "Clipping Campaign", "Logo Placement Campaign"] as const;
type CampaignType = (typeof CAMPAIGN_TYPES)[number];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function enrich(id: string) {
  const h = hash(id);
  const type: CampaignType = CAMPAIGN_TYPES[h % CAMPAIGN_TYPES.length];
  const maxPayout = 1200 + (h % 5) * 400;
  const slotsTotal = 25 + (h % 30);
  const slotsTaken = Math.floor(slotsTotal * (0.35 + ((h % 40) / 100)));
  const applicantCount = 80 + (h % 220);
  const minLength = [15, 20, 30, 45][h % 4];
  return { type, maxPayout, slotsTotal, slotsTaken, applicantCount, minLength };
}

const DEMO_ASSETS = [
  { kind: "image" as const, url: "https://images.unsplash.com/photo-1522335789203-aaa67dd80df3?w=600&q=80", name: "Product hero.jpg" },
  { kind: "image" as const, url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", name: "Lifestyle 01.jpg" },
  { kind: "image" as const, url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80", name: "Texture.jpg" },
  { kind: "logo" as const, url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80", name: "Brand mark.png" },
  { kind: "video" as const, url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80", name: "Reference reel.mp4" },
  { kind: "link" as const, url: "https://www.notion.so", name: "Brand kit (external)" },
];

const APPLICANT_AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&q=80",
];

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function CampaignDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const c = findCampaign(id)!;
  const extra = useMemo(() => enrich(c.id), [c.id]);
  const existingApp = applications.find((a) => a.campaignId === c.id);

  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const eligibility = [
    { label: "Country eligibility", ok: c.country === "Global" || c.country.includes("ZA") },
    { label: "Account active", ok: true },
    { label: "Social account connected", ok: true },
    { label: `Platform available (${c.platforms.join(", ")})`, ok: true },
    { label: "Minimum follower threshold", ok: true },
  ];
  const eligible = eligibility.every((e) => e.ok);
  const days = daysUntil(c.deadline);
  const slotsLeft = Math.max(0, extra.slotsTotal - extra.slotsTaken);

  return (
    <div className="space-y-6 pb-32 lg:pb-6">
      <Link
        to="/creator/campaigns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to campaigns
      </Link>

      {/* Hero header */}
      <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated shadow-card">
        <div className="relative aspect-[16/6] overflow-hidden bg-ink">
          <img src={c.cover} alt={c.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
              <Sparkles className="h-3 w-3" /> {extra.type}
            </span>
            <StatusPill status={c.status} />
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-5 sm:p-7 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <BrandAvatar initial={c.brandInitial} color={c.brandColor} size={56} />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{c.brand}</p>
              <h1 className="font-display truncate text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
                {c.name}
              </h1>
            </div>
          </div>
          <div className="col-span-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSaved((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-4 py-2 text-sm font-medium text-ink hover:border-primary/40"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-4 py-2 text-sm font-medium text-ink hover:border-primary/40">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>

        {/* Quick metadata row */}
        <div className="grid grid-cols-2 gap-px border-t border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-6">
          <Meta icon={<DollarSign className="h-4 w-4" />} label="Per 1K views" value={formatMoney(c.rewardPerK)} />
          <Meta icon={<TrendingUp className="h-4 w-4" />} label="Max payout" value={formatMoney(extra.maxPayout)} />
          <Meta icon={<Users className="h-4 w-4" />} label="Creators needed" value={String(c.creatorsNeeded)} />
          <Meta icon={<Globe2 className="h-4 w-4" />} label="Country" value={c.country} />
          <Meta icon={<Video className="h-4 w-4" />} label="Platform" value={c.platforms.join(" · ")} />
          <Meta icon={<Clock className="h-4 w-4" />} label="Duration" value={`${Math.max(30, days)} days`} />
        </div>
      </div>

      {/* Workspace — visible after the creator has applied */}
      {existingApp && (
        <CampaignWorkspace
          appStatus={existingApp.status}
          submission={submissions.find((s) => s.campaignId === c.id)}
          rewardPerK={c.rewardPerK}
          platforms={c.platforms}
          feedback={existingApp.note}
          onResubmit={() => setApplyOpen(true)}
        />
      )}


      <div className="grid gap-5 lg:grid-cols-3">
        {/* LEFT: main */}
        <div className="space-y-5 lg:col-span-2">
          <Section title="Campaign Overview" icon={<FileText className="h-4 w-4" />}>
            <p className="text-sm leading-relaxed text-ink-soft">{c.brief}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Mini label="Goal" value={c.goals[0] ?? "Brand awareness"} />
              <Mini label="Audience" value={`${c.category} · ${c.country}`} />
              <Mini label="Style" value={c.guidelines[0] ?? "Authentic"} />
            </div>
          </Section>

          <Section title="Campaign Goals" icon={<Target className="h-4 w-4" />}>
            <ul className="space-y-2 text-sm text-ink-soft">
              {c.goals.map((g) => (
                <li key={g} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>
          </Section>

          {/* Do's & Don'ts */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[oklch(0.85_0.08_152)] bg-[oklch(0.97_0.04_152)] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[oklch(0.93_0.1_152)] text-[oklch(0.4_0.14_152)]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">Do's</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {c.dos.map((d) => (
                  <li key={d} className="flex items-start gap-3 rounded-xl bg-surface-elevated p-3 text-sm text-ink shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.5_0.14_152)]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[oklch(0.85_0.1_25)] bg-[oklch(0.97_0.04_25)] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[oklch(0.93_0.1_25)] text-[oklch(0.5_0.18_25)]">
                  <XCircle className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">Don'ts</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {c.donts.map((d) => (
                  <li key={d} className="flex items-start gap-3 rounded-xl bg-surface-elevated p-3 text-sm text-ink shadow-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.18_25)]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Section title="Requirements" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <ReqRow icon={<Video className="h-4 w-4" />} label="Content type" value={extra.type} />
              <ReqRow icon={<Clock className="h-4 w-4" />} label="Min video length" value={`${extra.minLength}s`} />
              <ReqRow icon={<Video className="h-4 w-4" />} label="Posting platform" value={c.platforms.join(", ")} />
              <ReqRow icon={<Hash className="h-4 w-4" />} label="Hashtags" value={`#${c.brand}Glow #ad`} />
              <ReqRow icon={<FileText className="h-4 w-4" />} label="Caption" value="Mention product + CTA" />
              <ReqRow icon={<Languages className="h-4 w-4" />} label="Language" value="English" />
            </div>
          </Section>

          <Section title="Deliverables" icon={<Target className="h-4 w-4" />}>
            <ul className="space-y-2 text-sm text-ink">
              {[
                `1 vertical ${extra.minLength}s+ video posted to ${c.platforms[0]}`,
                "Caption with required hashtags and CTA",
                "Submit posted-content link for tracking",
                "Keep content live for the full campaign window",
              ].map((d) => (
                <li key={d} className="flex items-start gap-3 rounded-xl border border-hairline bg-background p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Section>


          <Section title="Brand Assets" icon={<ImageIcon className="h-4 w-4" />}>
            <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
              {DEMO_ASSETS.map((a) => (
                <div
                  key={a.name}
                  className="group relative w-[70%] shrink-0 snap-start overflow-hidden rounded-xl border border-hairline bg-background sm:w-auto"
                >
                  {a.kind !== "link" ? (
                    <button onClick={() => setPreview(a.url)} className="block w-full">
                      <img src={a.url} alt={a.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" />
                    </button>
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center bg-primary/5">
                      <ExternalLink className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 border-t border-hairline p-3">
                    <p className="truncate text-xs font-medium text-ink">{a.name}</p>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink/5 text-ink hover:bg-primary hover:text-primary-foreground"
                      title="Download"
                    >
                      {a.kind === "link" ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Earnings calculator */}
          <Section title="Earnings Breakdown" icon={<DollarSign className="h-4 w-4" />}>
            <div className="grid gap-4 sm:grid-cols-3">
              <CalcCard views={10_000} rate={c.rewardPerK} max={extra.maxPayout} />
              <CalcCard views={50_000} rate={c.rewardPerK} max={extra.maxPayout} highlight />
              <CalcCard views={200_000} rate={c.rewardPerK} max={extra.maxPayout} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Base rate {formatMoney(c.rewardPerK)} per 1,000 attributed views · capped at {formatMoney(extra.maxPayout)} per creator.
              Bonus pool unlocked on hitting 100k views in the first 14 days.
            </p>
          </Section>

          {/* Eligibility */}
          <Section title="Eligibility Check" icon={<ShieldCheck className="h-4 w-4" />}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {eligibility.map((e) => (
                <li
                  key={e.label}
                  className="flex items-center justify-between rounded-xl border border-hairline bg-background px-4 py-3 text-sm"
                >
                  <span className="text-ink">{e.label}</span>
                  {e.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[oklch(0.55_0.18_25)]" />
                  )}
                </li>
              ))}
            </ul>
            {!eligible && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-[oklch(0.85_0.1_25)] bg-[oklch(0.97_0.04_25)] px-4 py-3 text-sm">
                <span className="text-ink">Some requirements need attention before applying.</span>
                <Link to="/creator/settings" className="font-semibold text-primary hover:underline">
                  Fix requirements
                </Link>
              </div>
            )}
          </Section>

          {/* Insights */}
          <Section title="Campaign Insights" icon={<TrendingUp className="h-4 w-4" />}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Mini label="Expected reach" value={`${formatNumber(extra.applicantCount * 12_000)} views`} />
              <Mini label="Avg engagement" value="6.4%" />
              <Mini label="Trending" value="↑ Top 10 this week" />
            </div>
          </Section>

          <Section title="Frequently Asked Questions" icon={<FileText className="h-4 w-4" />}>
            <div className="space-y-2">
              {[
                { q: "When do I get paid?", a: "Earnings are released 14 days after the campaign closes, once attribution and quality review is finalized." },
                { q: "Can I submit more than one video?", a: "Yes, up to 2 submissions per creator. Only approved videos count toward the reward pool." },
                { q: "What if my video is rejected?", a: "You'll receive specific feedback and can resubmit before the deadline if slots remain." },
                { q: "Do I keep the rights to my content?", a: "You retain ownership. The brand receives a limited license to repost on their own channels during the campaign window." },
              ].map((f) => (
                <details key={f.q} className="group rounded-xl border border-hairline bg-background p-4 open:bg-primary/5">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-ink list-none">
                    <span>{f.q}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>



          {/* Social proof */}
          <Section title="Creators who applied">
            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2">
                {APPLICANT_AVATARS.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" className="h-9 w-9 rounded-full border-2 border-surface-elevated object-cover" />
                ))}
                <span className="ml-3 text-sm text-muted-foreground">+{extra.applicantCount - APPLICANT_AVATARS.length} more</span>
              </div>
              <span className="text-xs text-muted-foreground">★ 4.8 avg brand rating</span>
            </div>
          </Section>

          {/* Similar */}
          <Section title="Similar campaigns">
            <div className="grid gap-3 sm:grid-cols-2">
              {campaigns.filter((x) => x.id !== c.id).slice(0, 4).map((x) => (
                <Link
                  key={x.id}
                  to="/creator/campaigns/$id"
                  params={{ id: x.id }}
                  className="group flex items-center gap-3 rounded-xl border border-hairline bg-background p-3 hover:border-primary/40"
                >
                  <img src={x.cover} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{x.name}</p>
                    <p className="text-xs text-muted-foreground">{x.brand} · {formatMoney(x.rewardPerK)}/1K</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </Section>
        </div>

        {/* RIGHT: sticky panel */}
        <aside className="space-y-5 lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-5">
            <DashCard>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Earnings summary</p>
              <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.02em] text-ink">
                {formatMoney(c.estEarnings.min)} – {formatMoney(c.estEarnings.max)}
              </p>
              <p className="text-xs text-muted-foreground">Estimated payout range</p>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Reward / 1K views" value={formatMoney(c.rewardPerK)} />
                <Row label="Max per creator" value={formatMoney(extra.maxPayout)} />
              </div>
            </DashCard>

            <DashCard>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Campaign status</p>
                <StatusPill status={c.status} />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Slots remaining" value={`${slotsLeft} / ${extra.slotsTotal}`} />
                <Row label="Deadline" value={`${days} days left`} icon={<Calendar className="h-3.5 w-3.5" />} />
                <Row label="Duration" value={`${Math.max(30, days)} days`} />
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
                <div className="h-full bg-primary" style={{ width: `${(extra.slotsTaken / extra.slotsTotal) * 100}%` }} />
              </div>
            </DashCard>

            <div className="hidden lg:block">
              <PrimaryCta
                existingApp={existingApp?.status}
                eligible={eligible}
                onApply={() => setApplyOpen(true)}
                onTrack={() => navigate({ to: "/creator/submissions" })}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface-elevated/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">Est. earnings</p>
            <p className="truncate text-sm font-semibold text-ink">
              {formatMoney(c.estEarnings.min)} – {formatMoney(c.estEarnings.max)}
            </p>
          </div>
          <div className="shrink-0">
            <PrimaryCta
              existingApp={existingApp?.status}
              eligible={eligible}
              onApply={() => setApplyOpen(true)}
              onTrack={() => navigate({ to: "/creator/submissions" })}
              compact
            />
          </div>
        </div>
      </div>

      {/* Asset preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-surface-elevated" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-white hover:bg-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={preview} alt="" className="max-h-[90vh] w-auto object-contain" />
          </div>
        </div>
      )}

      {/* Apply flow */}
      {applyOpen && (
        <ApplyFlow
          campaignName={c.name}
          onClose={() => setApplyOpen(false)}
          onDone={() => navigate({ to: "/creator/submissions" })}
        />
      )}
    </div>
  );
}

// ---- Sub-components ----

function PrimaryCta({
  existingApp,
  eligible,
  onApply,
  onTrack,
  compact,
}: {
  existingApp?: string;
  eligible: boolean;
  onApply: () => void;
  onTrack: () => void;
  compact?: boolean;
}) {
  const base =
    "rounded-full font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100";
  const size = compact ? "px-5 py-2.5 text-sm" : "w-full py-3 text-sm";
  const style = { backgroundImage: "var(--gradient-primary)" } as const;

  if (existingApp) {
    return (
      <button onClick={onTrack} className={`bg-primary ${base} ${size}`} style={style}>
        Track Progress
      </button>
    );
  }
  return (
    <button onClick={onApply} disabled={!eligible} className={`bg-primary ${base} ${size}`} style={style}>
      Apply to Campaign
    </button>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface-elevated p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <DashCard>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </DashCard>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-hairline pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1 font-semibold text-ink">
        {icon}
        {value}
      </span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-background p-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function ReqRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-hairline bg-background p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

function CalcCard({ views, rate, max, highlight }: { views: number; rate: number; max: number; highlight?: boolean }) {
  const raw = (views / 1000) * rate;
  const payout = Math.min(raw, max);
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? "border-primary/40 bg-primary/5" : "border-hairline bg-background"
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{formatNumber(views)} views</p>
      <p className="font-display mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-ink">{formatMoney(payout)}</p>
      <p className="text-xs text-muted-foreground">@ {formatMoney(rate)} / 1K</p>
    </div>
  );
}

// ---- Apply flow modal ----
function ApplyFlow({
  campaignName,
  onClose,
  onDone,
}: {
  campaignName: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [contentType, setContentType] = useState("Short-form video");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<string | null>(null);

  const steps = ["Confirm", "Content type", "Draft (optional)", "Caption", "Review", "Submit"];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface-elevated shadow-card">
        <div className="flex items-center justify-between border-b border-hairline p-5">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Apply</p>
            <p className="truncate font-display text-lg font-semibold text-ink">{campaignName}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 px-5 pt-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-ink/10"}`} />
          ))}
        </div>
        <p className="px-5 pt-2 text-xs text-muted-foreground">
          Step {Math.min(step + 1, steps.length)} of {steps.length} · {steps[step]}
        </p>

        <div className="space-y-4 p-5">
          {step === 0 && (
            <div className="space-y-3 text-sm text-ink-soft">
              <p>You're applying as <strong className="text-ink">{creator.name}</strong> ({creator.handle}).</p>
              <p>By applying you agree to deliver the content per the brand brief within the campaign window.</p>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-2">
              {["Short-form video", "Clipping", "Logo placement", "Referral post"].map((t) => (
                <label key={t} className={`flex items-center justify-between rounded-xl border p-3 text-sm ${contentType === t ? "border-primary bg-primary/5" : "border-hairline bg-background"}`}>
                  <span className="text-ink">{t}</span>
                  <input type="radio" name="ct" checked={contentType === t} onChange={() => setContentType(t)} />
                </label>
              ))}
            </div>
          )}
          {step === 2 && (
            <label className="grid place-items-center gap-2 rounded-xl border border-dashed border-hairline bg-background p-8 text-center text-sm text-muted-foreground hover:border-primary/50">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
              />
              <ImageIcon className="h-6 w-6" />
              {file ? <span className="font-medium text-ink">{file}</span> : <span>Click to upload a draft (optional)</span>}
            </label>
          )}
          {step === 3 && (
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write the caption you plan to post…"
              className="h-32 w-full resize-none rounded-xl border border-hairline bg-background p-3 text-sm text-ink outline-none focus:border-primary"
            />
          )}
          {step === 4 && (
            <div className="space-y-2 text-sm">
              <Row label="Creator" value={creator.handle} />
              <Row label="Content type" value={contentType} />
              <Row label="Draft" value={file ?? "None"} />
              <Row label="Caption" value={caption ? `${caption.slice(0, 40)}…` : "—"} />
            </div>
          )}
          {step === 5 && (
            <div className="grid place-items-center gap-3 py-6 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.93_0.1_152)] text-[oklch(0.4_0.14_152)]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="font-display text-lg font-semibold text-ink">Application submitted</p>
              <p className="text-sm text-muted-foreground">Track progress in My Submissions.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-hairline p-5">
          <button
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={() => {
              if (isLast) onDone();
              else setStep((s) => s + 1);
            }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            {step === 4 ? "Submit" : isLast ? "Go to My Submissions" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Campaign Workspace (post-apply) ----
type AppStatus = "Pending Review" | "Approved" | "Rejected" | "Needs Revision" | "Selected";
type Sub = (typeof submissions)[number];

function CampaignWorkspace({
  appStatus,
  submission,
  rewardPerK,
  platforms,
  feedback,
  onResubmit,
}: {
  appStatus: AppStatus;
  submission?: Sub;
  rewardPerK: number;
  platforms: string[];
  feedback?: string;
  onResubmit: () => void;
}) {
  // Derive timeline state
  const subStatus = submission?.status;
  const isLive = subStatus === "Live";
  const isApproved = subStatus === "Approved" || isLive;
  const isPending = subStatus === "Pending Review";
  const isRevision = subStatus === "Needs Revision" || appStatus === "Needs Revision";
  const hasSubmitted = !!submission;
  const isAccepted = appStatus === "Selected" || appStatus === "Approved" || hasSubmitted;

  const steps = [
    { label: "Applied", done: true },
    { label: "Accepted", done: isAccepted, active: !isAccepted },
    { label: "Submitted", done: hasSubmitted, active: isAccepted && !hasSubmitted },
    { label: "Pending Review", done: isApproved, active: isPending },
    { label: "Approved", done: isApproved, active: false },
    { label: "Live", done: isLive, active: false },
  ];

  return (
    <DashCard className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your campaign workspace</p>
          <p className="font-display mt-1 text-xl font-semibold text-ink">Track, submit, and monitor performance</p>
        </div>
        <StatusPill status={subStatus ?? appStatus} />
      </div>

      {/* Progress tracker */}
      <ol className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-col items-start gap-2">
            <div className="flex w-full items-center gap-2">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                  s.done
                    ? "bg-[oklch(0.5_0.14_152)] text-white"
                    : s.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-ink/5 text-muted-foreground"
                }`}
              >
                {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className={`h-0.5 flex-1 ${steps[i + 1].done ? "bg-[oklch(0.5_0.14_152)]" : "bg-ink/10"}`} />
              )}
            </div>
            <p className={`text-[11px] font-semibold ${s.done || s.active ? "text-ink" : "text-muted-foreground"}`}>
              {s.label}
            </p>
          </li>
        ))}
      </ol>

      {/* State-aware body */}
      <div className="mt-6">
        {/* Revision requested */}
        {isRevision && (
          <div className="rounded-2xl border border-[oklch(0.85_0.1_25)] bg-[oklch(0.97_0.04_25)] p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[oklch(0.55_0.18_25)]" />
              <p className="text-sm font-semibold text-ink">Revisions requested</p>
            </div>
            {feedback && <p className="mt-2 text-sm text-ink-soft">{feedback}</p>}
            <button
              onClick={onResubmit}
              className="mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              Resubmit Content
            </button>
          </div>
        )}

        {/* Accepted, not yet submitted → upload form */}
        {isAccepted && !hasSubmitted && !isRevision && (
          <SubmitContentForm platforms={platforms} />
        )}

        {/* Pending review confirmation */}
        {isPending && (
          <div className="rounded-2xl border border-hairline bg-background p-4 text-sm">
            <p className="font-semibold text-ink">Submission received</p>
            <p className="mt-1 text-ink-soft">
              The brand is reviewing your content. You'll be notified when there's an update — usually within 48 hours.
            </p>
          </div>
        )}

        {/* Live metrics */}
        {isLive && submission && (
          <LivePerformance submission={submission} rewardPerK={rewardPerK} />
        )}
      </div>
    </DashCard>
  );
}

function SubmitContentForm({ platforms }: { platforms: string[] }) {
  const [file, setFile] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState(platforms[0] ?? "TikTok");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="grid place-items-center gap-2 rounded-2xl border border-hairline bg-background p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[oklch(0.93_0.1_152)] text-[oklch(0.4_0.14_152)]">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="font-display text-lg font-semibold text-ink">Submission uploaded</p>
        <p className="text-sm text-muted-foreground">Status: Pending Review · we'll notify you when the brand responds.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-ink">Upload your submission</p>
      <label className="grid place-items-center gap-2 rounded-2xl border border-dashed border-hairline bg-background p-8 text-center text-sm text-muted-foreground hover:border-primary/50">
        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
        <Video className="h-6 w-6" />
        {file ? <span className="font-medium text-ink">{file}</span> : <span>Click to upload your video</span>}
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Platform</span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-1 w-full rounded-xl border border-hairline bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
          >
            {(platforms.length ? platforms : ["TikTok", "Instagram", "YouTube"]).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Post URL (optional)</span>
          <input
            placeholder="https://…"
            className="mt-1 w-full rounded-xl border border-hairline bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Caption</span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          placeholder="Write the caption you'll post…"
          className="mt-1 w-full resize-none rounded-xl border border-hairline bg-background p-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Notes for the brand (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full resize-none rounded-xl border border-hairline bg-background p-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>
      <div className="flex justify-end">
        <button
          disabled={!file}
          onClick={() => setDone(true)}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Submit Content
        </button>
      </div>
    </div>
  );
}

function LivePerformance({ submission, rewardPerK }: { submission: Sub; rewardPerK: number }) {
  const earnings = (submission.views / 1000) * rewardPerK;
  const engagement = submission.views > 0 ? ((submission.likes + submission.comments) / submission.views) * 100 : 0;
  const metrics = [
    { label: "Views", value: formatNumber(submission.views) },
    { label: "Likes", value: formatNumber(submission.likes) },
    { label: "Comments", value: formatNumber(submission.comments) },
    { label: "Shares", value: formatNumber(Math.round(submission.likes * 0.18)) },
    { label: "Engagement", value: `${engagement.toFixed(1)}%` },
    { label: "Earnings", value: formatMoney(earnings) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(0.93_0.1_152)] text-[oklch(0.4_0.14_152)]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-ink">Live performance</p>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary/40"
        >
          View original post <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-hairline bg-background p-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{m.label}</p>
            <p className="font-display mt-1 text-lg font-semibold text-ink">{m.value}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">Last updated just now · earnings update every 6 hours.</p>
    </div>
  );
}

