import { getUsers } from './adminUsers'
import { getCategories } from './categories'
import { getTransactions } from './transactions'

// TODO: swap body for `const res = await api.get('/admin/dashboard/summary'); return res.data`
export async function getAdminDashboardSummary() {
  const [users, categories, transactions] = await Promise.all([
    getUsers(),
    getCategories(),
    getTransactions(),
  ])

  const today = new Date().toISOString().slice(0, 10)
  const engagementToday = transactions.filter((t) => t.date === today).length

  const usageByCategory = {}
  transactions.forEach((t) => {
    usageByCategory[t.categoryName] = (usageByCategory[t.categoryName] || 0) + 1
  })

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          totalUsers: users.length,
          totalCategories: categories.length,
          engagementToday,
          categoryUsage: Object.entries(usageByCategory).map(([name, count]) => ({ name, count })),
        }),
      300
    )
  )
}