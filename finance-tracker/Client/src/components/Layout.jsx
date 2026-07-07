import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600">FinanceTracker</div>

        <nav className="flex-1 px-3 space-y-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
          <NavLink to="/ai-insights" className={linkClass}>AI Assistant</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>

          {user?.role === 'Admin' && (
            <>
              <div className="pt-4 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase">
                Admin
              </div>
              <NavLink to="/admin/dashboard" className={linkClass}>Admin Dashboard</NavLink>
              <NavLink to="/admin/users" className={linkClass}>User Management</NavLink>
              <NavLink to="/admin/categories" className={linkClass}>Categories</NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <div className="text-sm font-medium truncate">{user?.username}</div>
          <div className="text-xs text-gray-500 mb-3">{user?.role}</div>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-600 border border-red-200 rounded py-1.5 hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}