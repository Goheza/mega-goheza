import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Sparkles, ArrowLeft, Bell } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/site/Logo'

type ComingSoonSearch = {
    feature?: string
    back?: string
}

export const Route = createFileRoute('/coming-soon')({
    head: () => ({ meta: [{ title: 'Coming Soon — Goheza' }] }),
    validateSearch: (search: Record<string, unknown>): ComingSoonSearch => ({
        feature: typeof search.feature === 'string' ? search.feature : undefined,
        back: typeof search.back === 'string' ? search.back : undefined,
    }),
    component: ComingSoonPage,
})

function ComingSoonPage() {
    const navigate = useNavigate()
    const [notified, setNotified] = useState(false)

    const backTo = '/'
    const title = 'This page'

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.965_0.012_78)] px-4 py-12 text-center">
            <div className="mb-8">
                <Logo className="h-8 w-auto" />
            </div>

            <div className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-elevated px-6 py-12 shadow-elevated sm:px-10 sm:py-16">
                <span
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-glow"
                    style={{ backgroundImage: 'var(--gradient-primary)' }}
                >
                    <Sparkles className="h-6 w-6" />
                </span>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Coming soon
                </p>
                <h1 className="font-display mt-2 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
                    "Great things to come"
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    We're still building this part of Goheza. Check back soon — it'll be worth the wait.
                </p>

                <div className="mt-8 flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-hairline">
                    <p className="text-sm text-muted-foreground">Nothing to see here yet.</p>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                    <button
                        onClick={() => navigate({ to: backTo })}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-hairline bg-background px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go back
                    </button>
                  
                </div>
            </div>

            <Link
                to="/"
                className="mt-8 text-xs font-medium text-muted-foreground hover:text-ink hover:underline"
            >
                Return to homepage
            </Link>
        </div>
    )
}
