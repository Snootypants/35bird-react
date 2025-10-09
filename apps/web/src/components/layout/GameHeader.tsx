import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

import { DOCK_OFFSET } from '@/config/dockMenu'

function GameHeader() {
  return (
    <header className="pointer-events-none">
      <div
        className="fixed pointer-events-auto z-[300]"
        style={{ top: `${DOCK_OFFSET}px`, right: `${DOCK_OFFSET}px` }}
      >
        <Link
          to="/"
          aria-label="Back to home"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Home className="h-5 w-5" strokeWidth={1.6} />
        </Link>
      </div>
    </header>
  )
}

export default GameHeader
