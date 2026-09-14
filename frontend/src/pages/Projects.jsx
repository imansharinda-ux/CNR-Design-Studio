import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Photo from '../components/Photo.jsx'
import useReveal from '../hooks/useReveal.js'
import { getProjects } from '../lib/api.js'
import { PROJECTS, img } from '../data/projects.js'
import '../styles/projects.css'

const pad2 = (n) => String(n).padStart(2, '0')

export default function Projects() {
  const ref = useRef(null)
  const [projects, setProjects] = useState(PROJECTS)
  useReveal(ref)

  useEffect(() => {
    let alive = true
    getProjects()
      .then((data) => {
        if (alive && data.length) setProjects(data)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <section ref={ref} className="pad top-pad">
      <ul className="pgrid">
        {projects.map((p, i) => (
          <li key={p.slug} className="fade" style={{ '--d': `${(i % 4) * 90}ms` }}>
            <Link to={`/projects/${p.slug}`}>
              <Photo src={img(p.coverImage)} alt={`${p.name} concept render`} />
              <span className="cap">
                <span>{pad2(i + 1)}</span>
                <span>{p.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
