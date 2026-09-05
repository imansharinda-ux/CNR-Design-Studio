import { useEffect, useRef, useState } from 'react'

export default function Photo({ src, alt, className = '', style }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth) setLoaded(true)
  }, [src])

  return (
    <div className={`ph ${className}`.trim()} style={style}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={loaded ? 'ok' : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  )
}
