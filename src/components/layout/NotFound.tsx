import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

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
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default NotFound
