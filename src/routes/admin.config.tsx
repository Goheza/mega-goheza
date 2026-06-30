import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/config")({
  component: AdminConfigPage,
});

function AdminConfigPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Platform Configuration</h1>
        <p className="text-sm text-muted-foreground">Global rules that govern every campaign, payout and country on Goheza.</p>
      </header>

      <Section title="Campaign Rules">
        <Toggle label="Minimum campaign duration" value="30 days" />
        <Toggle label="Default platform fee" value="15%" />
        <Toggle label="Allowed campaign types" value="Creator, Referral, Clipping, Logo/Flyer" />
        <Toggle label="Reward limit / 1K views (max)" value="$25" />
        <Toggle label="Creator payout threshold" value="$20" />
      </Section>

      <Section title="Payment Settings">
        <Toggle label="Supported currencies" value="USD · UGX · NGN · KES · GHS · ZAR" />
        <Toggle label="Payment gateways" value="Stripe · Flutterwave · Mobile Money" />
        <Toggle label="Withdrawal window" value="Every Friday, 48h processing" />
      </Section>

      <Section title="Country Control">
        <Toggle label="Enabled countries" value="10 markets active" />
        <Toggle label="Restricted regions" value="None" />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-elevated p-5 sm:p-6">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-4 divide-y divide-hairline">{children}</ul>
    </section>
  );
}

function Toggle({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-[11px] text-muted-foreground">{value}</p>
      </div>
      <button className="rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">Edit</button>
    </li>
  );
}
