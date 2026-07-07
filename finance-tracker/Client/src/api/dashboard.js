import { getTransactions } from './transactions'

const MONTHLY_BUDGET = 2000 // TODO: backend needs a real budget-limit field/endpoint (see admin/user docs)

// TODO: swap body for `const res = await api.get('/dashboard/summary'); return res.data` once the backend endpoint exists
export async function getDashboardSummary() {
  const transactions = await getTransactions()

  const now = new Date()
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const expensesThisMonth = thisMonth.filter((t) => t.categoryType === 'Expense')
  const totalSpent = expensesThisMonth.reduce((sum, t) => sum + Number(t.amount), 0)

  const byCategory = {}
  expensesThisMonth.forEach((t) => {
    byCategory[t.categoryName] = (byCategory[t.categoryName] || 0) + Number(t.amount)
  })

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          totalSpent,
          budgetLimit: MONTHLY_BUDGET,
          remaining: MONTHLY_BUDGET - totalSpent,
          categoryBreakdown: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
          recentTransactions: transactions.slice(0, 5),
        }),
      300
    )
  )
}