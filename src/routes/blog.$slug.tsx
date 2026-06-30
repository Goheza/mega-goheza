import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, Quote } from "lucide-react";
import { AudienceProvider } from "@/components/site/AudienceContext";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FacebookLogo, LinkedInLogo, XLogo } from "@/components/brand-logos";
import { allPosts, type Post } from "@/components/site/Blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const all = [...allPosts.brands, ...allPosts.creators];
    const post = all.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    const audience = allPosts.brands.includes(post) ? "brands" : "creators";
    const list = audience === "brands" ? allPosts.brands : allPosts.creators;
    const idx = list.indexOf(post);
    return {
      post,
      audience,
      prev: idx > 0 ? list[idx - 1] : null,
      next: idx < list.length - 1 ? list[idx + 1] : null,
      related: list.filter((p) => p.slug !== post.slug).slice(0, 3),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Goheza` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.cover },
          { name: "twitter:image", content: loaderData.post.cover },
        ]
      : [{ title: "Article — Goheza" }],
  }),
  notFoundComponent: () => (
    <div className="p-20 text-center">
      <p className="text-ink-soft">Article not found.</p>
      <Link to="/blog" className="mt-4 inline-block text-primary underline">Back to blog</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-20 text-center text-ink-soft">Something went wrong: {String(error)}</div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { post, prev, next, related } = Route.useLoaderData();

  return (
    <AudienceProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <Nav />
        <main className="pt-28 pb-20 sm:pt-36">
          <article className="mx-auto max-w-6xl px-5 sm:px-8">
            {/* Hero — split */}
            <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_1fr]">
              <div>
                <span className="inline-flex items-center rounded-full border border-hairline bg-surface-elevated px-3 py-1 text-[11px] font-medium text-ink-soft">
                  {post.category}
                </span>
                <h1 className="font-display mt-4 text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[56px]">
                  {post.title}
                </h1>
                <div className="mt-6 flex items-center gap-3 text-[13px] text-muted-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-[12px] font-semibold text-ink">
                    MP
                  </span>
                  <span className="text-ink">by Martin Praja</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readingTime}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden rounded-[24px] bg-ink">
                <img
                  src={post.cover}
                  alt={post.title}
                  loading="eager"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
                />
              </div>
            </div>

            {/* Body + sticky sidebar */}
            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
              <div className="prose-goheza max-w-2xl">
                <Section title="The real bottleneck isn't talent">
                  <p>{post.excerpt}</p>
                  <p>
                    When momentum breaks, it's rarely because the work is hard. It's because the process around
                    the work is messy — vague briefs, slow approvals, attribution that nobody trusts.
                  </p>
                </Section>

                <Section title="Where things actually get stuck">
                  <p>
                    It usually starts with a vague brief. The team starts moving in a direction that made sense at
                    the time, but wasn't quite what the stakeholders had in mind. By the time feedback comes in,
                    there's already a week of work to revisit.
                  </p>
                  <p>
                    Then comes the revision loop. One round turns into three. Small tweaks become large reworks.
                    Timelines stretch. Enthusiasm fades.
                  </p>
                </Section>

                <Pull>
                  Speed isn't just about working harder. It's about designing your process so friction doesn't
                  accumulate at every handoff.
                </Pull>

                <Section title="What fast-moving teams do differently">
                  <p>
                    Teams that consistently ship great work quickly share one thing: they invest in clarity before
                    they invest in execution. A tight brief takes 20 minutes. A misaligned project can take weeks
                    to recover from.
                  </p>
                  <p>
                    They also close the feedback loop early. Getting a rough version in front of the right eyes
                    sooner — even when it's not polished — saves enormous amounts of time downstream.
                  </p>
                </Section>

                <figure className="my-10 overflow-hidden rounded-[20px] border border-hairline">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&q=70"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <figcaption className="bg-surface-elevated px-5 py-3 text-[12px] text-muted-foreground">
                    Modern teams treat process as a design decision, not an afterthought.
                  </figcaption>
                </figure>

                <Section title="Speed is a design decision">
                  <p>
                    Moving fast isn't just about working harder. It's about designing your process so friction
                    doesn't accumulate. Every handoff, every approval step, every revision round — these are all
                    design choices.
                  </p>
                  <p>Make them intentionally, and the work flows. Leave them to chance, and it stalls.</p>
                </Section>
              </div>

              {/* Sticky sidebar */}
              <aside className="lg:sticky lg:top-32 lg:self-start">
                <div className="overflow-hidden rounded-[20px] border border-hairline bg-surface-elevated p-5">
                  <p className="text-[13px] font-semibold text-ink">
                    <span className="text-primary">Get Special Offer</span> and Latest Updates
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                    New playbooks, teardowns, and product updates from the Goheza team.
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-4 space-y-2.5"
                  >
                    <label className="block text-[11px] font-medium text-ink-soft">Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-hairline bg-background px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-soft/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink px-3.5 py-2.5 text-[13px] font-semibold text-background hover:opacity-90"
                    >
                      Count me in! <ArrowRight className="h-3 w-3" />
                    </button>
                  </form>
                </div>

                <div className="mt-5 rounded-[20px] border border-hairline bg-surface-elevated p-5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    Share this article
                  </p>
                  <div className="mt-3 flex gap-2">
                    {[
                      { Icon: FacebookLogo, label: "Facebook" },
                      { Icon: LinkedInLogo, label: "LinkedIn" },
                      { Icon: XLogo, label: "X" },
                    ].map(({ Icon, label }) => (
                      <a
                        key={label}
                        href="#"
                        aria-label={`Share on ${label}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-background transition-transform hover:scale-105"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            {/* Prev / Next */}
            <div className="mt-20 grid gap-4 border-t border-hairline pt-10 sm:grid-cols-2">
              {prev ? (
                <Link
                  to="/blog/$slug"
                  params={{ slug: prev.slug }}
                  className="group rounded-2xl border border-hairline bg-surface-elevated p-5 transition-all hover:-translate-y-0.5 hover:border-ink/15"
                >
                  <span className="flex items-center gap-1 text-[12px] font-medium text-ink-soft">
                    <ArrowLeft className="h-3 w-3" /> Previous
                  </span>
                  <p className="font-display mt-2 line-clamp-2 text-[15px] font-semibold text-ink group-hover:text-primary">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to="/blog/$slug"
                  params={{ slug: next.slug }}
                  className="group rounded-2xl border border-hairline bg-surface-elevated p-5 text-right transition-all hover:-translate-y-0.5 hover:border-ink/15"
                >
                  <span className="flex items-center justify-end gap-1 text-[12px] font-medium text-ink-soft">
                    Next <ArrowRight className="h-3 w-3" />
                  </span>
                  <p className="font-display mt-2 line-clamp-2 text-[15px] font-semibold text-ink group-hover:text-primary">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
            </div>

            {/* More Insights */}
            <div className="mt-20">
              <div className="flex items-end justify-between">
                <h2 className="font-display text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
                  More Insights
                </h2>
                <Link to="/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                  Browse all <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r: Post) => (
                  <Link
                    key={r.slug}
                    to="/blog/$slug"
                    params={{ slug: r.slug }}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-2xl bg-ink">
                      <img
                        src={r.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="mt-4 inline-flex items-center rounded-full border border-hairline bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                      {r.category}
                    </span>
                    <p className="font-display mt-3 text-[17px] font-semibold leading-snug tracking-[-0.012em] text-ink group-hover:text-primary">
                      {r.title}
                    </p>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </AudienceProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">{title}</h2>
      <div className="mt-3 space-y-4 text-[15.5px] leading-[1.75] text-ink-soft">{children}</div>
    </section>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="relative my-10 rounded-2xl border-l-4 border-primary bg-surface-elevated px-6 py-5 text-[18px] font-medium italic leading-relaxed text-ink">
      <Quote className="absolute -left-1 -top-3 h-6 w-6 rounded-full bg-primary p-1 text-primary-foreground" />
      {children}
    </blockquote>
  );
}
