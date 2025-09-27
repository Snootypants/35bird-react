import HeroGlow from '../effects/HeroGlow'

const heroHeadingCss = `
.hero-heading{font-weight:700;letter-spacing:-0.01em;}
.hero-heading-gradient{display:inline-block;color:#5fa8ff;background-image:linear-gradient(90deg,#93c5fd 0%,#38bdf8 45%,#2563eb 100%);text-shadow:0 10px 30px rgba(56,189,248,.45);}
@supports ((-webkit-background-clip:text) or (background-clip:text)){
  .hero-heading-gradient{-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;}
}
`

function HomePage() {
  return (
    <div className="relative z-20 flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 text-slate-200 sm:min-h-[calc(100vh-5rem)] sm:px-6">
      <style>{heroHeadingCss}</style>

      <div className="relative flex w-full max-w-[min(95vw,84rem)] flex-col items-center gap-6 text-center sm:gap-8">
        <HeroGlow className="mb-2" alt="35Bird" />

        <div className="space-y-2.5 sm:space-y-3">
          <h1 className="hero-heading font-bold tracking-tight text-white text-[44px] leading-[1.08] sm:text-[66px] md:text-[82px]">
            <span className="text-white">Welcome to</span>
            {' '}
            <span className="hero-heading-gradient">35Bird</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-white/60 sm:text-xs">
            Design · Code · Done
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
