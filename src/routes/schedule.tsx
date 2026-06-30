import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, Globe, Video, ShieldCheck, ArrowRight } from "lucide-react";
import { AudienceProvider } from "@/components/site/AudienceContext";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Book a demo — Goheza" },
      { name: "description", content: "Schedule a 30-minute call with the Goheza team to scope your first performance creator campaign." },
      { property: "og:title", content: "Book a demo with Goheza" },
      { property: "og:description", content: "Pick a time that works for you. 30 minutes, on Google Meet, no pressure." },
    ],
  }),
  component: SchedulePage,
});

const CAL_LINK = (import.meta.env.VITE_CAL_LINK as string | undefined) || "";

function SchedulePage() {
  return (
    <AudienceProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <Nav />
        <main className="pt-28 pb-20 sm:pt-36">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-elevated px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Book a demo
              </span>
              <h1 className="font-display mt-5 text-4xl font-semibold tracking-[-0.035em] text-ink sm:text-[56px]">
                Talk to the Goheza team
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground sm:text-lg">
                Pick a time that works for you. A campaign advisor will walk you through your goals,
                pricing, and how to launch your first performance brief.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-[28px] border border-hairline bg-surface-elevated shadow-card">
              <div className="grid lg:grid-cols-[320px_1fr]">
                <aside className="border-b border-hairline bg-background p-7 sm:p-8 lg:border-b-0 lg:border-r">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    G
                  </span>
                  <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    Goheza
                  </p>
                  <h2 className="font-display mt-1 text-[26px] font-semibold tracking-[-0.02em] text-ink">
                    Discovery Call
                  </h2>

                  <ul className="mt-6 space-y-3 text-[14px] text-ink">
                    <li className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-ink-soft" /> 30 minutes
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Video className="h-4 w-4 text-ink-soft" /> Google Meet
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-ink-soft" /> Your local time zone
                    </li>
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-ink-soft" /> No pressure, no commitment
                    </li>
                  </ul>

                  <div className="mt-8 rounded-2xl border border-hairline bg-surface-elevated p-4">
                    <p className="text-[12px] font-semibold text-ink">What we'll cover</p>
                    <ul className="mt-2 space-y-1.5 text-[12.5px] text-muted-foreground">
                      <li>• Your performance goals and current channels</li>
                      <li>• How Goheza pricing works for your budget</li>
                      <li>• Live tour of the brand dashboard</li>
                    </ul>
                  </div>
                </aside>

                <div className="p-3 sm:p-5">
                  <CalEmbed />
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Prefer email? Write to <a className="underline" href="mailto:hello@goheza.com">hello@goheza.com</a> and we'll reply within one business day.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </AudienceProvider>
  );
}

function CalEmbed() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CAL_LINK) return;
    // Lightweight Cal.com inline embed loader — only runs client-side.
    const w = window as unknown as { Cal?: ((...a: unknown[]) => void) & { loaded?: boolean } };
    const init = () => {
      if (!w.Cal) return;
      w.Cal("init", { origin: "https://cal.com" });
      w.Cal("inline", {
        elementOrSelector: "#cal-inline",
        calLink: CAL_LINK,
        layout: "month_view",
      });
      w.Cal("ui", { theme: "light", styles: { branding: { brandColor: "#FF5F5B" } } });
      setReady(true);
    };
    if (w.Cal) {
      init();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://app.cal.com/embed/embed.js";
    s.async = true;
    s.onload = init;
    document.body.appendChild(s);
  }, []);

  if (!CAL_LINK) return <CalPlaceholder />;

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-2xl bg-background">
      <div id="cal-inline" className="h-full w-full" />
      {!ready && <CalPlaceholder />}
    </div>
  );
}

function CalPlaceholder() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // offset so day 1 starts mid-week
  return (
    <div className="grid h-full gap-5 rounded-2xl bg-background p-5 sm:p-7 md:grid-cols-[1fr_220px]">
      <div>
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-ink">July 2026</p>
          <div className="flex gap-1.5">
            <button className="rounded-lg border border-hairline px-2.5 py-1 text-xs">‹</button>
            <button className="rounded-lg border border-hairline px-2.5 py-1 text-xs">›</button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {days.map((d, i) => {
            const inMonth = d > 0 && d <= 31;
            const active = d === 8;
            return (
              <button
                key={i}
                disabled={!inMonth || d < 5}
                className={`aspect-square rounded-xl text-sm font-medium ${
                  active
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : inMonth && d >= 5
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "text-ink-soft/40"
                }`}
                style={active ? { backgroundImage: "var(--gradient-primary)" } : undefined}
              >
                {inMonth ? d : ""}
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-center gap-2 text-[12px] text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          Pick a date to see available times
        </div>
      </div>
      <div>
        <p className="text-[13px] font-semibold text-ink">Wed 08</p>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-1">
          {["3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm"].map((t) => (
            <button
              key={t}
              className="rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 text-[13px] font-semibold text-ink hover:border-primary/40 hover:text-primary"
            >
              {t}
            </button>
          ))}
        </div>
        <a
          href="mailto:hello@goheza.com"
          className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary"
        >
          Or email us <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
