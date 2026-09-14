import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Photo from '../components/Photo.jsx'
import SplitText from '../components/SplitText.jsx'
import { Arrow } from '../components/ArrowLink.jsx'
import useReveal from '../hooks/useReveal.js'
import { lockScroll } from '../lib/scroll.js'
import { getProject, getProjects } from '../lib/api.js'
import { PROJECTS, img } from '../data/projects.js'
import '../styles/projects.css'

function splitIntoColumns(images) {
  const columns = [[], []]
  const heights = [0, 0]
  images.forEach((image) => {
    const c = heights[0] <= heights[1] ? 0 : 1
    columns[c].push(image)
    heights[c] += image.height / image.width
  })
  return columns
}

export default function Project() {
  const { slug } = useParams()
  const [result, setResult] = useState({ slug: null, project: null, failed: false })
  const [list, setList] = useState(PROJECTS)

  useEffect(() => {
    let alive = true
    getProject(slug)
      .then((data) => alive && setResult({ slug, project: data, failed: false }))
      .catch(() => alive && setResult({ slug, project: null, failed: true }))
    return () => {
      alive = false
    }
  }, [slug])

  useEffect(() => {
    let alive = true
    getProjects()
      .then((data) => {
        if (alive && data.length) setList(data)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const current = result.slug === slug ? result : null
  const project = current?.project
  const index = Math.max(0, list.findIndex((p) => p.slug === slug))
  const prev = list[(index - 1 + list.length) % list.length]
  const next = list[(index + 1) % list.length]

  if (current?.failed) {
    return (
      <section className="pad top-pad proj-msg">
        <p className="big">This project could not be loaded.</p>
        <Link to="/projects" className="ul">Back to all projects</Link>
      </section>
    )
  }

  if (!project) return <section className="pad top-pad proj-msg" aria-busy="true" />

  return (
    <>
      <ProjectBody key={project.slug} project={project} />
      <nav className="pn pad" aria-label="More projects">
        <Link to={`/projects/${prev.slug}`}>
          <Arrow left /> Previous Project
        </Link>
        <Link to={`/projects/${next.slug}`}>
          Next Project: {next.name} <Arrow />
        </Link>
      </nav>
    </>
  )
}

function ProjectBody({ project }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(-1)
  useReveal(ref)
  const columns = splitIntoColumns(project.images)
  const description =
    project.description ||
    `${project.name} was visualised in CNR Design Studio from early massing through to final materials, so the client could walk every room before construction began.`

  return (
    <section ref={ref} className="proj pad top-pad">
      <aside>
        <SplitText as="h1" text={project.name} />
        <dl className="fade">
          <dt>Type</dt>
          <dd>{project.type}</dd>
          <dt>Location</dt>
          <dd>{project.location}</dd>
          <dt>Status</dt>
          <dd>Completed</dd>
        </dl>
        <p className="fade">{description}</p>
      </aside>
      <div className="proj-g">
        {columns.map((column, c) => (
          <div key={c}>
            {column.map((image) => {
              const index = project.images.indexOf(image)
              return (
                <button
                  key={image.fileName}
                  type="button"
                  className="pg-item"
                  onClick={() => setOpen(index)}
                  aria-label={`Open photo ${index + 1} of ${project.images.length}`}
                >
                  <Photo
                    src={img(image.fileName)}
                    alt={`${project.name} photo`}
                    style={{ aspectRatio: `${image.width} / ${image.height}` }}
                  />
                </button>
              )
            })}
          </div>
        ))}
      </div>
      {open >= 0 && <Lightbox project={project} index={open} onChange={setOpen} onClose={() => setOpen(-1)} />}
    </section>
  )
}

function Lightbox({ project, index, onChange, onClose }) {
  const total = project.images.length
  const image = project.images[index]
  const closeRef = useRef(null)

  const go = useCallback((step) => onChange((index + step + total) % total), [index, total, onChange])

  useEffect(() => {
    lockScroll(true)
    closeRef.current?.focus({ preventScroll: true })
    return () => lockScroll(false)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${project.name} photos`} onClick={onClose}>
      <div className="lb-top" onClick={(e) => e.stopPropagation()}>
        <span>
          {project.name} · {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button ref={closeRef} type="button" className="lb-close" onClick={onClose}>
          Close
        </button>
      </div>
      <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
        <img key={image.fileName} src={img(image.fileName)} alt={`${project.name} photo ${index + 1}`} />
      </figure>
      <button type="button" className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous photo">
        <Arrow left width={20} height={14} />
      </button>
      <button type="button" className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next photo">
        <Arrow width={20} height={14} />
      </button>
    </div>
  )
}
