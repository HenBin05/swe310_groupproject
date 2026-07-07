import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import { confirmToast } from '../../utils/confirmToast'
import { getUsers, updateUserRole, toggleUserActive } from '../../api/adminUsers'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleModalUser, setRoleModalUser] = useState(null)
  const [roleValue, setRoleValue] = useState('Standard')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setUsers(await getUsers())
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))

  const openRoleModal = (u) => {
    setRoleModalUser(u)
    setRoleValue(u.role)
  }

  const handleSaveRole = async () => {
    setSaving(true)
    try {
      await updateUserRole(roleModalUser.id, roleValue)
      toast.success(`${roleModalUser.username}'s role updated to ${roleValue}.`)
      setRoleModalUser(null)
      await loadData()
    } catch {
      toast.error('Could not update role.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = (u) => {
    const action = u.isActive ? 'suspend' : 'reactivate'
    confirmToast(`Are you sure you want to ${action} "${u.username}"?`, async () => {
      await toggleUserActive(u.id)
      toast.success(`User ${action}d.`)
      loadData()
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border rounded px-3 py-2 mb-4"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Date Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No users found.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3 text-gray-400">#{u.id}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.dateJoined}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openRoleModal(u)} className="text-blue-600 hover:underline">Edit Role</button>
                    <button onClick={() => handleToggleActive(u)} className="text-red-600 hover:underline">
                      {u.isActive ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {roleModalUser && (
        <Modal title={`Edit Role — ${roleModalUser.username}`} onClose={() => setRoleModalUser(null)}>
          <div className="space-y-4">
            <select
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Standard">Standard</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              onClick={handleSaveRole}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}