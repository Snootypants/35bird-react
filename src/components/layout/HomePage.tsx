import Hero from '../sections/Hero'
import ProjectGrid from '../sections/ProjectGrid'

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Projects Section */}
      <section className="section projects-section" id="projects">
        <div className="container">
          <ProjectGrid />
        </div>
      </section>
    </>
  )
}

export default HomePage