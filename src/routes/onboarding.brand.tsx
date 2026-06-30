import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Rocket, Target, Sparkles, PartyPopper } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { loadOnboarding, saveOnboarding } from "@/lib/onboarding-storage";

export const Route = createFileRoute("/onboarding/brand")({
  head: () => ({ meta: [{ title: "Brand Onboarding — Goheza" }] }),
  component: BrandOnboarding,
});

type BrandData = {
  companyName: string;
  website: string;
  country: string;
  companyEmail: string;
  phoneNumber: string;
  goals: string[];
  otherGoal: string;
};

const DEFAULT: BrandData = {
  companyName: "",
  website: "",
  country: "",
  companyEmail: "",
  phoneNumber: "",
  goals: [],
  otherGoal: "",
};

const STORAGE_KEY = "goheza.onboarding.brand";
const TOTAL = 4;

const GOALS = [
  "Brand Awareness",
  "App Installs",
  "Sales",
  "Leads",
  "Product Launch",
  "Website Traffic",
  "User Generated Content",
  "Community Growth",
  "Other",
];

function BrandOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BrandData>(DEFAULT);

  useEffect(() => setData(loadOnboarding(STORAGE_KEY, DEFAULT)), []);
  useEffect(() => saveOnboarding(STORAGE_KEY, data), [data]);

  const canContinue = useMemo(() => {
    if (step === 2)
      return !!(data.companyName && data.website && data.country && data.companyEmail && data.phoneNumber);
    if (step === 3) {
      if (data.goals.length === 0) return false;
      if (data.goals.includes("Other") && !data.otherGoal.trim()) return false;
      return true;
    }
    return true;
  }, [step, data]);

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const toggleGoal = (v: string) =>
    setData((d) => ({
      ...d,
      goals: d.goals.includes(v) ? d.goals.filter((x) => x !== v) : [...d.goals, v],
    }));

  return (
    <OnboardingShell
      step={step}
      totalSteps={TOTAL}
      onBack={step > 1 && step < TOTAL ? back : undefined}
      onContinue={step < TOTAL ? next : () => navigate({ to: "/brand" })}
      continueLabel={step === TOTAL - 1 ? "Submit" : step === TOTAL ? "Go to Dashboard" : "Continue"}
      continueDisabled={!canContinue}
      title={titleFor(step)}
      subtitle={subtitleFor(step)}
      hideFooter={step === TOTAL}
    >
      {step === 1 && <WelcomeStep onStart={next} />}
      {step === 2 && <CompanyStep data={data} set={(p) => setData((d) => ({ ...d, ...p }))} />}
      {step === 3 && (
        <GoalsStep
          selected={data.goals}
          otherGoal={data.otherGoal}
          onToggle={toggleGoal}
          onOtherChange={(v) => setData((d) => ({ ...d, otherGoal: v }))}
        />
      )}
      {step === 4 && <CompleteStep />}
    </OnboardingShell>
  );
}

function titleFor(step: number) {
  return [
    "Welcome to Goheza",
    "Tell us about your company",
    "What are your goals?",
    "You're all set!",
  ][step - 1];
}
function subtitleFor(step: number) {
  return [
    "Performance-based creator campaigns, built for marketing teams that care about ROI.",
    "We use this to verify your account and reach you for kickoff.",
    "Pick everything that applies — you can refine for each campaign later.",
    "",
  ][step - 1];
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  const items = [
    { icon: <Rocket className="h-4 w-4" />, title: "Launch in minutes", body: "Brief, budget, assets — go live the same day." },
    { icon: <Target className="h-4 w-4" />, title: "Pay only for results", body: "Per install, sale, signup, or 1,000 verified views." },
    { icon: <Sparkles className="h-4 w-4" />, title: "Vetted creators", body: "Pre-screened for quality, audience, and performance." },
  ];
  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="rounded-2xl border border-hairline bg-background p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {i.icon}
            </span>
            <p className="font-display mt-4 text-base font-semibold text-ink">{i.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{i.body}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        Let's begin
      </button>
    </div>
  );
}

function CompanyStep({
  data,
  set,
}: {
  data: BrandData;
  set: (p: Partial<BrandData>) => void;
}) {
  return (
    <div className="grid gap-5 rounded-3xl border border-hairline bg-surface-elevated p-7 sm:grid-cols-2 sm:p-8">
      <Field label="Company name">
        <input value={data.companyName} onChange={(e) => set({ companyName: e.target.value })} placeholder="Acme Inc." className={fieldClass} />
      </Field>
      <Field label="Website">
        <input value={data.website} onChange={(e) => set({ website: e.target.value })} placeholder="https://" className={fieldClass} />
      </Field>
      <Field label="Country">
        <input value={data.country} onChange={(e) => set({ country: e.target.value })} placeholder="United States" className={fieldClass} />
      </Field>
      <Field label="Company email">
        <input type="email" value={data.companyEmail} onChange={(e) => set({ companyEmail: e.target.value })} placeholder="team@acme.com" className={fieldClass} />
      </Field>
      <Field label="Phone number" className="sm:col-span-2">
        <input type="tel" value={data.phoneNumber} onChange={(e) => set({ phoneNumber: e.target.value })} placeholder="+1 555 000 0000" className={fieldClass} />
      </Field>
    </div>
  );
}

function GoalsStep({
  selected,
  otherGoal,
  onToggle,
  onOtherChange,
}: {
  selected: string[];
  otherGoal: string;
  onToggle: (v: string) => void;
  onOtherChange: (v: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {GOALS.map((g) => {
          const isOn = selected.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => onToggle(g)}
              className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-[14px] font-medium transition-all ${
                isOn
                  ? "border-primary/40 bg-primary/5 text-ink shadow-glow"
                  : "border-hairline bg-background text-ink hover:border-ink/15"
              }`}
            >
              {g}
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  isOn ? "border-primary bg-primary text-primary-foreground" : "border-hairline"
                }`}
              >
                {isOn && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
      {selected.includes("Other") && (
        <div className="mt-5 animate-fade">
          <label className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Tell us your goal</label>
          <input
            value={otherGoal}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="e.g. Drive in-store foot traffic for our flagship opening"
            className={`${fieldClass} mt-1.5`}
          />
        </div>
      )}
      <p className="mt-5 text-xs text-muted-foreground">{selected.length} selected</p>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated p-8 text-center sm:p-12">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <PartyPopper className="h-7 w-7" />
      </div>
      <h2 className="font-display mt-6 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
        Your account is being prepared
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
        Thanks for the details. A member of the Goheza partnerships team will reach out within
        one business day to verify your account and walk you through your first campaign.
      </p>

      <div className="mx-auto mt-7 grid max-w-md gap-3 text-left">
        {["Account verification", "Personalized creator pool", "Campaign launch walkthrough"].map((t) => (
          <div key={t} className="flex items-center gap-3 rounded-2xl border border-hairline bg-background px-4 py-3 text-sm text-ink">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3.5 w-3.5" />
            </span>
            {t}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/brand"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/schedule"
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-6 py-3 text-sm font-semibold text-ink hover:bg-ink/5"
        >
          Book a demo now
        </Link>
      </div>
    </div>
  );
}

/* ---------- shared ---------- */
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
