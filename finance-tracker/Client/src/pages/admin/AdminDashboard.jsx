import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getAdminDashboardSummary } from '../../api/adminDashboard'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboardSummary().then((data) => {
      setSummary(data)
      setLoading(false)
    })
  }, [])

  if (loading || !summary) {
    return <div className="text-gray-400">Loading admin dashboard...</div>
  }

  const { totalUsers, totalCategories, engagementToday, categoryUsage } = summary

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-sm text-gray-500 mb-1">Total Registered Users</div>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-sm text-gray-500 mb-1">Total System Categories</div>
          <div className="text-2xl font-bold">{totalCategories}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-sm text-gray-500 mb-1">Platform Engagement (Today)</div>
          <div className="text-2xl font-bold">{engagementToday}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Most Used Categories Platform-Wide</h2>
        {categoryUsage.length === 0 ? (
          <div className="text-gray-400 text-sm">No transaction data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}