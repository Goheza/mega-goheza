import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, XCircle, Sparkles, FileText, Target, Megaphone, AlertTriangle, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/admin/templates")({
  head: () => ({ meta: [{ title: "Campaign Templates — Admin" }] }),
  component: TemplatesPage,
});

type CampaignTypeKey = "creator" | "referral" | "logo" | "clipping" | "future";

type Template = {
  id: string;
  type: CampaignTypeKey;
  title: string;
  objective: string;
  brief: string;
  dos: string[];
  donts: string[];
  deliverables: string[];
  cta: string;
  assets: string[];
  bestPractices: string[];
  mistakes: string[];
};

const TYPES: { id: CampaignTypeKey; label: string; tagline: string }[] = [
  { id: "creator", label: "Creator Campaign", tagline: "Original creator-led content" },
  { id: "referral", label: "Referral Campaign", tagline: "Drive signups via creator referrals" },
  { id: "logo", label: "Logo / Flyer Placement", tagline: "Brand placement inside creator content" },
  { id: "clipping", label: "Clipping Campaign", tagline: "Cut & repost long-form into shorts" },
  { id: "future", label: "Future Campaign Types", tagline: "Drafts & experiments" },
];

const SEED: Template[] = [
  {
    id: "t1",
    type: "creator",
    title: "Summer Glow Launch — TikTok Creator Push",
    objective: "Drive product awareness and 1.5M qualified views for a new skincare drop.",
    brief: "Authentic GRWM-style video featuring the Glow Serum. Show texture, application, and end-result in natural lighting.",
    dos: [
      "Show the product within the first 3 seconds",
      "Use natural daylight or warm tones",
      "Include the official campaign hashtag in caption",
      "Mention the discount code in voice-over",
    ],
    donts: [
      "Do not compare with competitor brands",
      "No heavy filters that obscure product",
      "Avoid medical or curative claims",
      "Do not repost the same video to multiple campaigns",
    ],
    deliverables: ["1 vertical 9:16 video (15–45s)", "Caption with hashtag + CTA", "Upload link to TikTok post"],
    cta: "Use code GLOW20 — link in bio",
    assets: ["Product hero shots", "Brand logo pack", "Hashtag sheet", "Tone-of-voice doc"],
    bestPractices: [
      "Hook in first second with movement or close-up",
      "Show the product texture or splash effect for stopping power",
      "Use trending audio under 30 seconds",
    ],
    mistakes: [
      "Generic intro without showing product",
      "Forgetting the campaign hashtag",
      "Posting at low-engagement hours",
    ],
  },
  {
    id: "t2",
    type: "referral",
    title: "Nova Pay — VIP Referral Loop",
    objective: "Convert creator audiences into Nova Pay signups via a unique referral link.",
    brief: "Creators share a personal story about saving money or sending payments, ending with their unique referral link.",
    dos: ["Share a personal anecdote", "Show the app interface briefly", "Pin the referral link in comments"],
    donts: ["No misleading earnings claims", "Avoid spammy mass tagging", "No paid-promo disclosure shortcuts"],
    deliverables: ["1 short-form video (under 60s)", "Pinned comment with referral link", "Story repost within 24h"],
    cta: "Sign up with my link — first transfer free",
    assets: ["UI screen recordings", "App icon pack", "Referral link generator"],
    bestPractices: ["Use a real, relatable use-case", "Show the actual referral reward visually"],
    mistakes: ["Faked screenshots", "Overpromising earnings"],
  },
  {
    id: "t3",
    type: "logo",
    title: "Festival Flyer Placement — Sports Recap",
    objective: "Embed the festival flyer within high-performing sports recap content.",
    brief: "Logo / flyer must remain on-screen for the full duration of the clip in a non-intrusive position.",
    dos: ["Place flyer top-right or bottom-left", "Keep flyer at 12–18% of frame width", "Maintain logo safe-area"],
    donts: ["Do not animate or distort the logo", "Do not cover key on-field action", "No color manipulation"],
    deliverables: ["1 reposted clip with embedded flyer", "Proof of impression duration"],
    cta: "Tickets live — link in bio",
    assets: ["Flyer PNG (transparent)", "Logo lockups", "Placement guide PDF"],
    bestPractices: ["Use highest-engagement moment of the clip", "Match placement to platform safe zones"],
    mistakes: ["Flyer disappearing before end of clip", "Logo overlapping faces or scores"],
  },
  {
    id: "t4",
    type: "clipping",
    title: "Podcast Highlight Clipping — Replays",
    objective: "Distribute viral 30–60s clips from full-length podcast episodes across short-form platforms.",
    brief: "Identify a punchline or insight moment, caption it boldly, and post natively to TikTok / Reels / Shorts.",
    dos: ["Caption every word on-screen", "Hook with strongest line in first 2s", "Credit the original show"],
    donts: ["No watermarks from third-party tools", "Do not edit out context that changes meaning", "No clickbait titles"],
    deliverables: ["3 clips per week", "Original posts on creator account", "Performance link sheet"],
    cta: "Watch the full episode — link in bio",
    assets: ["Full episode files", "Show logo + lower-thirds", "Caption style guide"],
    bestPractices: ["Use vertical 9:16 with 60% face zone", "Bold sans-serif subtitles, high contrast"],
    mistakes: ["Sub-30s clips with no payoff", "Inconsistent caption styling across clips"],
  },
];

