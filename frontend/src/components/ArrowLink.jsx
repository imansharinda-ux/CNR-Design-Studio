import { Link } from 'react-router-dom'

export function Arrow({ left = false, width = 14, height = 10 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path
        d={left ? 'M14 5H2M6 1L2 5l4 4' : 'M0 5h12M8 1l4 4-4 4'}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export default function ArrowLink({ to, children, className = '', style }) {
  return (
    <Link to={to} className={`arrow-link ${className}`.trim()} style={style}>
      {children} <Arrow />
    </Link>
  )
}
