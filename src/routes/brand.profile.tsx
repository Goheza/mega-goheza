import { createFileRoute } from "@tanstack/react-router";
import { DashCard, PageHeader } from "@/components/brand/brand-ui";
import { brand } from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/profile")({
  head: () => ({ meta: [{ title: "Profile — Goheza" }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-6">
      <PageHeader title="Brand Profile" subtitle="How creators see your brand. Keep it sharp and on-brand." />

      <DashCard>
        <div className="flex flex-wrap items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-bold text-white shadow-card" style={{ background: brand.color }}>
            {brand.initial}
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold text-ink">{brand.name}</p>
            <p className="text-sm text-muted-foreground">{brand.email}</p>
          </div>
          <button className="ml-auto rounded-full border border-hairline bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
            Upload Logo
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Company name" defaultValue={brand.name} />
          <Field label="Website" defaultValue="https://acmestudio.com" />
          <Field label="Industry" defaultValue="Beauty & Skincare" />
          <Field label="Country" defaultValue="United States" />
          <Field label="Company email" defaultValue={brand.email} />
          <Field label="Phone" defaultValue="+1 555 010 1234" />
        </div>
      </DashCard>

      <DashCard>
        <p className="text-sm font-semibold text-ink">Brand bio</p>
        <p className="mt-1 text-xs text-muted-foreground">A short description that appears on every campaign brief.</p>
        <textarea
          rows={4}
          defaultValue="Acme Studio builds clean, science-backed skincare for everyday performance."
          className="mt-3 w-full rounded-xl border border-hairline bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </DashCard>

      <div className="flex justify-end">
        <button className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          Save Profile
        </button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">{label}</span>
      <input defaultValue={defaultValue} className="w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </label>
  );
}
