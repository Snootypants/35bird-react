import clsx from 'clsx'

import HeroGlow from '../effects/HeroGlow'
import styles from './HomePage.module.css'

function HomePage() {
  return (
    <div className="relative z-20 flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 text-slate-200 sm:min-h-[calc(100vh-5rem)] sm:px-6">
      <div className="relative flex w-full max-w-[min(95vw,84rem)] flex-col items-center gap-6 text-center sm:gap-8">
        <HeroGlow className="mb-2" alt="35Bird" />

        <div className="space-y-2.5 sm:space-y-3">
          <h1
            className={clsx(
              styles.heroHeading,
              'font-bold tracking-tight text-white text-[44px] leading-[1.08] sm:text-[66px] md:text-[82px]',
            )}
          >
            <span className="text-white">Welcome to</span>
            {' '}
            <span className={styles.heroHeadingGradient}>35Bird</span>
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
