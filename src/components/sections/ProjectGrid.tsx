import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import projectsData from '../../data/projects.json'
import type { Project } from '../../types'

function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Sort projects by priority
    const sortedProjects = [...projectsData].sort((a, b) => a.priority - b.priority)
    setProjects(sortedProjects)
  }, [])

  return (
    <motion.div 
      className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-16 sm:pt-20 px-4 sm:px-0" 
      role="region" 
      aria-label="Project showcase"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProjectGrid