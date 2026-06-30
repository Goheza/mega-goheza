import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  CreditCard,
  Smartphone,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { MockOAuthModal } from "@/components/onboarding/MockOAuthModal";
import { loadOnboarding, saveOnboarding } from "@/lib/onboarding-storage";
import {
  TikTokLogo,
  InstagramLogo,
  YouTubeLogo,
  FacebookLogo,
  XLogo,
  LinkedInLogo,
  GoogleLogo,
  AppleLogo,
} from "@/components/brand-logos";

const PROVIDER_ICONS = {
  tiktok: TikTokLogo,
  instagram: InstagramLogo,
  youtube: YouTubeLogo,
  facebook: FacebookLogo,
  x: XLogo,
  linkedin: LinkedInLogo,
} as const;

const SIGNUP_PROVIDERS = [
  { id: "google", name: "Google", Logo: GoogleLogo },
  { id: "apple", name: "Apple", Logo: AppleLogo },
  { id: "tiktok", name: "TikTok", Logo: TikTokLogo },
  { id: "facebook", name: "Facebook", Logo: FacebookLogo },
] as const;

export const Route = createFileRoute("/onboarding/creator")({
  head: () => ({ meta: [{ title: "Creator Onboarding — Goheza" }] }),
  component: CreatorOnboarding,
});

const TOTAL = 9;
const STORAGE_KEY = "goheza.onboarding.creator";

type PaymentMethod = "bank" | "mobile" | "";

type CreatorData = {
  fullName: string;
  email: string;
  password: string;
  confirm: string;
  displayName: string;
  username: string;
  bio: string;
  country: string;
  city: string;
  languages: string[];
  categories: string[];
  referral: string;
  paymentMethod: PaymentMethod;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  mobilePhone: string;
  mobileName: string;
  connected: string[];
};

const DEFAULT: CreatorData = {
  fullName: "",
  email: "",
  password: "",
  confirm: "",
  displayName: "",
  username: "",
  bio: "",
  country: "",
  city: "",
  languages: [],
  categories: [],
  referral: "",
  paymentMethod: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  mobilePhone: "",
  mobileName: "",
  connected: [],
};

const LANGUAGES = ["English", "Luganda", "Swahili", "French", "Arabic", "Spanish", "Portuguese", "Other"];
const CATEGORIES = [
  "Beauty","Fashion","Lifestyle","Travel","Food","Technology","Gaming","Comedy","Education","Business",
  "Fitness","Outdoor","Photography","Music","Family","Sports","DIY","Finance","Cars","Entertainment",
];
const REFERRALS = ["TikTok","Instagram","YouTube","Friend","Google Search","Facebook","LinkedIn","Event","Advertisement","Other"];

