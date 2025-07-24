import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Typography } from '../ui/typography'
import type { Project } from '../../types'

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'planning':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <Card className="project-card overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={project.splashImage}
            alt={`${project.title} preview`}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
            }}
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <img
              src={project.iconImage}
              alt={`${project.title} icon`}
              className="w-12 h-12 rounded-lg bg-background/80 p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNmM2Y0ZjYiIHJ4PSI0Ii8+PHBhdGggZD0ibTEyIDJsMyA3aDctM2wtNy0zek0yIDEybDMgN2g3LTNsLTctM3ptMTAgMGwzIDdoNy0zbC03LTN6IiBmaWxsPSIjOTlhM2FmIi8+PC9zdmc+';
              }}
            />
          </div>
        </div>
        
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.tagline}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Typography variant="small" className="mb-4 line-clamp-3">
            {project.description}
          </Typography>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
          
          {project.links.live && (
            <a href={project.links.live} className="inline-block">
              <Button>
                View Project
              </Button>
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProjectCard