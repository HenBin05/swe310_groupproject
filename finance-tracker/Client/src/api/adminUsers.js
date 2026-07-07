let users = [
  { id: 1, username: 'demo_admin', role: 'Admin', dateJoined: '2026-01-15', isActive: true },
  { id: 2, username: 'alice', role: 'Standard', dateJoined: '2026-02-03', isActive: true },
  { id: 3, username: 'bob', role: 'Standard', dateJoined: '2026-03-21', isActive: true },
  { id: 4, username: 'carol', role: 'Standard', dateJoined: '2026-04-10', isActive: false },
  { id: 5, username: 'dave', role: 'Standard', dateJoined: '2026-05-28', isActive: true },
]

// TODO: swap body for `const res = await api.get('/admin/users'); return res.data`
export async function getUsers() {
  return new Promise((resolve) => setTimeout(() => resolve([...users]), 300))
}

// TODO: swap body for `const res = await api.put(\`/admin/users/${id}/role\`, { role }); return res.data`
export async function updateUserRole(id, role) {
  users = users.map((u) => (u.id === id ? { ...u, role } : u))
  return new Promise((resolve) => setTimeout(() => resolve({ id, role }), 300))
}

// TODO: swap body for `await api.put(\`/admin/users/${id}/status\`, { isActive: !current })` — or DELETE, per your backend teammate's choice
export async function toggleUserActive(id) {
  users = users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
  return new Promise((resolve) => setTimeout(resolve, 300))
}