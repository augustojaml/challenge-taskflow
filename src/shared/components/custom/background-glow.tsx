'use client'

const BackgroundGlow = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="from-primary/25 to-secondary/25 absolute top-0 -left-20 h-72 w-72 rounded-full bg-linear-to-br blur-3xl" />
      <div className="to-primary/20 absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-linear-to-tr from-emerald-400/20 blur-3xl" />
    </div>
  )
}

export { BackgroundGlow }
