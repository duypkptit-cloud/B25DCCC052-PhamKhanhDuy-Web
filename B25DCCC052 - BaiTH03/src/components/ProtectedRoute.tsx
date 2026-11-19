import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Lưu trang đang muốn vào để LoginPage đưa người dùng quay lại
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
