import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../lib/auth.js'

export default function RequireAdmin({ children }) {
  const location = useLocation()
  if (!getSession()) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}
