import { motion } from 'framer-motion'
import { Typography } from '../ui/typography'

function Hero() {
  return (
    <section
      className="hero relative z-10 min-h-screen flex flex-col items-center justify-center py-20 sm:py-24"
      id="hero"
    >
      <motion.div 
        className="hero-main flex flex-col items-center z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img 
          src="/images/Orange bird.png" 
          alt="35Bird Logo" 
          className="hero__logo w-48 h-48 sm:w-[18.75rem] sm:h-[18.75rem] mb-6 sm:mb-8"
          width="300"
          height="300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
          initial={{ rotate: -10, y: -20 }}
          animate={{ rotate: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h1" className="hero__title text-center mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Welcome to 35Bird
          </Typography>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="hero-subtitle z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Typography variant="lead" className="hero__subtitle">
          Design. Code. Done.
        </Typography>
      </motion.div>
    </section>
  )
}

export default Hero