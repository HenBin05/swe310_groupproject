import { getTransactions } from './transactions'

let profile = {
  displayName: 'Demo User',
  timezone: 'Asia/Kuala_Lumpur',
  currency: 'MYR',
  paymentMethod: "Touch 'n Go eWallet",
}

// TODO: swap for `const res = await api.get('/users/profile'); return res.data`
export async function getProfile() {
  return new Promise((resolve) => setTimeout(() => resolve({ ...profile }), 200))
}

// TODO: swap for `const res = await api.put('/users/profile', dto); return res.data`
export async function updateProfile(dto) {
  profile = { ...profile, ...dto }
  return new Promise((resolve) => setTimeout(() => resolve({ ...profile }), 300))
}

// TODO: swap for `await api.put('/users/change-password', dto)`
// Mock only accepts 'password123' as the current password, so you can test the error path too
export async function changePassword(dto) {
  if (dto.currentPassword !== 'password123') {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Current password is incorrect.')), 300)
    )
  }
  return new Promise((resolve) => setTimeout(resolve, 300))
}

// TODO: swap for `await api.post('/auth/logout-all')`
export async function logoutAllDevices() {
  return new Promise((resolve) => setTimeout(resolve, 300))
}

// TODO: swap for a real `GET /api/transactions/export` download endpoint
export async function exportTransactionsCsv() {
  const transactions = await getTransactions()
  const header = 'Date,Description,Category,Amount\n'
  const rows = transactions
    .map((t) => `${t.date},"${t.description.replace(/"/g, '""')}",${t.categoryName},${t.amount}`)
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'expenses.csv'
  link.click()
  URL.revokeObjectURL(url)
}