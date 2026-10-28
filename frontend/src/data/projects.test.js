import { describe, expect, it } from 'vitest'
import { FEATURED, PROJECTS, img } from './projects.js'

describe('img', () => {
  it('turns a file name into an images path', () => {
    expect(img('sv10')).toBe('/images/sv10.jpg')
  })

  it('keeps uploaded photo paths as they are', () => {
    expect(img('/uploads/projects/abc.jpg')).toBe('/uploads/projects/abc.jpg')
  })
})

describe('project list', () => {
  it('has unique slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('features the first six projects', () => {
    expect(FEATURED).toHaveLength(6)
    expect(FEATURED[0].slug).toBe(PROJECTS[0].slug)
  })
})
