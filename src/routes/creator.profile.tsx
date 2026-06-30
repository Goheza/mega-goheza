import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, Languages, Tag, CreditCard, LinkIcon, Phone, Image as ImageIcon } from "lucide-react";
import { DashCard, PageHeader } from "@/components/creator/dash-ui";
import { creator } from "@/components/creator/dash-data";
import { TikTokLogo, InstagramLogo, YouTubeLogo } from "@/components/brand-logos";

export const Route = createFileRoute("/creator/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="How brands and the Goheza community see you." />

      <DashCard>
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative">
            <img src={creator.avatar} alt={creator.name} className="h-20 w-20 rounded-full object-cover ring-2 ring-hairline" />
            <button className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-glow" aria-label="Change photo">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{creator.name}</p>
            <p className="text-sm text-muted-foreground">{creator.handle} · Joined {creator.joined}</p>
          </div>
          <span className="ml-auto rounded-full bg-[oklch(0.94_0.07_55)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.5_0.18_45)]">{creator.level}</span>
        </div>
      </DashCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashCard>
          <p className="text-sm font-semibold text-ink">Bio</p>
          <textarea defaultValue={creator.bio} rows={4} className="mt-3 w-full rounded-xl border border-hairline bg-background p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </DashCard>

        <DashCard>
          <p className="text-sm font-semibold text-ink">Details</p>
          <ul className="mt-4 space-y-3 text-sm">
            <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={creator.country} />
            <Row icon={<Languages className="h-4 w-4" />} label="Languages" value={creator.languages.join(", ")} />
            <Row icon={<Tag className="h-4 w-4" />} label="Categories" value={creator.categories.join(", ")} />
            <Row icon={<Phone className="h-4 w-4" />} label="Phone" value="+27 71 234 5678" />
            <Row icon={<CreditCard className="h-4 w-4" />} label="Payout method" value="Bank · ••8421" />
          </ul>
        </DashCard>

        <DashCard className="lg:col-span-2">
          <p className="text-sm font-semibold text-ink">Connected Social Accounts</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <Social icon={<TikTokLogo className="h-5 w-5" />} name="TikTok" handle="@naledi.creates" />
            <Social icon={<InstagramLogo className="h-5 w-5" />} name="Instagram" handle="@naledi.creates" />
            <Social icon={<YouTubeLogo className="h-5 w-5" />} name="YouTube" handle="@nalediFilms" />
          </ul>
        </DashCard>

        <DashCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Portfolio</p>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
              <ImageIcon className="h-3.5 w-3.5" /> Add work
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["1522335789203-aaa67dd80df3", "1494314671902-399b18174975", "1606921231106-f1083329a65c", "1518611012118-696072aa579a"].map((id) => (
              <img key={id} src={`https://images.unsplash.com/photo-${id}?w=400&q=80`} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            ))}
          </div>
        </DashCard>
      </div>

      <div className="flex justify-end">
        <button
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02]"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-hairline pb-3 last:border-0 last:pb-0">
      <span className="inline-flex items-center gap-2 text-muted-foreground">{icon}{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </li>
  );
}

function Social({ icon, name, handle }: { icon: React.ReactNode; name: string; handle: string }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-hairline bg-background p-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/5">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-muted-foreground">{handle}</p>
        </div>
      </div>
      <button className="inline-flex items-center gap-1 text-xs font-semibold text-[oklch(0.55_0.18_45)] hover:underline">
        <LinkIcon className="h-3 w-3" /> Manage
      </button>
    </li>
  );
}
