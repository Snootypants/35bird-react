import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'

import { applySiteMetaToDocument } from '@/config/site'
import { ROUTES } from '@/config/routes'
import { useTheme } from './hooks/useTheme'
import Header from './components/layout/Header'
import GameHeader from './components/layout/GameHeader'
import HomePage from './components/layout/HomePage'
import NotFound from './components/layout/NotFound'
import ComingSoon from './components/layout/ComingSoon'
import PlayAsteroids from './routes/PlayAsteroids'
import SplashCursorBackground from './components/effects/SplashCursorBackground'
import HeroTestingPanel from './components/panels/HeroTestingPanel'
import { HeroSettingsProvider } from './context/HeroSettingsProvider'
import './App.css'

function App() {
  const { theme, toggleTheme, syncTheme } = useTheme()
  const location = useLocation()
  const isAsteroidsRoute = location.pathname.startsWith(ROUTES.playAsteroids.path)

  useEffect(() => {
    applySiteMetaToDocument()
  }, [])

  useEffect(() => {
    syncTheme()
  }, [location.pathname, syncTheme])

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
          {isAsteroidsRoute ? (
            <GameHeader />
          ) : (
            <Header
              theme={theme}
              onThemeToggle={toggleTheme}
            />
          )}
          {!isAsteroidsRoute && <HeroTestingPanel />}
          <main className={isAsteroidsRoute ? 'asteroids-main' : 'main relative z-10'} role="main">
            <Routes>
              <Route path={ROUTES.home.path} element={<HomePage />} />
              <Route
                path={ROUTES.games.path}
                element={(
                  <ComingSoon
                    title={ROUTES.games.label}
                    description={ROUTES.games.description}
                  />
                )}
              />
              <Route
                path={ROUTES.tools.path}
                element={(
                  <ComingSoon
                    title={ROUTES.tools.label}
                    description={ROUTES.tools.description}
                  />
                )}
              />
              <Route
                path={ROUTES.playAsteroids.path}
                element={<PlayAsteroids onRestoreTheme={syncTheme} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </motion.div>
    </HeroSettingsProvider>
  )
}

export default App
