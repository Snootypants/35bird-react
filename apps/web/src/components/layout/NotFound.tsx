import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

import { ROUTES } from '@/config/routes'
import { Typography } from '../ui/typography'

function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant="h1" className="text-8xl font-bold text-muted-foreground mb-4">
          404
        </Typography>
        <Typography variant="h2" className="mb-4">
          Page Not Found
        </Typography>
        <Typography variant="large" className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </Typography>
        <Link
          to={ROUTES.home.path}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <Home className="w-4 h-4" />
          Back to {ROUTES.home.label}
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default NotFound
