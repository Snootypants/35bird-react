import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Typography } from '../ui/typography'

interface ComingSoonProps {
  title: string
  description?: string
}

function ComingSoon({ title, description = 'We are putting the finishing touches on this experience. Check back soon!' }: ComingSoonProps) {
  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center sm:px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h1" className="text-4xl font-bold sm:text-5xl">
        {title}
      </Typography>
      <Typography variant="lead" className="max-w-lg text-muted-foreground">
        {description}
      </Typography>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </motion.section>
  )
}

export default ComingSoon
