import { motion } from 'framer-motion'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Header from './components/layout/Header'
import HomePage from './components/layout/HomePage'
import NotFound from './components/layout/NotFound'
import SplashCursorBackground from './components/effects/SplashCursorBackground'
import HeroTestingPanel from './components/panels/HeroTestingPanel'
import { HeroSettingsProvider } from './context/HeroSettingsContext'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <HeroSettingsProvider>
      <motion.div
        className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page bg-background text-foreground">
          {/* Fluid Background Canvas */}
          <SplashCursorBackground />

          {/* Header */}
          <Header theme={theme} onThemeToggle={toggleTheme} />

          {/* Tester Overlay */}
          <HeroTestingPanel />

          {/* Main Content */}
          <main className="main relative z-10" role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </motion.div>
    </HeroSettingsProvider>
  )
}

export default App
