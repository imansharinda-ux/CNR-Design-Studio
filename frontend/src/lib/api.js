import { getSession, clearSession } from './auth.js'

async function request(path, options) {
  const res = await fetch(`/api${path}`, options)
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(data?.message || `Request failed: ${res.status}`)
    error.status = res.status
    error.fields = data?.errors || {}
    throw error
  }
  return data
}

const postJson = (path, body) =>
  request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export const getProjects = () => request('/projects')
export const getFeaturedProjects = () => request('/projects?featured=true')
export const getProject = (slug) => request(`/projects/${slug}`)
export const sendEnquiry = (enquiry) => postJson('/enquiries', enquiry)
export const getBlockedDates = () => request('/appointments/blocked')
export const getFreeSlots = (date) => request(`/appointments/slots?date=${date}`)
export const bookAppointment = (appointment) => postJson('/appointments', appointment)
export const cancelMyAppointment = (reference, email) => postJson('/appointments/cancel', { reference, email })
export const getAppointmentStatus = (ref, email) =>
  request(`/appointments/status?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(email)}`)

export const adminLogin = (email, password) => postJson('/auth/login', { email, password })

function adminFetch(path, method = 'GET', body) {
  const session = getSession()
  const headers = { Authorization: `Bearer ${session?.token || ''}` }
  const isForm = body instanceof FormData
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
  const payload = body === undefined ? undefined : isForm ? body : JSON.stringify(body)
  return request(path, { method, headers, body: payload }).catch((err) => {
    if (err.status === 401) clearSession()
    throw err
  })
}

export const adminLogout = () => adminFetch('/auth/logout', 'POST').catch(() => null)
export const getSummary = () => adminFetch('/admin/summary')
export const getEnquiries = () => adminFetch('/admin/enquiries')
export const setEnquiryStatus = (id, status) => adminFetch(`/admin/enquiries/${id}`, 'PATCH', { status })
export const getAppointments = (past = false) => adminFetch(`/admin/appointments?past=${past}`)
export const setAppointmentStatus = (id, status) => adminFetch(`/admin/appointments/${id}`, 'PATCH', { status })
export const cancelAppointment = (id) => adminFetch(`/admin/appointments/${id}`, 'DELETE')
export const getAdminProjects = () => adminFetch('/admin/projects')
export const createProject = (project) => adminFetch('/admin/projects', 'POST', project)
export const updateProject = (id, project) => adminFetch(`/admin/projects/${id}`, 'PUT', project)
export const getProjectImages = (id) => adminFetch(`/admin/projects/${id}/images`)
export const deleteProjectImage = (id, imageId) => adminFetch(`/admin/projects/${id}/images/${imageId}`, 'DELETE')
export const setProjectCover = (id, fileName) => adminFetch(`/admin/projects/${id}/cover`, 'PUT', { fileName })

export function uploadProjectImages(id, files) {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  return adminFetch(`/admin/projects/${id}/images`, 'POST', form)
}
export const rescheduleAppointment = (id, date, time) => adminFetch(`/admin/appointments/${id}/reschedule`, 'PUT', { date, time })
export const getBlockedDays = () => adminFetch('/admin/blocked-days')
export const addBlockedDay = (date, reason) => adminFetch('/admin/blocked-days', 'POST', { date, reason })
export const removeBlockedDay = (id) => adminFetch(`/admin/blocked-days/${id}`, 'DELETE')
export const reorderProjectImages = (id, ids) => adminFetch(`/admin/projects/${id}/images/order`, 'PUT', { ids })
export const deleteProject = (id) => adminFetch(`/admin/projects/${id}`, 'DELETE')
