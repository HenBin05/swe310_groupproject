let categories = [
  { id: 1, name: 'Groceries', type: 'Expense', necessity: 'Optional' },
  { id: 2, name: 'Rent', type: 'Expense', necessity: 'Fixed' },
  { id: 3, name: 'Transport', type: 'Expense', necessity: 'Optional' },
  { id: 4, name: 'Entertainment', type: 'Expense', necessity: 'Optional' },
  { id: 5, name: 'Utilities', type: 'Expense', necessity: 'Fixed' },
  { id: 6, name: 'Salary', type: 'Income', necessity: null },
]
let nextId = 7

// TODO: swap body for `const res = await api.get('/categories'); return res.data` once the backend endpoint exists
export async function getCategories() {
  return new Promise((resolve) => setTimeout(() => resolve(categories), 200))
}

// TODO: swap body for `const res = await api.post('/admin/categories', dto); return res.data`
export async function createCategory(dto) {
  const category = { id: nextId++, ...dto }
  categories.push(category)
  return new Promise((resolve) => setTimeout(() => resolve(category), 300))
}

// TODO: swap body for `const res = await api.put(\`/admin/categories/${id}\`, dto); return res.data`
export async function updateCategory(id, dto) {
  categories = categories.map((c) => (c.id === id ? { ...c, ...dto } : c))
  return new Promise((resolve) => setTimeout(() => resolve({ id, ...dto }), 300))
}

// TODO: swap body for `await api.delete(\`/admin/categories/${id}\`)` — backend should soft-delete or reassign if transactions reference this category
export async function deleteCategory(id) {
  categories = categories.filter((c) => c.id !== id)
  return new Promise((resolve) => setTimeout(resolve, 300))
}