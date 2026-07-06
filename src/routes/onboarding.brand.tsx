import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Check, Rocket, Target, Sparkles, PartyPopper } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { loadOnboarding, saveOnboarding } from '@/lib/onboarding-storage'
export const Route = createFileRoute('/onboarding/brand')({
    head: () => ({ meta: [{ title: 'Brand Onboarding — Goheza' }] }),
    component: BrandOnboarding,
})
type BrandData = {
    companyName: string
    website: string
    country: string
    companyEmail: string
    phoneNumber: string
    contactPerson: string
    goalsText: string
}
const DEFAULT: BrandData = {
    companyName: '',
    website: '',
    country: '',
    companyEmail: '',
    phoneNumber: '',
    contactPerson: '',
    goalsText: '',
}
const STORAGE_KEY = 'goheza.onboarding.brand'
const TOTAL = 4
function BrandOnboarding() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [data, setData] = useState<BrandData>(DEFAULT)
    useEffect(() => setData(loadOnboarding(STORAGE_KEY, DEFAULT)), [])
    useEffect(() => saveOnboarding(STORAGE_KEY, data), [data])
    const canContinue = useMemo(() => {
        if (step === 2)
            return !!(
                data.companyName &&
                data.website &&
                data.country &&
                data.companyEmail &&
                data.phoneNumber &&
                data.contactPerson
            )
        if (step === 3) return data.goalsText.trim().length > 0
        return true
    }, [step, data])
    const next = () => setStep((s) => Math.min(TOTAL, s + 1))
    const back = () => setStep((s) => Math.max(1, s - 1))
    return (
        <OnboardingShell
            step={step}
            totalSteps={TOTAL}
            onBack={step > 1 && step < TOTAL ? back : undefined}
            onContinue={step < TOTAL ? next : () => navigate({ to: '/brand' })}
            continueLabel={step === TOTAL - 1 ? 'Submit' : step === TOTAL ? 'Go to Dashboard' : 'Continue'}
            continueDisabled={!canContinue}
            title={titleFor(step)}
            subtitle={subtitleFor(step)}
            hideFooter={step === TOTAL}
        >
            {step === 1 && <WelcomeStep onStart={next} />}
            {step === 2 && (
                <CompanyStep
                    data={data}
                    set={(p) => setData((d) => ({ ...d, ...p }))}
                />
            )}
            {step === 3 && (
                <GoalsStep
                    value={data.goalsText}
                    onChange={(v) => setData((d) => ({ ...d, goalsText: v }))}
                />
            )}
            {step === 4 && <CompleteStep />}
        </OnboardingShell>
    )
}
function titleFor(step: number) {
    return ['Welcome to Goheza', 'Tell us about your company', 'What are your goals?', "You're all set!"][step - 1]
}
function subtitleFor(step: number) {
    return [
        'Performance-based creator campaigns, built for marketing teams that care about ROI.',
        'We use this to verify your account and reach you for kickoff.',
        "Tell us what you're hoping to achieve — you can refine this for each campaign later.",
        '',
    ][step - 1]
}
function WelcomeStep({ onStart }: { onStart: () => void }) {
    const items = [
        {
            icon: <Rocket className="h-4 w-4" />,
            title: 'Launch in minutes',
            body: 'Brief, budget, assets — go live the same day.',
        },
        {
            icon: <Target className="h-4 w-4" />,
            title: 'Pay only for results',
            body: 'Per install, sale, signup, or 1,000 verified views.',
        },
        {
            icon: <Sparkles className="h-4 w-4" />,
            title: 'Vetted creators',
            body: 'Pre-screened for quality, audience, and performance.',
        },
    ]
    return (
        <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-3">
                {items.map((i) => (
                    <div
                        key={i.title}
                        className="rounded-2xl border border-hairline bg-background p-5"
                    >
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
                style={{ backgroundImage: 'var(--gradient-primary)' }}
            >
                Let's begin
            </button>
        </div>
    )
}
function CompanyStep({ data, set }: { data: BrandData; set: (p: Partial<BrandData>) => void }) {
    return (
        <div className="grid gap-5 rounded-3xl border border-hairline bg-surface-elevated p-7 sm:grid-cols-2 sm:p-8">
            <Field label="Company name">
                <input
                    value={data.companyName}
                    onChange={(e) => set({ companyName: e.target.value })}
                    placeholder="Acme Inc."
                    className={fieldClass}
                />
            </Field>
            <Field label="Website">
                <input
                    value={data.website}
                    onChange={(e) => set({ website: e.target.value })}
                    placeholder="https://"
                    className={fieldClass}
                />
            </Field>
            <Field label="Country">
                <input
                    value={data.country}
                    onChange={(e) => set({ country: e.target.value })}
                    placeholder="United States"
                    className={fieldClass}
                />
            </Field>
            <Field label="Company email">
                <input
                    type="email"
                    value={data.companyEmail}
                    onChange={(e) => set({ companyEmail: e.target.value })}
                    placeholder="team@acme.com"
                    className={fieldClass}
                />
            </Field>
            <Field label="Contact person">
                <input
                    value={data.contactPerson}
                    onChange={(e) => set({ contactPerson: e.target.value })}
                    placeholder="Jane Doe"
                    className={fieldClass}
                />
            </Field>
            <Field label="Phone number">
                <input
                    type="tel"
                    value={data.phoneNumber}
                    onChange={(e) => set({ phoneNumber: e.target.value })}
                    placeholder="+1 555 000 0000"
                    className={fieldClass}
                />
            </Field>
        </div>
    )
}
function GoalsStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="rounded-3xl border border-hairline bg-surface-elevated p-7 sm:p-8">
            <Field label="Your goals">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. Drive app installs ahead of our Q3 launch, and build a pool of creators we can re-engage for future campaigns."
                    rows={6}
                    className={`${fieldClass} resize-none`}
                />
            </Field>
        </div>
    )
}
function CompleteStep() {
    return (
        <div className="overflow-hidden rounded-3xl border border-hairline bg-surface-elevated p-8 text-center sm:p-12">
            <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
                style={{ backgroundImage: 'var(--gradient-primary)' }}
            >
                <PartyPopper className="h-7 w-7" />
            </div>
            <h2 className="font-display mt-6 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                Your account is being prepared
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                Thanks for the details. A member of the Goheza partnerships team will reach out within one business day
                to verify your account and walk you through your first campaign.
            </p>
            <div className="mx-auto mt-7 grid max-w-md gap-3 text-left">
                {['Account verification', 'Personalized creator pool', 'Campaign launch walkthrough'].map((t) => (
                    <div
                        key={t}
                        className="flex items-center gap-3 rounded-2xl border border-hairline bg-background px-4 py-3 text-sm text-ink"
                    >
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
    )
}
/* ---------- shared ---------- */
const fieldClass =
    'w-full rounded-xl border border-hairline bg-background px-4 py-3 text-[14px] text-ink placeholder:text-ink-soft/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20'
function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                {label}
            </span>
            {children}
        </label>
    )
}
