import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import { confirmToast } from '../../utils/confirmToast'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categories'

const emptyForm = { name: '', type: 'Expense', necessity: 'Optional' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setCategories(await getCategories())
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEditModal = (c) => {
    setEditingId(c.id)
    setForm({ name: c.name, type: c.type, necessity: c.necessity || 'Optional' })
    setFormError('')
    setModalOpen(true)
  }

  const handleTypeChange = (type) => {
    setForm((f) => ({ ...f, type, necessity: type === 'Income' ? null : f.necessity || 'Optional' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError('Category name is required.')
      return
    }

    const dto = {
      name: form.name.trim(),
      type: form.type,
      necessity: form.type === 'Income' ? null : form.necessity,
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateCategory(editingId, dto)
        toast.success('Category updated.')
      } else {
        await createCategory(dto)
        toast.success('Category added.')
      }
      setModalOpen(false)
      await loadData()
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (c) => {
    confirmToast(`Delete "${c.name}"? Existing transactions in this category will need to be reassigned.`, async () => {
      await deleteCategory(c.id)
      toast.success('Category deleted.')
      loadData()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Category Manager</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Necessity</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">
                    {c.necessity ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.necessity === 'Fixed' ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {c.necessity}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEditModal(c)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(c)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit Category' : 'Add New Category'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-100 text-red-700 text-sm p-2 rounded">{formError}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>

            {form.type === 'Expense' && (
              <div>
                <label className="block text-sm font-medium mb-1">Necessity</label>
                <select
                  value={form.necessity}
                  onChange={(e) => setForm({ ...form, necessity: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Fixed">Fixed (recurring, can't be reduced)</option>
                  <option value="Optional">Optional (discretionary)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Category'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}