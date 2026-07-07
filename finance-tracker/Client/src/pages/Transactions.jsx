import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import { confirmToast } from '../utils/confirmToast'
import { getCategories } from '../api/categories'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../api/transactions'

const emptyForm = { amount: '', date: '', description: '', categoryId: '' }

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const [txns, cats] = await Promise.all([getTransactions(), getCategories()])
    setTransactions(txns)
    setCategories(cats)
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

  const openEditModal = (t) => {
    setEditingId(t.id)
    setForm({ amount: t.amount, date: t.date, description: t.description, categoryId: t.categoryId })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!form.amount || Number(form.amount) <= 0) {
      setFormError('Amount must be greater than 0.')
      return
    }
    if (!form.date) {
      setFormError('Date is required.')
      return
    }
    if (!form.categoryId) {
      setFormError('Please select a category.')
      return
    }

    const dto = {
      amount: Number(form.amount),
      date: form.date,
      description: form.description.trim(),
      categoryId: Number(form.categoryId),
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateTransaction(editingId, dto)
        toast.success('Transaction updated.')
      } else {
        await createTransaction(dto)
        toast.success('Transaction added.')
      }
      setModalOpen(false)
      await loadData()
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (t) => {
    confirmToast(`Delete "${t.description}"?`, async () => {
      await deleteTransaction(t.id)
      toast.success('Transaction deleted.')
      loadData()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Expense
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No transactions yet.</td></tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">{t.description}</td>
                  <td className="px-4 py-3">
                    {t.categoryName}
                    {t.categoryNecessity && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        t.categoryNecessity === 'Fixed' ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.categoryNecessity}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">RM {Number(t.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEditModal(t)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(t)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit Transaction' : 'Add Expense'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-100 text-red-700 text-sm p-2 rounded">{formError}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Amount (RM)</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Expense'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}