const PROVIDERS = [
  { id: "tiktok", name: "TikTok", color: "#000000", accent: "#FE2C55" },
  { id: "instagram", name: "Instagram", color: "#262626", accent: "#E1306C" },
  { id: "youtube", name: "YouTube", color: "#0F0F0F", accent: "#FF0000" },
  { id: "facebook", name: "Facebook", color: "#1877F2", accent: "#1877F2" },
  { id: "x", name: "X", color: "#000000", accent: "#1D9BF0" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", accent: "#0A66C2" },
];

function CreatorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CreatorData>(DEFAULT);
  const [activeProvider, setActiveProvider] = useState<typeof PROVIDERS[number] | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => setData(loadOnboarding(STORAGE_KEY, DEFAULT)), []);
  useEffect(() => saveOnboarding(STORAGE_KEY, data), [data]);

  // step 8 — auto progress through phases
  useEffect(() => {
    if (step !== 8) return;
    setLoadingPhase(0);
    const phases = [900, 1500, 2200];
    const timers = phases.map((d, i) => setTimeout(() => setLoadingPhase(i + 1), d));
    const done = setTimeout(() => setStep(9), 3200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [step]);

  const set = (p: Partial<CreatorData>) => setData((d) => ({ ...d, ...p }));
  const toggle = (key: "languages" | "categories" | "connected", v: string, max?: number) =>
    setData((d) => {
      const has = d[key].includes(v);
      let next = has ? d[key].filter((x) => x !== v) : [...d[key], v];
      if (max && next.length > max) next = next.slice(0, max);
      return { ...d, [key]: next };
    });

  const canContinue = useMemo(() => {
    if (step === 1) return data.fullName && data.email && data.password.length >= 6 && data.password === data.confirm;
    if (step === 2) return data.displayName && data.username && data.country;
    if (step === 3) return data.languages.length > 0;
    if (step === 4) return data.categories.length > 0;
    if (step === 5) return !!data.referral;
    if (step === 6) {
      if (data.paymentMethod === "bank") return data.bankName && data.bankAccountName && data.bankAccountNumber;
      if (data.paymentMethod === "mobile") return data.mobilePhone && data.mobileName;
      return false;
    }
    if (step === 7) return data.connected.length >= 1;
    return true;
  }, [step, data]);

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const titles = [
    "Create Your Creator Account",
    "Let's Create Your Profile",
    "Tell us about your Content",
    "What content do you create?",
    "How did you find Goheza?",
    "How would you like to be paid?",
    "Link your Social Accounts",
    "",
    "",
  ];
  const subtitles = [
    "Join thousands of creators earning from real performance.",
    "Your profile is how brands discover and trust you.",
    "Pick every language you create in.",
    "Choose up to 6 categories — these power your campaign matches.",
    "We'd love to know how you found us.",
    "Choose a payout method. You can change this anytime.",
    "Connect at least one to start receiving brand briefs.",
    "",
    "",
  ];

  const side = step >= 2 && step <= 7 ? <ProfilePreview data={data} /> : null;

  return (
    <OnboardingShell
      step={step}
      totalSteps={TOTAL}
      title={titles[step - 1]}
      subtitle={subtitles[step - 1]}
      onBack={step > 1 && step !== 8 && step !== 9 ? back : undefined}
      onContinue={step < TOTAL ? next : () => navigate({ to: "/" })}
      continueLabel={
        step === 8 ? "" : step === 9 ? "Browse Campaigns" : step === 7 ? "Continue" : "Continue"
      }
      continueDisabled={!canContinue}
      hideFooter={step === 8 || step === 9}
      side={side}
    >
      {step === 1 && <AccountStep data={data} set={set} />}
      {step === 2 && <ProfileStep data={data} set={set} />}
      {step === 3 && (
        <SelectGrid
          options={LANGUAGES}
          selected={data.languages}
          onToggle={(v) => toggle("languages", v)}
          subLabel={`${data.languages.length}/${LANGUAGES.length} selected`}
        />
      )}
      {step === 4 && (
        <SelectGrid
          options={CATEGORIES}
          selected={data.categories}
          onToggle={(v) => toggle("categories", v, 6)}
          subLabel={`${data.categories.length}/6 — Choose up to 6`}
        />
      )}
      {step === 5 && (
        <SelectGrid
          options={REFERRALS}
          selected={data.referral ? [data.referral] : []}
          onToggle={(v) => set({ referral: data.referral === v ? "" : v })}
          subLabel={data.referral ? `Selected: ${data.referral}` : "Pick one"}
          single
        />
      )}
      {step === 6 && <PaymentStep data={data} set={set} />}
      {step === 7 && (
        <SocialsStep
          connected={data.connected}
          onConnect={(p) => setActiveProvider(p)}
        />
      )}
      {step === 8 && <ConnectingStep phase={loadingPhase} />}
      {step === 9 && <SuccessStep data={data} />}

      {activeProvider && (
        <MockOAuthModal
          provider={activeProvider}
          onCancel={() => setActiveProvider(null)}
          onAuthorize={() => {
            toggle("connected", activeProvider.id);
            setActiveProvider(null);
          }}
        />
      )}
    </OnboardingShell>
  );
}

/* --------- steps --------- */

function AccountStep({ data, set }: { data: CreatorData; set: (p: Partial<CreatorData>) => void }) {
  const checks = [
    { label: "Full name added", ok: !!data.fullName.trim() },
    { label: "Email added", ok: !!data.email.trim() },
    { label: "Password is at least 6 characters", ok: data.password.length >= 6 },
    { label: "Passwords match", ok: data.password.length > 0 && data.password === data.confirm },
  ];
  return (
    <div className="rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input className={fieldClass} value={data.fullName} onChange={(e) => set({ fullName: e.target.value })} placeholder="Jane Doe" />
        </Field>
        <Field label="Email">
          <input className={fieldClass} type="email" value={data.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@email.com" />
        </Field>
        <Field label="Password">
          <input className={fieldClass} type="password" value={data.password} onChange={(e) => set({ password: e.target.value })} placeholder="Min 6 characters" />
        </Field>
        <Field label="Confirm password">
          <input className={fieldClass} type="password" value={data.confirm} onChange={(e) => set({ confirm: e.target.value })} placeholder="Repeat password" />
        </Field>
      </div>

      <ul className="mt-5 space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className={`flex items-center gap-2 text-[12px] ${c.ok ? "text-[oklch(0.45_0.16_152)]" : "text-muted-foreground"}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full ${c.ok ? "bg-[oklch(0.95_0.08_152)]" : "bg-ink/10"}`}>
              {c.ok ? <Check className="h-2.5 w-2.5" /> : <span className="h-1 w-1 rounded-full bg-ink-soft" />}
            </span>
            {c.label}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">or sign up with</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {SIGNUP_PROVIDERS.map(({ id, name, Logo }) => (
          <button
            key={id}
            type="button"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-hairline bg-background px-4 py-3 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/[0.03]"
          >
            <Logo size={18} />
            Continue with {name}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[11px] text-muted-foreground">
        By creating an account you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
}

function ProfileStep({ data, set }: { data: CreatorData; set: (p: Partial<CreatorData>) => void }) {
  return (
    <div className="rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-8">
      <Field label="Profile photo">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/10 text-ink-soft">
            {data.displayName ? data.displayName.slice(0, 1).toUpperCase() : "+"}
          </div>
          <button type="button" className="rounded-full border border-hairline bg-background px-4 py-2 text-xs font-semibold text-ink hover:bg-ink/5">
            Upload photo
          </button>
        </div>
      </Field>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Display name">
          <input className={fieldClass} value={data.displayName} onChange={(e) => set({ displayName: e.target.value })} placeholder="Jane D." />
        </Field>
        <Field label="Username">
          <input
            className={fieldClass}
            value={data.username}
            onChange={(e) => set({ username: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase() })}
            placeholder="@yourhandle"
          />
        </Field>
        <Field label="Country">
          <input className={fieldClass} value={data.country} onChange={(e) => set({ country: e.target.value })} placeholder="Uganda" />
        </Field>
        <Field label="City">
          <input className={fieldClass} value={data.city} onChange={(e) => set({ city: e.target.value })} placeholder="Kampala" />
        </Field>
        <Field label="Bio" className="sm:col-span-2">
          <textarea
            className={`${fieldClass} min-h-[88px] resize-none`}
            maxLength={60}
            value={data.bio}
            onChange={(e) => set({ bio: e.target.value })}
            placeholder="A short one-liner about you"
          />
          <span className="mt-1 block text-right text-[11px] text-muted-foreground">{data.bio.length}/60</span>
        </Field>
      </div>
    </div>
  );
}

function SelectGrid({
  options,
  selected,
  onToggle,
  subLabel,
  single,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  subLabel: string;
  single?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-8">
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
                on
                  ? "border-primary/40 bg-primary/10 text-ink shadow-glow"
                  : "border-hairline bg-background text-ink-soft hover:border-ink/20 hover:text-ink"
              }`}
            >
              {single ? o : on ? `✓ ${o}` : o}
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-xs font-medium text-muted-foreground">{subLabel}</p>
    </div>
  );
}

function PaymentStep({ data, set }: { data: CreatorData; set: (p: Partial<CreatorData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <PaymentCard
          selected={data.paymentMethod === "bank"}
          onClick={() => set({ paymentMethod: "bank" })}
          icon={<CreditCard className="h-5 w-5" />}
          title="Bank Account"
          body="Best for larger payouts. 1–3 business days."
        />
        <PaymentCard
          selected={data.paymentMethod === "mobile"}
          onClick={() => set({ paymentMethod: "mobile" })}
          icon={<Smartphone className="h-5 w-5" />}
          title="Mobile Money"
          body="Fast, near-instant payouts to your phone."
        />
      </div>

      {data.paymentMethod === "bank" && (
        <div className="rounded-3xl border border-hairline bg-surface-elevated p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bank name"><input className={fieldClass} value={data.bankName} onChange={(e) => set({ bankName: e.target.value })} /></Field>
            <Field label="Account name"><input className={fieldClass} value={data.bankAccountName} onChange={(e) => set({ bankAccountName: e.target.value })} /></Field>
            <Field label="Account number" className="sm:col-span-2"><input className={fieldClass} value={data.bankAccountNumber} onChange={(e) => set({ bankAccountNumber: e.target.value })} /></Field>
          </div>
        </div>
      )}
      {data.paymentMethod === "mobile" && (
        <div className="rounded-3xl border border-hairline bg-surface-elevated p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone number"><input className={fieldClass} value={data.mobilePhone} onChange={(e) => set({ mobilePhone: e.target.value })} placeholder="+256…" /></Field>
            <Field label="Registered name"><input className={fieldClass} value={data.mobileName} onChange={(e) => set({ mobileName: e.target.value })} /></Field>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentCard({
  selected, onClick, icon, title, body,
}: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; body: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-3 rounded-3xl border p-6 text-left transition-all ${
        selected ? "border-primary/40 bg-primary/5 shadow-glow ring-2 ring-primary/30" : "border-hairline bg-surface-elevated hover:-translate-y-0.5 hover:border-ink/15"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="text-[13px] text-muted-foreground">{body}</p>
    </button>
  );
}

function SocialsStep({
  connected,
  onConnect,
}: {
  connected: string[];
  onConnect: (p: typeof PROVIDERS[number]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDERS.map((p) => {
          const isOn = connected.includes(p.id);
          const Logo = PROVIDER_ICONS[p.id as keyof typeof PROVIDER_ICONS];
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border bg-surface-elevated p-4 transition-all sm:p-5 ${
                isOn ? "border-[oklch(0.78_0.18_152_/_0.4)] bg-[oklch(0.97_0.04_152)]" : "border-hairline hover:-translate-y-0.5 hover:border-ink/15"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background ring-1 ring-hairline">
                  {Logo ? <Logo size={22} /> : p.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[15px] font-semibold text-ink">{p.name}</p>
                  <p className="text-[11.5px] text-muted-foreground">
                    {isOn ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              {isOn ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.95_0.08_152)] px-3 py-1.5 text-[11px] font-semibold text-[oklch(0.45_0.16_152)]">
                  <Check className="h-3 w-3" /> Connected
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onConnect(p)}
                  className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-background hover:opacity-90"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-background p-4 text-[12px] text-ink-soft">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-3 w-3" />
        </span>
        <p>
          Your data is secure. Goheza is PDPO compliant, and your account information is
          encrypted and protected. We never post on your behalf.
        </p>
      </div>
    </div>
  );
}

function ConnectingStep({ phase }: { phase: number }) {
  const messages = [
    "Setting up your creator profile…",
    "Analyzing your social accounts…",
    "Matching you with relevant briefs…",
    "Almost ready…",
  ];
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="relative">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-glow"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div className="absolute -inset-6 -z-10 rounded-full bg-primary/20 blur-2xl" />
      </div>
      <h2 className="font-display mt-8 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
        Connecting accounts
      </h2>
      <div className="mt-3 h-6 text-[15px] text-muted-foreground transition-opacity">
        {messages[Math.min(phase, messages.length - 1)]}
      </div>
      <div className="mt-6 flex gap-1.5">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-10 rounded-full transition-all ${
              i <= phase ? "bg-primary" : "bg-ink/10"
            }`}
            style={i <= phase ? { backgroundImage: "var(--gradient-primary)" } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function SuccessStep({ data }: { data: CreatorData }) {
  const connectedProviders = PROVIDERS.filter((p) => data.connected.includes(p.id));
  const summary = [
    { label: "Profile Complete", on: !!(data.displayName && data.username) },
    { label: "Payment Method Added", on: !!data.paymentMethod },
    { label: "Interests Selected", on: data.categories.length > 0 },
    { label: "Languages Selected", on: data.languages.length > 0 },
  ];
  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated p-8 sm:p-12">
      <div className="text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <PartyPopper className="h-7 w-7" />
        </div>
        <h2 className="font-display mt-6 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          You're all set, {data.displayName || "creator"}!
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          Your creator account is ready. Start exploring briefs that match your niche.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-background p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Connected accounts</p>
          <ul className="mt-3 space-y-2">
            {connectedProviders.length === 0 ? (
              <li className="text-sm text-muted-foreground">No accounts connected — you can add them later.</li>
            ) : (
              connectedProviders.map((p) => {
                const Logo = PROVIDER_ICONS[p.id as keyof typeof PROVIDER_ICONS];
                return (
                <li key={p.id} className="flex items-center gap-3 text-sm text-ink">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-background ring-1 ring-hairline">
                    {Logo ? <Logo size={16} /> : p.name.slice(0, 1)}
                  </span>
                  <span className="flex-1">{p.name}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[oklch(0.45_0.16_152)]">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                </li>
                );
              })
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-hairline bg-background p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Profile summary</p>
          <ul className="mt-3 space-y-2">
            {summary.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-sm text-ink">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${s.on ? "bg-primary text-primary-foreground" : "bg-ink/10 text-ink-soft"}`}>
                  <Check className="h-3 w-3" />
                </span>
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/creator/campaigns"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Browse Campaigns
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-6 py-3 text-sm font-semibold text-ink hover:bg-ink/5"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

/* --------- side preview --------- */
function ProfilePreview({ data }: { data: CreatorData }) {
  return (
    <div className="sticky top-32 rounded-3xl border border-hairline bg-surface-elevated p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/10 text-lg font-semibold text-ink">
          {(data.displayName || data.fullName || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-lg font-semibold text-ink">{data.displayName || data.fullName || "Your name"}</p>
          <p className="truncate text-[12px] text-muted-foreground">@{data.username || "username"}</p>
        </div>
      </div>
      {data.bio && <p className="mt-4 text-[14px] leading-relaxed text-ink">{data.bio}</p>}
      {data.languages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {data.languages.map((l) => (
            <span key={l} className="rounded-full bg-ink/8 px-2.5 py-1 text-[11px] font-medium text-ink">
              {l}
            </span>
          ))}
        </div>
      )}
      {data.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {data.categories.map((c) => (
            <span key={c} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              {c}
            </span>
          ))}
        </div>
      )}
      {data.connected.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Connected</p>
          <div className="mt-2 flex gap-1.5">
            {data.connected.map((id) => {
              const Logo = PROVIDER_ICONS[id as keyof typeof PROVIDER_ICONS];
              if (!Logo) return null;
              return (
                <span key={id} className="flex h-7 w-7 items-center justify-center rounded-lg bg-background ring-1 ring-hairline">
                  <Logo size={16} />
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- shared --------- */
const fieldClass =
  "w-full rounded-xl border border-hairline bg-background px-4 py-3 text-[14px] text-ink placeholder:text-ink-soft/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}
