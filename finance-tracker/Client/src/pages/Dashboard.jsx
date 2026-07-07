import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getDashboardSummary } from '../api/dashboard'

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2']

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardSummary().then((data) => {
      setSummary(data)
      setLoading(false)
    })
  }, [])

  if (loading || !summary) {
    return <div className="text-gray-400">Loading dashboard...</div>
  }

  const { totalSpent, budgetLimit, remaining, categoryBreakdown, recentTransactions } = summary

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-sm text-gray-500 mb-1">Total Spent This Month</div>
          <div className="text-2xl font-bold">RM {totalSpent.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-sm text-gray-500 mb-1">Active Monthly Budget Limit</div>
          <div className="text-2xl font-bold">RM {budgetLimit.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="text-sm text-gray-500 mb-1">Remaining Balance</div>
          <div className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            RM {remaining.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <div className="text-gray-400 text-sm">No expenses recorded this month.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={100} label>
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `RM ${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Description</th>
                <th className="py-2">Category</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{t.date}</td>
                  <td className="py-2">{t.description}</td>
                  <td className="py-2">{t.categoryName}</td>
                  <td className="py-2 text-right">RM {Number(t.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}