function TemplatesPage() {
  const [active, setActive] = useState<CampaignTypeKey>("creator");
  const [items, setItems] = useState<Template[]>(SEED);
  const [editing, setEditing] = useState<Template | null>(null);
  const [draftOpen, setDraftOpen] = useState(false);

  const visible = items.filter((i) => i.type === active);

  const remove = (id: string) => setItems((arr) => arr.filter((i) => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Campaign Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">Internal knowledge base. Surfaced to brands as guidance during campaign creation.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setDraftOpen(true); }}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" /> New template
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              active === t.id ? "border-transparent bg-ink text-white" : "border-hairline bg-surface-elevated text-ink hover:bg-ink/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface-elevated p-12 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-ink">No templates yet for this campaign type.</p>
          <p className="mt-1 text-xs text-muted-foreground">Click "New template" to draft one.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {visible.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              onEdit={() => { setEditing(tpl); setDraftOpen(true); }}
              onDelete={() => remove(tpl.id)}
            />
          ))}
        </div>
      )}

      {draftOpen && (
        <DraftModal
          initial={editing}
          defaultType={active}
          onClose={() => setDraftOpen(false)}
          onSave={(tpl) => {
            setItems((arr) => {
              if (editing) return arr.map((i) => (i.id === editing.id ? tpl : i));
              return [...arr, { ...tpl, id: `t${Date.now()}` }];
            });
            setDraftOpen(false);
          }}
        />
      )}
    </div>
  );
}

function TemplateCard({ tpl, onEdit, onDelete }: { tpl: Template; onEdit: () => void; onDelete: () => void }) {
  return (
    <article className="rounded-2xl border border-hairline bg-surface-elevated p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{TYPES.find((t) => t.id === tpl.type)?.label}</p>
          <h3 className="font-display mt-1 text-lg font-semibold text-ink">{tpl.title}</h3>
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={onEdit} className="rounded-lg p-2 text-ink-soft hover:bg-ink/5" title="Edit"><Edit3 className="h-4 w-4" /></button>
          <button onClick={onDelete} className="rounded-lg p-2 text-ink-soft hover:bg-ink/5" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <Block icon={<Target className="h-4 w-4" />} label="Objective">{tpl.objective}</Block>
      <Block icon={<FileText className="h-4 w-4" />} label="Brief">{tpl.brief}</Block>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ListBox tone="do" title="Do's" items={tpl.dos} />
        <ListBox tone="dont" title="Don'ts" items={tpl.donts} />
      </div>

      <Block icon={<Megaphone className="h-4 w-4" />} label="Deliverables">
        <ul className="mt-1 list-disc space-y-1 pl-5">{tpl.deliverables.map((d, i) => <li key={i}>{d}</li>)}</ul>
      </Block>
      <Block icon={<Sparkles className="h-4 w-4" />} label="Call-to-action"><em>"{tpl.cta}"</em></Block>
      <Block icon={<FileText className="h-4 w-4" />} label="Example assets">
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tpl.assets.map((a) => (
            <span key={a} className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink">{a}</span>
          ))}
        </div>
      </Block>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SoftBox icon={<Lightbulb className="h-4 w-4 text-[oklch(0.5_0.14_152)]" />} title="Best practices" items={tpl.bestPractices} />
        <SoftBox icon={<AlertTriangle className="h-4 w-4 text-[oklch(0.55_0.18_25)]" />} title="Common mistakes" items={tpl.mistakes} />
      </div>
    </article>
  );
}

