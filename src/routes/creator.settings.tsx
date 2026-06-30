import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, Smartphone, Plus, Star, Trash2, Pencil, Check } from "lucide-react";
import { DashCard, PageHeader } from "@/components/creator/dash-ui";
import { paymentMethods as seed, type PaymentMethod } from "@/components/creator/dash-data";

export const Route = createFileRoute("/creator/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account, security, payment methods, and preferences." />

      <DashCard>
        <p className="text-sm font-semibold text-ink">Account</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Email" value="naledi@goheza.com" />
          <Field label="Username" value="naledi.creates" />
        </div>
      </DashCard>

      <DashCard>
        <p className="text-sm font-semibold text-ink">Security</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Current password" type="password" value="••••••••" />
          <Field label="New password" type="password" value="" placeholder="At least 8 characters" />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-hairline bg-background p-4">
          <div>
            <p className="text-sm font-semibold text-ink">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
          <Toggle defaultChecked />
        </div>
      </DashCard>

      <PaymentMethodsCard />

      <DashCard>
        <p className="text-sm font-semibold text-ink">Notification Preferences</p>
        <ul className="mt-4 divide-y divide-hairline">
          {[
            ["Campaign approvals", true],
            ["New campaign matches", true],
            ["Weekly earnings summary", true],
            ["Marketing & product updates", false],
          ].map(([label, checked]) => (
            <li key={String(label)} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ink">{label}</span>
              <Toggle defaultChecked={Boolean(checked)} />
            </li>
          ))}
        </ul>
      </DashCard>

      <DashCard>
        <p className="text-sm font-semibold text-ink">Privacy</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-ink">Show my profile in the public creator directory</span>
            <Toggle defaultChecked />
          </li>
          <li className="flex items-center justify-between">
            <span className="text-ink">Allow brands to invite me directly</span>
            <Toggle defaultChecked />
          </li>
        </ul>
      </DashCard>

      <DashCard className="border-[oklch(0.85_0.06_25)] bg-[oklch(0.98_0.02_25)]">
        <p className="text-sm font-semibold text-[oklch(0.45_0.18_25)]">Danger Zone</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-ink-soft">Permanently delete your account and all of its data.</p>
          <button className="rounded-full bg-[oklch(0.55_0.18_25)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Delete Account</button>
        </div>
      </DashCard>
    </div>
  );
}

function PaymentMethodsCard() {
  const [methods, setMethods] = useState<PaymentMethod[]>(seed);
  const [adding, setAdding] = useState<null | "Bank Account" | "Mobile Money">(null);
  const [flash, setFlash] = useState<string | null>(null);

  const [bank, setBank] = useState({ bankName: "", accountName: "", accountNumber: "" });
  const [momo, setMomo] = useState({ network: "", phone: "", registeredName: "" });

  function notify(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2500);
  }
  function makeDefault(id: string) {
    setMethods((arr) => arr.map((m) => ({ ...m, isDefault: m.id === id })));
    notify("Default payment method updated.");
  }
  function remove(id: string) {
    setMethods((arr) => arr.filter((m) => m.id !== id));
    notify("Payment method removed.");
  }
  function saveNew() {
    if (adding === "Bank Account" && bank.bankName && bank.accountNumber) {
      setMethods((arr) => [
        ...arr,
        {
          id: `pm${Date.now()}`,
          type: "Bank Account",
          label: bank.bankName,
          details: `${bank.accountName} · ••••${bank.accountNumber.slice(-4)}`,
          isDefault: false,
        },
      ]);
      setBank({ bankName: "", accountName: "", accountNumber: "" });
      setAdding(null);
      notify("Bank account added.");
    } else if (adding === "Mobile Money" && momo.network && momo.phone) {
      setMethods((arr) => [
        ...arr,
        {
          id: `pm${Date.now()}`,
          type: "Mobile Money",
          label: momo.network,
          details: `${momo.registeredName} · ${momo.phone}`,
          isDefault: false,
        },
      ]);
      setMomo({ network: "", phone: "", registeredName: "" });
      setAdding(null);
      notify("Mobile money account added.");
    }
  }

  return (
    <DashCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Payment Methods</p>
          <p className="text-xs text-muted-foreground">Add or update where your earnings get sent.</p>
        </div>
        {!adding && (
          <div className="flex gap-2">
            <button onClick={() => setAdding("Bank Account")} className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
              <Plus className="h-3.5 w-3.5" /> Bank
            </button>
            <button onClick={() => setAdding("Mobile Money")} className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
              <Plus className="h-3.5 w-3.5" /> Mobile Money
            </button>
          </div>
        )}
      </div>

      {flash && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[oklch(0.93_0.08_152)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.4_0.14_152)]">
          <Check className="h-3 w-3" /> {flash}
        </div>
      )}

      <ul className="mt-4 space-y-3">
        {methods.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-hairline bg-background p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink/5">
              {m.type === "Bank Account" ? <Landmark className="h-5 w-5 text-ink" /> : <Smartphone className="h-5 w-5 text-ink" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-ink">{m.label}</p>
                {m.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.07_55)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.18_45)]">
                    <Star className="h-2.5 w-2.5 fill-current" /> Default
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{m.type} · {m.details}</p>
            </div>
            <div className="flex items-center gap-2">
              {!m.isDefault && (
                <button onClick={() => makeDefault(m.id)} className="rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
                  Set default
                </button>
              )}
              <button className="rounded-full border border-hairline bg-background p-2 text-ink hover:bg-ink/5" aria-label="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => remove(m.id)} className="rounded-full border border-hairline bg-background p-2 text-[oklch(0.55_0.18_25)] hover:bg-[oklch(0.97_0.04_25)]" aria-label="Remove">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {adding && (
        <div className="mt-5 rounded-2xl border border-hairline bg-[oklch(0.97_0.012_78)] p-5">
          <p className="text-sm font-semibold text-ink">Add {adding}</p>
          {adding === "Bank Account" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="Bank Name" value={bank.bankName} onChange={(v) => setBank({ ...bank, bankName: v })} />
              <Field label="Account Name" value={bank.accountName} onChange={(v) => setBank({ ...bank, accountName: v })} />
              <Field label="Account Number" value={bank.accountNumber} onChange={(v) => setBank({ ...bank, accountNumber: v })} />
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="Mobile Network" value={momo.network} onChange={(v) => setMomo({ ...momo, network: v })} placeholder="MTN, Airtel, M-Pesa…" />
              <Field label="Phone Number" value={momo.phone} onChange={(v) => setMomo({ ...momo, phone: v })} placeholder="+27 71 234 5678" />
              <Field label="Registered Name" value={momo.registeredName} onChange={(v) => setMomo({ ...momo, registeredName: v })} />
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setAdding(null)} className="rounded-full border border-hairline bg-background px-4 py-2 text-xs font-semibold text-ink hover:bg-ink/5">
              Cancel
            </button>
            <button onClick={saveNew} className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow" style={{ backgroundImage: "var(--gradient-primary)" }}>
              Save Payment Method
            </button>
          </div>
        </div>
      )}
    </DashCard>
  );
}

function Field({
  label, value, type = "text", placeholder, onChange,
}: { label: string; value: string; type?: string; placeholder?: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        defaultValue={onChange ? undefined : value}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-hairline bg-background px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </label>
  );
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-ink/15 transition-colors peer-checked:bg-primary" style={{ backgroundImage: defaultChecked ? "var(--gradient-primary)" : undefined }} />
      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
    </label>
  );
}
