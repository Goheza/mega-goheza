import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Sparkles, Share2, Image as ImageIcon, Scissors, Crown, Calendar } from "lucide-react";
import { CampaignTypeCard, PageHeader } from "@/components/brand/brand-ui";
import type { CampaignType } from "@/components/brand/brand-data";

export const Route = createFileRoute("/brand/create")({
  head: () => ({ meta: [{ title: "Create Campaign — Goheza" }] }),
  component: CreateLayout,
});

const TYPES: { id: CampaignType; title: string; description: string; icon: React.ReactNode; comingSoon?: boolean }[] = [
  { id: "creator", title: "Creator Campaign", description: "Vetted creators produce original content promoting your brand. Pay per 1,000 verified views.", icon: <Sparkles className="h-5 w-5" /> },
  { id: "referral", title: "Referral Campaign", description: "Creators earn commissions when their audience completes a referral action. Flat fee per creator.", icon: <Share2 className="h-5 w-5" /> },
  { id: "logo", title: "Logo / Flyer Placement", description: "Creators place your logo, flyer or visual asset inside their existing content.", icon: <ImageIcon className="h-5 w-5" /> },
  { id: "clipping", title: "Clipping Campaign", description: "Creators repost or clip your existing content for performance-based reach.", icon: <Scissors className="h-5 w-5" /> },
  { id: "ambassador", title: "Ambassador Campaign", description: "Long-term partnerships with select creators across multiple campaigns.", icon: <Crown className="h-5 w-5" />, comingSoon: true },
  { id: "event", title: "Event Activation", description: "On-the-ground creator coverage and content from your events.", icon: <Calendar className="h-5 w-5" />, comingSoon: true },
];

function CreateLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onIndex = pathname === "/brand/create";

  if (!onIndex) return <Outlet />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create a campaign"
        subtitle="Choose the campaign type that fits your goal. You'll configure the brief and budget on the next step."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {TYPES.map((t) => (
          <Link key={t.id} to={t.comingSoon ? "/brand/create" : "/brand/create/$type"} params={{ type: t.id }}>
            <CampaignTypeCard
              title={t.title}
              description={t.description}
              icon={t.icon}
              comingSoon={t.comingSoon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
