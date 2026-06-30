import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Plus, Play, ExternalLink, Trash2, Edit3, Lightbulb, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/admin/examples")({
  head: () => ({ meta: [{ title: "Content Examples — Admin" }] }),
  component: ExamplesPage,
});

type Platform = "TikTok" | "Instagram Reels" | "YouTube Shorts" | "Static Post" | "Other";
type ContentType = "Creator" | "Referral" | "Logo / Flyer" | "Clipping" | "Static";

type Example = {
  id: string;
  title: string;
  platform: Platform;
  campaignType: ContentType;
  thumbnail: string;
  videoUrl: string;
  why: string;
  learning: string[];
};

const PLATFORMS: Platform[] = ["TikTok", "Instagram Reels", "YouTube Shorts", "Static Post", "Other"];
const CAMPAIGN_TYPES: ContentType[] = ["Creator", "Referral", "Logo / Flyer", "Clipping", "Static"];

const SEED: Example[] = [
  {
    id: "e1",
    title: "Glow Serum — POV unboxing",
    platform: "TikTok",
    campaignType: "Creator",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aaa67dd80df3?w=600&q=80",
    videoUrl: "https://www.tiktok.com/@example/video/1",
    why: "Hooks with extreme close-up of texture in the first second and integrates the discount code naturally in the voice-over.",
    learning: ["Strong product-led hook within 1s", "Natural voice-over CTA", "Trending audio under 30s"],
  },
  {
    id: "e2",
    title: "Nova Pay referral story",
    platform: "Instagram Reels",
    campaignType: "Referral",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    videoUrl: "https://www.instagram.com/reel/example",
    why: "Personal anecdote feels authentic, screen-recording proves the app works, pinned comment closes the loop.",
    learning: ["Real, relatable use-case", "On-screen UI proof", "Pinned referral comment"],
  },
  {
    id: "e3",
    title: "Festival flyer embedded in highlight clip",
    platform: "YouTube Shorts",
    campaignType: "Logo / Flyer",
    thumbnail: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    videoUrl: "https://youtube.com/shorts/example",
    why: "Flyer placed in safe-zone for the entire clip without obscuring the action; matches platform safe zones.",
    learning: ["12–18% frame width", "Stable on-screen duration", "Color-safe placement"],
  },
  {
    id: "e4",
    title: "Podcast highlight — bold caption clipping",
    platform: "TikTok",
    campaignType: "Clipping",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80",
    videoUrl: "https://www.tiktok.com/@example/video/2",
    why: "Strongest line of the episode hooks instantly, every word captioned, payoff lands inside 45s.",
    learning: ["Punchline hook in <2s", "Full-word captions", "Vertical 9:16 face zone"],
  },
];

function ExamplesPage() {
  const [filter, setFilter] = useState<ContentType | "All">("All");
  const [items, setItems] = useState<Example[]>(SEED);
  const [editing, setEditing] = useState<Example | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Example | null>(null);

  const visible = items.filter((i) => filter === "All" || i.campaignType === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Example Creator Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">Reference library for internal use & creator education across every campaign type.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" /> Add example
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", ...CAMPAIGN_TYPES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              filter === c ? "border-transparent bg-ink text-white" : "border-hairline bg-surface-elevated text-ink hover:bg-ink/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface-elevated p-12 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-ink">No examples yet for this filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((ex) => (
            <article key={ex.id} className="overflow-hidden rounded-2xl border border-hairline bg-surface-elevated shadow-card transition-transform hover:-translate-y-0.5">
              <button onClick={() => setPreview(ex)} className="relative block aspect-video w-full overflow-hidden bg-ink">
                <img src={ex.thumbnail} alt={ex.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-ink/30">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-ink shadow-lg">
                    <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                  </span>
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{ex.platform}</span>
                <span className="absolute right-3 top-3 rounded-full bg-primary/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{ex.campaignType}</span>
              </button>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold text-ink">{ex.title}</h3>
                <p className="mt-2 inline-flex items-start gap-1.5 text-xs text-ink-soft">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.6_0.14_75)]" />
                  <span>{ex.why}</span>
                </p>
                <div className="mt-3">
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <GraduationCap className="h-3 w-3" /> Key learnings
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs text-ink-soft">
                    {ex.learning.map((l, i) => <li key={i}>· {l}</li>)}
                  </ul>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
                  <a href={ex.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    Open source <ExternalLink className="h-3 w-3" />
                  </a>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(ex); setOpen(true); }} className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/5"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setItems((arr) => arr.filter((x) => x.id !== ex.id))} className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {open && (
        <DraftModal
          initial={editing}
          onClose={() => setOpen(false)}
          onSave={(ex) => {
            setItems((arr) => (editing ? arr.map((i) => (i.id === editing.id ? ex : i)) : [...arr, { ...ex, id: `e${Date.now()}` }]));
            setOpen(false);
          }}
        />
      )}

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-surface-elevated" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video bg-ink">
              <img src={preview.thumbnail} alt={preview.title} className="h-full w-full object-cover opacity-80" />
            </div>
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{preview.platform} · {preview.campaignType}</p>
              <h3 className="font-display mt-1 text-xl font-semibold text-ink">{preview.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{preview.why}</p>
              <a href={preview.videoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Open source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DraftModal({ initial, onClose, onSave }: { initial: Example | null; onClose: () => void; onSave: (e: Example) => void }) {
  const [ex, setEx] = useState<Example>(
    initial ?? {
      id: "", title: "", platform: "TikTok", campaignType: "Creator",
      thumbnail: "", videoUrl: "", why: "", learning: [""],
    },
  );
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-surface-elevated p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl font-semibold text-ink">{initial ? "Edit example" : "Add example"}</h2>
        <div className="mt-4 space-y-3">
          <Input label="Title" value={ex.title} onChange={(v) => setEx({ ...ex, title: v })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Platform" value={ex.platform} options={PLATFORMS} onChange={(v) => setEx({ ...ex, platform: v as Platform })} />
            <Select label="Campaign type" value={ex.campaignType} options={CAMPAIGN_TYPES} onChange={(v) => setEx({ ...ex, campaignType: v as ContentType })} />
          </div>
          <Input label="Thumbnail URL" value={ex.thumbnail} onChange={(v) => setEx({ ...ex, thumbnail: v })} />
          <Input label="Source / video URL" value={ex.videoUrl} onChange={(v) => setEx({ ...ex, videoUrl: v })} />
          <Textarea label="Why this is effective" value={ex.why} onChange={(v) => setEx({ ...ex, why: v })} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Key learning points</p>
            <div className="mt-1 space-y-2">
              {ex.learning.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input value={l} onChange={(e) => setEx({ ...ex, learning: ex.learning.map((x, idx) => (idx === i ? e.target.value : x)) })} className="flex-1 rounded-lg border border-hairline bg-background px-3 py-2 text-sm" />
                  <button onClick={() => setEx({ ...ex, learning: ex.learning.filter((_, idx) => idx !== i) })} className="rounded-lg px-2 text-ink-soft hover:bg-ink/5"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => setEx({ ...ex, learning: [...ex.learning, ""] })} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"><Plus className="h-3 w-3" /> Add</button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5">Cancel</button>
          <button onClick={() => onSave(ex)} className="rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow" style={{ backgroundImage: "var(--gradient-primary)" }}>Save example</button>
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
function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
