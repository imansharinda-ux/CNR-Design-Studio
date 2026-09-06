export const img = (name) => (name.startsWith('/') ? name : `/images/${name}.jpg`)

export const PROJECTS = [
  { slug: 'shadow-villa', name: 'Shadow Villa', type: 'Renovation', location: 'Ahangama, Galle', coverImage: 'sv10' },
  { slug: 'the-breeze-house', name: 'The Breeze House', type: 'New Build', location: 'Negombo, Sri Lanka', coverImage: 'bh07p' },
  { slug: 'driftwood-villa', name: 'Driftwood Villa', type: 'New Build', location: 'Matara, Sri Lanka', coverImage: 'dw16' },
  { slug: 'villa-unawatuna', name: 'Villa Unawatuna', type: 'Concept', location: 'Galle, Sri Lanka', coverImage: 'vu13' },
  { slug: 'galle-loft', name: 'Galle Loft', type: 'Interior', location: 'Galle Fort, Sri Lanka', coverImage: 'gl15' },
  { slug: 'kandy-hillside', name: 'Kandy Hillside', type: 'New Build', location: 'Kandy, Sri Lanka', coverImage: 'kh19' },
  { slug: 'mirissa-bay-house', name: 'Mirissa Bay House', type: 'New Build', location: 'Mirissa, Sri Lanka', coverImage: 'pr7' },
  { slug: 'the-last-resort', name: 'The Last Resort', type: 'Renovation', location: 'Nuwara Eliya, Sri Lanka', coverImage: 'pr8' },
  { slug: 'sunset-heaven', name: 'Sunset Heaven', type: 'Interior', location: 'Colombo 05, Sri Lanka', coverImage: 'pr9' },
  { slug: 'dusk-villa', name: 'Dusk Villa', type: 'Concept', location: 'Bentota, Sri Lanka', coverImage: 'pr10' },
  { slug: 'villa-rosa', name: 'Villa Rosa', type: 'Concept', location: 'Kurunegala, Sri Lanka', coverImage: 'pr11' },
  { slug: 'the-moon-house', name: 'The Moon House', type: 'Interior', location: 'Colombo 03, Sri Lanka', coverImage: 'pr12' },
]

export const FEATURED = PROJECTS.slice(0, 6)