import { History, LogIn } from 'lucide-react'
import { Button } from '../ui/button'
import { ThemeToggle } from './theme-toggle'
import type { Theme } from '../../types'

interface HeaderProps {
  theme: Theme
  onThemeToggle: () => void
}

function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="header fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" role="banner">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <a href="/" className="header__logo text-2xl font-bold text-foreground hover:scale-105 transition-transform" aria-label="35Bird Home">
          35BIRD
        </a>
        
        <nav className="header__nav flex items-center gap-3 sm:gap-6" role="navigation" aria-label="Main navigation">
          <Button variant="ghost" size="icon" aria-label="Version history">
            <History className="w-5 h-5" />
          </Button>
          
          <a href="#projects" className="header__nav-link text-foreground hover:text-primary transition-colors hidden sm:inline">
            Projects
          </a>
          
          <a href="#info" className="header__nav-link text-foreground hover:text-primary transition-colors hidden sm:inline">
            Info
          </a>
          
          <a href="#contact" className="header__nav-link text-foreground hover:text-primary transition-colors hidden sm:inline">
            Contact
          </a>
          
          <Button variant="ghost" size="icon">
            <LogIn className="w-5 h-5" />
          </Button>
          
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </nav>
      </div>
    </header>
  )
}

export default Header