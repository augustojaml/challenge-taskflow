'use client'

import { Button } from '@/shared/components'
import { useToast } from '@/shared/providers/toast-provider'

const highlights = [
  {
    title: 'Official stack',
    desc: 'Next.js + React + TypeScript with Tailwind CSS v4.',
  },
  {
    title: 'shadcn standard',
    desc: 'Theme, tokens, and base Button and Input components ready.',
  },
  {
    title: 'Lint and format',
    desc: 'ESLint flat config, Prettier, and import sorting configured.',
  },
]

export default function WelcomePage() {
  const { showToast } = useToast()

  return (
    <main className="bg-background text-foreground relative min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col items-center gap-6 text-center">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.25em] uppercase">
            front-app
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl leading-tight font-black md:text-5xl">
              The React framework for your stack
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Project ready to build high-quality apps: Next.js, Tailwind CSS,
              shadcn/ui, alias{' '}
              <code className="bg-muted text-foreground rounded px-1 py-0.5">
                @/*
              </code>{' '}
              and linting configured.
            </p>
          </div>
          <div className="border-border/60 bg-background/80 text-muted-foreground rounded-full border px-4 py-2 text-xs shadow-sm">
            pnpm dev - pnpm lint - pnpm build
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() =>
              showToast({
                title: 'Setup ready',
                message: 'Providers, theme, and toast support are wired up.',
                type: 'success',
                position: 'bottom-right',
              })
            }
          >
            Show toast
          </Button>
        </header>

        <section className="space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold">What is included</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Everything you need to ship the next feature without touching the
              setup.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="border-border/60 bg-card/70 rounded-xl border p-5 text-left shadow-sm"
              >
                <h3 className="text-foreground text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
