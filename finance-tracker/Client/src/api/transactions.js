import { getCategories } from './categories'

let transactions = [
  { id: 1, amount: 45.5, date: '2026-07-01', description: 'Weekly groceries', categoryId: 1 },
  { id: 2, amount: 1200, date: '2026-07-01', description: 'Monthly rent', categoryId: 2 },
  { id: 3, amount: 18.9, date: '2026-07-03', description: 'Grab ride', categoryId: 3 },
  { id: 4, amount: 60, date: '2026-07-04', description: 'Movie night', categoryId: 4 },
  { id: 5, amount: 150, date: '2026-07-05', description: 'Electricity bill', categoryId: 5 },
  { id: 6, amount: 3000, date: '2026-07-01', description: 'Monthly salary', categoryId: 6 },
]
let nextId = 7

async function withCategoryName(list) {
  const categories = await getCategories()
  const byId = Object.fromEntries(categories.map((c) => [c.id, c]))
  return list.map((t) => ({
    ...t,
    categoryName: byId[t.categoryId]?.name || 'Uncategorized',
    categoryType: byId[t.categoryId]?.type || 'Expense',
    categoryNecessity: byId[t.categoryId]?.necessity || null,
  }))
}

// TODO: swap body for `const res = await api.get('/transactions'); return res.data`
export async function getTransactions() {
  const withNames = await withCategoryName(transactions)
  return new Promise((resolve) =>
    setTimeout(() => resolve([...withNames].sort((a, b) => new Date(b.date) - new Date(a.date))), 300)
  )
}

// TODO: swap body for `const res = await api.post('/transactions', dto); return res.data`
export async function createTransaction(dto) {
  const transaction = { id: nextId++, ...dto }
  transactions.push(transaction)
  return new Promise((resolve) => setTimeout(() => resolve(transaction), 300))
}

// TODO: swap body for `const res = await api.put(\`/transactions/${id}\`, dto); return res.data` — backend needs this PUT endpoint added
export async function updateTransaction(id, dto) {
  transactions = transactions.map((t) => (t.id === id ? { ...t, ...dto } : t))
  return new Promise((resolve) => setTimeout(() => resolve({ id, ...dto }), 300))
}

// TODO: swap body for `await api.delete(\`/transactions/${id}\`)`
export async function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id)
  return new Promise((resolve) => setTimeout(resolve, 300))
}