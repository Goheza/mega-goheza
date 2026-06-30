import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Upload, Link as LinkIcon, FileText, Image as ImageIcon, Video, Check, X as XIcon, Plus, Globe, MapPin } from "lucide-react";
import { DashCard, PageHeader, PricingSummary } from "@/components/brand/brand-ui";
import { CAMPAIGN_TYPE_META, formatMoney, COUNTRIES, type CampaignType } from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/create/$type")({
  head: ({ params }) => ({ meta: [{ title: `Create — ${CAMPAIGN_TYPE_META[params.type as CampaignType]?.label ?? "Campaign"}` }] }),
  component: CreateForm,
});

const REFERRAL_FEE_PER_CREATOR = 10.5;
const PLATFORM_FEE_PCT = 0.15;
const MIN_DURATION_DAYS = 30;

const DURATIONS = [
  { id: "30", label: "30 Days", days: 30 },
  { id: "60", label: "60 Days", days: 60 },
  { id: "90", label: "90 Days", days: 90 },
  { id: "custom", label: "Custom", days: 30 },
] as const;
type DurId = (typeof DURATIONS)[number]["id"];

function CreateForm() {
  const { type } = useParams({ from: "/brand/create/$type" });
  const navigate = useNavigate();
  const t = type as CampaignType;
  const meta = CAMPAIGN_TYPE_META[t];

  if (!meta || meta.comingSoon) {
    return (
      <div className="space-y-4">
        <Link to="/brand/create" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Campaign types
        </Link>
        <DashCard className="text-center">
          <p className="text-sm font-semibold text-ink">This campaign type is coming soon.</p>
        </DashCard>
      </div>
    );
  }

  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [duration, setDuration] = useState<DurId>("30");
  const [customDays, setCustomDays] = useState(MIN_DURATION_DAYS);

  // Visibility
  const [visibility, setVisibility] = useState<"global" | "specific">("global");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Dos & Don'ts
  const [dos, setDos] = useState<string[]>(["Show the product within the first 3 seconds."]);
  const [donts, setDonts] = useState<string[]>(["No competitor mentions or comparisons."]);

  const minMax: Record<CampaignType, { minPay: number; minRewardPerK: number }> = {
    creator:    { minPay: 70, minRewardPerK: 3 }, // New Creator Campaign — $3 / 1k min
    logo:       { minPay: 20, minRewardPerK: 1 },
    clipping:   { minPay: 20, minRewardPerK: 1 },
    referral:   { minPay: 0,  minRewardPerK: 1 },
    ambassador: { minPay: 0,  minRewardPerK: 1 },
    event:      { minPay: 0,  minRewardPerK: 1 },
  };
  const limits = minMax[t];
  const [creators, setCreators] = useState(t === "creator" ? 5 : t === "referral" ? 10 : 3);
  const [maxPerCreator, setMaxPerCreator] = useState(limits.minPay);
  const [rewardPerK, setRewardPerK] = useState(limits.minRewardPerK);

  const liveDays = duration === "custom" ? Math.max(MIN_DURATION_DAYS, customDays) : DURATIONS.find((d) => d.id === duration)!.days;

  const pricing = useMemo(() => {
    if (t === "referral") {
      const subtotal = creators * REFERRAL_FEE_PER_CREATOR;
      return {
        rows: [
          { label: "Campaign type", value: meta.label, muted: true },
          { label: "Creators invited", value: String(creators), muted: true },
          { label: "Reward per 1,000 views", value: `${formatMoney(rewardPerK)} (transparency)`, muted: true },
          { label: "Campaign duration", value: `${liveDays} days`, muted: true },
          { label: `Setup fee ($${REFERRAL_FEE_PER_CREATOR.toFixed(2)} / creator)`, value: formatMoney(subtotal) },
        ],
        total: { label: "Total Campaign Cost", value: formatMoney(subtotal) },
        footnote: "Referral creator commissions are paid directly via your referral system. Setup fee includes Goheza platform fee. Reward per 1,000 views is shown for creator transparency and is not added to your total.",
      };
    }
    const subtotal = creators * maxPerCreator;
    const fee = subtotal * PLATFORM_FEE_PCT;
    const total = subtotal + fee;
    return {
      rows: [
        { label: "Campaign type", value: meta.label, muted: true },
        { label: "Number of creators", value: String(creators), muted: true },
        { label: "Max pay per creator", value: formatMoney(maxPerCreator), muted: true },
        { label: "Reward per 1,000 views", value: `${formatMoney(rewardPerK)} (transparency)`, muted: true },
        { label: "Campaign duration", value: `${liveDays} days`, muted: true },
        { label: `Creator budget (${creators} × ${formatMoney(maxPerCreator)})`, value: formatMoney(subtotal) },
        { label: "Platform fee (15%)", value: formatMoney(fee) },
      ],
      total: { label: "Total Campaign Cost", value: formatMoney(total) },
      footnote: `Live phase runs for ${liveDays} days after a 14-day submission & review window. Reward per 1,000 views (${formatMoney(rewardPerK)}) defines what each creator earns from views — it is shown for transparency and is not added to your total.`,
    };
  }, [t, creators, maxPerCreator, rewardPerK, liveDays, meta.label]);


  const canPublish = name.trim().length > 0 && (visibility === "global" || selectedCountries.length > 0);

  const toggleCountry = (c: string) =>
    setSelectedCountries((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="space-y-6">
      <Link to="/brand/create" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Campaign types
      </Link>
      <PageHeader title={`New ${meta.label}`} subtitle={meta.tagline} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <DashCard>
            <p className="text-sm font-semibold text-ink">Campaign basics</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Campaign name" full>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer Glow Launch" className={fieldCls} />
              </Field>
              <Field label="Brief" full>
                <textarea rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="What the creator needs to know in one paragraph." className={fieldCls} />
              </Field>
            </div>
          </DashCard>

          {/* Visibility — Country Targeting */}
          <DashCard>
            <p className="text-sm font-semibold text-ink">Campaign Visibility</p>
            <p className="mt-1 text-xs text-muted-foreground">Choose which creators can see and apply to this campaign.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <VisibilityCard
                active={visibility === "global"}
                onClick={() => setVisibility("global")}
                icon={<Globe className="h-5 w-5" />}
                title="🌍 Global"
                desc="Anywhere in the world"
              />
              <VisibilityCard
                active={visibility === "specific"}
                onClick={() => setVisibility("specific")}
                icon={<MapPin className="h-5 w-5" />}
                title="📍 Specific Countries"
                desc="Pick from supported markets"
              />
            </div>
            {visibility === "specific" && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Select countries</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COUNTRIES.map((c) => {
                    const on = selectedCountries.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCountry(c)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          on
                            ? "border-transparent bg-ink text-white"
                            : "border-hairline bg-background text-ink hover:bg-ink/5"
                        }`}
                      >
                        {on && <Check className="mr-1 inline h-3 w-3" />}
                        {c}
                      </button>
                    );
                  })}
                </div>
                {selectedCountries.length === 0 && (
                  <p className="mt-2 text-[11px] text-[oklch(0.5_0.18_25)]">Select at least one country.</p>
                )}
              </div>
            )}
          </DashCard>

          {/* Type-specific brief blocks */}
          {t === "creator" && <CreatorBlock />}
          {t === "logo" && <LogoBlock />}
          {t === "clipping" && <ClippingBlock />}
          {t === "referral" && <ReferralBlock />}

          {/* Do's & Don'ts policy UI */}
          <DashCard>
            <p className="text-sm font-semibold text-ink">Content Policy — Do's & Don'ts</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Set clear creative rules. Creators must follow these before submitting.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <PolicyList
                tone="do"
                title="Do's"
                items={dos}
                onChange={setDos}
                placeholder="Add a positive guideline…"
              />
              <PolicyList
                tone="dont"
                title="Don'ts"
                items={donts}
                onChange={setDonts}
                placeholder="Add a restriction…"
              />
            </div>
          </DashCard>

          {/* Budget */}
          <DashCard>
            <p className="text-sm font-semibold text-ink">{t === "referral" ? "Reach" : "Budget"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t === "referral"
                ? "Choose how many creators you want to invite."
                : `Minimum max pay per creator: ${formatMoney(limits.minPay)}.`}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField label="Creators required" value={creators} min={1} onChange={setCreators} />
              {t !== "referral" && (
                <NumberField label="Max pay / creator" value={maxPerCreator} min={limits.minPay} prefix="$" onChange={setMaxPerCreator} />
              )}
              <NumberField
                label={`Reward / 1,000 views (min $${limits.minRewardPerK})`}
                value={rewardPerK}
                min={limits.minRewardPerK}
                prefix="$"
                onChange={(v) => setRewardPerK(Math.max(limits.minRewardPerK, v))}
              />
            </div>
            <div className="mt-4 rounded-xl border border-hairline bg-[oklch(0.97_0.02_75)] p-3 text-xs text-ink-soft">
              <span className="font-semibold text-ink">Reward per 1,000 views</span> is what each creator earns from attributed views.
              {" "}It's shown for transparency to creators and <span className="font-semibold text-ink">does not add</span> to your total campaign cost — your spend is capped by Creators × Max pay + 15% platform fee.
            </div>
          </DashCard>

          {/* Duration */}
          <DashCard>
            <p className="text-sm font-semibold text-ink">Campaign duration</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The Live phase starts <span className="font-semibold text-ink">after</span> your 14-day submission & review window.
              Minimum {MIN_DURATION_DAYS} days.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    duration === d.id ? "text-primary-foreground shadow-sm" : "border border-hairline bg-background text-ink hover:bg-ink/5"
                  }`}
                  style={duration === d.id ? { backgroundImage: "var(--gradient-primary)" } : undefined}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {duration === "custom" && (
              <div className="mt-4 max-w-xs">
                <NumberField label={`Custom days (min ${MIN_DURATION_DAYS})`} value={customDays} min={MIN_DURATION_DAYS} onChange={setCustomDays} />
              </div>
            )}
            <div className="mt-5 grid gap-3 rounded-2xl bg-[oklch(0.97_0.02_75)] p-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Submission & Review</p>
                <p className="font-display mt-1 text-base font-semibold text-ink">14 days</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live Campaign</p>
                <p className="font-display mt-1 text-base font-semibold text-ink">{liveDays} days</p>
              </div>
            </div>
          </DashCard>

          <div className="flex flex-wrap justify-end gap-2">
            <button className="rounded-full border border-hairline bg-background px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5">
              Save Draft
            </button>
            <button
              disabled={!canPublish}
              onClick={() => navigate({ to: "/brand/campaigns" })}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              Publish Campaign
            </button>
          </div>
        </div>

        <div className="lg:max-w-sm">
          <PricingSummary rows={pricing.rows} total={pricing.total} footnote={pricing.footnote} />
        </div>
      </div>
    </div>
  );
}

/* ---------- visibility ---------- */
function VisibilityCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
        active ? "border-ink bg-ink/5" : "border-hairline bg-background hover:border-ink/30"
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-ink text-white" : "bg-ink/5 text-ink"}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}

/* ---------- policy list (Do's / Don'ts) ---------- */
function PolicyList({
  tone, title, items, onChange, placeholder,
}: {
  tone: "do" | "dont";
  title: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const isDo = tone === "do";
  const accent = isDo
    ? { border: "border-[oklch(0.85_0.10_152)]", bg: "bg-[oklch(0.97_0.04_152)]", chipBg: "bg-[oklch(0.94_0.06_152)]", text: "text-[oklch(0.36_0.12_152)]", icon: <Check className="h-3.5 w-3.5" /> }
    : { border: "border-[oklch(0.85_0.04_25)]", bg: "bg-[oklch(0.97_0.03_25)]", chipBg: "bg-[oklch(0.95_0.05_25)]", text: "text-[oklch(0.45_0.16_25)]", icon: <XIcon className="h-3.5 w-3.5" /> };

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div className={`rounded-2xl border ${accent.border} ${accent.bg} p-4`}>
      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${accent.text}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className={`flex items-start gap-2 rounded-xl ${accent.chipBg} px-3 py-2 text-sm text-ink`}>
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDo ? "bg-[oklch(0.5_0.14_152)]" : "bg-[oklch(0.55_0.18_25)]"} text-white`}>
              {accent.icon}
            </span>
            <span className="flex-1">{it}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="rounded-full p-1 text-ink-soft hover:bg-white/60"
              aria-label="Remove"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className={`${fieldCls} text-sm`}
        />
        <button
          type="button"
          onClick={add}
          className={`shrink-0 rounded-full px-3 text-xs font-semibold text-white ${isDo ? "bg-[oklch(0.5_0.14_152)] hover:bg-[oklch(0.45_0.14_152)]" : "bg-[oklch(0.55_0.18_25)] hover:bg-[oklch(0.5_0.18_25)]"}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------- type-specific blocks ---------- */

function CreatorBlock() {
  return (
    <DashCard>
      <p className="text-sm font-semibold text-ink">Brief details</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Campaign objectives" full><textarea rows={3} className={fieldCls} placeholder="What does success look like?" /></Field>
        <Field label="Additional instructions" full><textarea rows={2} className={fieldCls} placeholder="Anything else creators should know." /></Field>
      </div>
      <UploadRow />
    </DashCard>
  );
}

function LogoBlock() {
  return (
    <DashCard>
      <p className="text-sm font-semibold text-ink">Asset & guidelines</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Placement guidelines" full><textarea rows={3} className={fieldCls} placeholder="Where in the video should the logo / flyer appear?" /></Field>
        <Field label="Additional instructions" full><textarea rows={2} className={fieldCls} /></Field>
      </div>
      <UploadRow />
    </DashCard>
  );
}

function ClippingBlock() {
  return (
    <DashCard>
      <p className="text-sm font-semibold text-ink">Source content</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Download links"><input className={fieldCls} placeholder="https://drive.google.com/…" /></Field>
        <Field label="Posting guidelines"><textarea rows={3} className={fieldCls} placeholder="Caption tone, hashtag rules, posting time…" /></Field>
        <Field label="Captions"><textarea rows={3} className={fieldCls} placeholder="One per line — creators can choose" /></Field>
        <Field label="Hashtags"><input className={fieldCls} placeholder="#brand #drop2026" /></Field>
      </div>
      <UploadRow video />
    </DashCard>
  );
}

function ReferralBlock() {
  return (
    <DashCard>
      <p className="text-sm font-semibold text-ink">Referral setup</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Referral link"><input className={fieldCls} placeholder="https://brand.com/?ref=" /></Field>
        <Field label="Coupon code (optional)"><input className={fieldCls} placeholder="VIP25" /></Field>
        <Field label="Landing page URL"><input className={fieldCls} placeholder="https://brand.com/landing" /></Field>
        <Field label="Reward description"><input className={fieldCls} placeholder="e.g. 20% off first order" /></Field>
        <Field label="Campaign instructions" full><textarea rows={3} className={fieldCls} placeholder="What should creators do with the link?" /></Field>
      </div>
      <UploadRow />
    </DashCard>
  );
}

function UploadRow({ video = false }: { video?: boolean }) {
  const items = [
    { icon: <ImageIcon className="h-4 w-4" />, label: "Images" },
    { icon: <Video className="h-4 w-4" />, label: video ? "Video files" : "Videos" },
    { icon: <FileText className="h-4 w-4" />, label: "PDFs" },
    { icon: <LinkIcon className="h-4 w-4" />, label: "Reference links" },
    { icon: <Upload className="h-4 w-4" />, label: "Brand assets" },
  ];
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uploads</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <button
            key={i.label}
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-dashed border-hairline bg-background px-4 py-3 text-left text-sm font-medium text-ink-soft transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-ink"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/5">{i.icon}</span>
            <span>
              <span className="block">{i.label}</span>
              <span className="block text-[11px] text-muted-foreground/80">Click to upload</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- primitives ---------- */
const fieldCls =
  "w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function NumberField({
  label, value, onChange, min = 0, step = 1, prefix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">{label}</span>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className={`${fieldCls} ${prefix ? "pl-7" : ""}`}
        />
      </div>
      <span className="mt-1 block text-[11px] text-muted-foreground">Min {prefix ?? ""}{min}</span>
    </label>
  );
}
