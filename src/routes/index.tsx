import { createFileRoute } from "@tanstack/react-router";
import { AudienceProvider, useAudience } from "@/components/site/AudienceContext";
import { Nav } from "@/components/site/Nav";
import { AudienceBar } from "@/components/site/AudienceBar";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { WhyChoose } from "@/components/site/WhyChoose";
import { Testimonials } from "@/components/site/Testimonials";
import { Blog } from "@/components/site/Blog";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goheza - Performance marketing, powered by creators" },
      {
        name: "description",
        content:
          "Launch creator campaigns that pay for outcomes — installs, sales, and signups. Or earn as a creator on transparent, performance-based payouts.",
      },
      
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AudienceProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <Nav />
        <main>
          <div className="section-cream">
            <AudienceBar />
            <Hero />
          </div>

          <div className="section-warm">
            <HowItWorks />
          </div>

          <div className="section-cream">
            <WhyChoose />
          </div>

          <div className="section-stone">
            <Testimonials />
          </div>

          <div className="section-cream">
            <Faq />
          </div>

          <div className="section-warm">
            <Blog />
          </div>

          <DarkCta />
        </main>
        <Footer />
      </div>
    </AudienceProvider>
  );
}

function DarkCta() {
  const { audience } = useAudience();
  const label = audience === "brands" ? "Launch My Campaign" : "Start Earning Today";
  const head =
    audience === "brands"
      ? "Spend less on retainers. Pay only when campaigns deliver."
      : "Create in our style. Get paid for the results you drive";
  const sub =
    audience === "brands"
      ? "Goheza turns creators into your highest-performing acquisition channel."
      : "Join thousands of creators earning from campaigns that match your niche.";

  return (
    <section id="cta" className="section-dark relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "oklch(0.705 0.182 24 / 0.35)" }}
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse-dot" />
          Get started in minutes
        </span>
        <h2 className="font-display mt-5 text-balance text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          {head}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">{sub}</p>
        <a
          href={`/get-started?as=${audience === "brands" ? "brand" : "creator"}`}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          {label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