function Block({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{icon}{label}</p>
      <div className="mt-1 text-sm text-ink-soft">{children}</div>
    </div>
  );
}

function ListBox({ tone, title, items }: { tone: "do" | "dont"; title: string; items: string[] }) {
  const isDo = tone === "do";
  return (
    <div className={`rounded-xl border p-3 ${isDo ? "border-[oklch(0.85_0.08_152)] bg-[oklch(0.97_0.04_152)]" : "border-[oklch(0.85_0.08_25)] bg-[oklch(0.97_0.04_25)]"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDo ? "text-[oklch(0.4_0.14_152)]" : "text-[oklch(0.5_0.18_25)]"}`}>{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-ink">
            {isDo ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.5_0.14_152)]" /> : <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.55_0.18_25)]" />}
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SoftBox({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-hairline bg-background p-3">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">{icon}{title}</p>
      <ul className="mt-2 space-y-1 text-xs text-ink-soft">
        {items.map((i, idx) => <li key={idx}>· {i}</li>)}
      </ul>
    </div>
  );
}

// ---------- modal ----------
function DraftModal({
  initial, defaultType, onClose, onSave,
}: { initial: Template | null; defaultType: CampaignTypeKey; onClose: () => void; onSave: (t: Template) => void }) {
  const [t, setT] = useState<Template>(
    initial ?? {
      id: "", type: defaultType, title: "", objective: "", brief: "",
      dos: [""], donts: [""], deliverables: [""], cta: "", assets: [""], bestPractices: [""], mistakes: [""],
    },
  );

  const arrField = (key: keyof Template, label: string) => (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 space-y-2">
        {(t[key] as string[]).map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => setT({ ...t, [key]: (t[key] as string[]).map((x, idx) => (idx === i ? e.target.value : x)) })}
              className="flex-1 rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setT({ ...t, [key]: (t[key] as string[]).filter((_, idx) => idx !== i) })}
              className="rounded-lg px-2 text-ink-soft hover:bg-ink/5"
            ><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setT({ ...t, [key]: [...(t[key] as string[]), ""] })}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        ><Plus className="h-3 w-3" /> Add</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-elevated p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">{initial ? "Edit template" : "New template"}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-ink/5"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <select value={t.type} onChange={(e) => setT({ ...t, type: e.target.value as CampaignTypeKey })} className="w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm">
            {TYPES.map((tp) => <option key={tp.id} value={tp.id}>{tp.label}</option>)}
          </select>
          <Input label="Title" value={t.title} onChange={(v) => setT({ ...t, title: v })} />
          <Input label="Objective" value={t.objective} onChange={(v) => setT({ ...t, objective: v })} />
          <Textarea label="Brief" value={t.brief} onChange={(v) => setT({ ...t, brief: v })} />
          <Input label="Call-to-action" value={t.cta} onChange={(v) => setT({ ...t, cta: v })} />
          {arrField("dos", "Do's")}
          {arrField("donts", "Don'ts")}
          {arrField("deliverables", "Deliverables")}
          {arrField("assets", "Example assets")}
          {arrField("bestPractices", "Best practices")}
          {arrField("mistakes", "Common mistakes")}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5">Cancel</button>
          <button
            onClick={() => onSave(t)}
            className="rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >Save template</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary" />
    </label>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary" />
    </label>
  );
}
function X({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>; }
