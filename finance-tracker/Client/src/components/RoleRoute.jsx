import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}