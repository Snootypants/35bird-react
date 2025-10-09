import { motion } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Header from './components/layout/Header'
import HomePage from './components/layout/HomePage'
import NotFound from './components/layout/NotFound'
import ComingSoon from './components/layout/ComingSoon'
import PlayAsteroids from './routes/PlayAsteroids'
import SplashCursorBackground from './components/effects/SplashCursorBackground'
import HeroTestingPanel from './components/panels/HeroTestingPanel'
import { HeroSettingsProvider } from './context/HeroSettingsProvider'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isAsteroidsRoute = location.pathname.startsWith('/play/asteroids')

  return (
    <HeroSettingsProvider>
      <motion.div
        className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} ${isAsteroidsRoute ? 'asteroids-layout' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`page ${isAsteroidsRoute ? 'asteroids-page' : 'bg-background text-foreground'}`}>
          {!isAsteroidsRoute && <SplashCursorBackground />}
          <Header
            theme={theme}
            onThemeToggle={toggleTheme}
            minimal={isAsteroidsRoute}
          />
          {!isAsteroidsRoute && <HeroTestingPanel />}
          <main className={isAsteroidsRoute ? 'asteroids-main' : 'main relative z-10'} role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<ComingSoon title="Games" />} />
              <Route path="/tools" element={<ComingSoon title="Tools" />} />
              <Route path="/play/asteroids" element={<PlayAsteroids />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </motion.div>
    </HeroSettingsProvider>
  )
}

export default App
