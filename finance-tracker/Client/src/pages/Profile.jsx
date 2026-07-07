import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { confirmToast } from '../utils/confirmToast'
import {
  getProfile,
  updateProfile,
  changePassword,
  logoutAllDevices,
  exportTransactionsCsv,
} from '../api/profile'

const TIMEZONES = ['Asia/Kuala_Lumpur', 'Asia/Singapore', 'UTC']
const CURRENCIES = ['MYR', 'USD', 'SGD']
const PAYMENT_METHODS = ["Touch 'n Go eWallet", 'GrabPay', 'ShopeePay', 'Cash', 'Credit/Debit Card']

export default function Profile() {
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameSaving, setNameSaving] = useState(false)

  const [prefsForm, setPrefsForm] = useState(null)
  const [prefsSaving, setPrefsSaving] = useState(false)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data)
      setNameInput(data.displayName)
      setPrefsForm({ timezone: data.timezone, currency: data.currency, paymentMethod: data.paymentMethod })
      setLoading(false)
    })
  }, [])

  const handleSaveName = async () => {
    setNameSaving(true)
    try {
      const updated = await updateProfile({ displayName: nameInput.trim() })
      setProfile(updated)
      setEditingName(false)
      toast.success('Profile updated.')
    } catch {
      toast.error('Could not update profile.')
    } finally {
      setNameSaving(false)
    }
  }

  const handleSavePrefs = async (e) => {
    e.preventDefault()
    setPrefsSaving(true)
    try {
      const updated = await updateProfile(prefsForm)
      setProfile(updated)
      toast.success('Preferences saved.')
    } catch {
      toast.error('Could not save preferences.')
    } finally {
      setPrefsSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')

    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New password and confirmation do not match.')
      return
    }

    setPwSaving(true)
    try {
      await changePassword(pwForm)
      toast.success('Password changed.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message || 'Could not change password.')
    } finally {
      setPwSaving(false)
    }
  }

  const handleLogoutAllDevices = () => {
    confirmToast('Log out of all devices? You will need to log in again here too.', async () => {
      await logoutAllDevices()
      toast.success('Logged out of all devices.')
      logout()
    })
  }

  if (loading || !profile) {
    return <div className="text-gray-400">Loading profile...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>

        <div className="grid grid-cols-3 gap-4 items-center mb-3">
          <span className="text-sm text-gray-500">Name</span>
          {editingName ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="col-span-2 border rounded px-3 py-1.5"
            />
          ) : (
            <span className="col-span-2">{profile.displayName}</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 items-center mb-3">
          <span className="text-sm text-gray-500">Username</span>
          <span className="col-span-2">{user?.username}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center mb-4">
          <span className="text-sm text-gray-500">Role</span>
          <span className="col-span-2">{user?.role}</span>
        </div>

        {editingName ? (
          <div className="flex gap-2">
            <button
              onClick={handleSaveName}
              disabled={nameSaving}
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {nameSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setEditingName(false); setNameInput(profile.displayName) }}
              className="px-4 py-1.5 rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} className="text-sm text-blue-600 hover:underline">
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">App Preferences</h2>
        <form onSubmit={handleSavePrefs} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select
              value={prefsForm.timezone}
              onChange={(e) => setPrefsForm({ ...prefsForm, timezone: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Default Currency</label>
            <select
              value={prefsForm.currency}
              onChange={(e) => setPrefsForm({ ...prefsForm, currency: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Default Payment Method</label>
            <select
              value={prefsForm.paymentMethod}
              onChange={(e) => setPrefsForm({ ...prefsForm, paymentMethod: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={prefsSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {prefsSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Security &amp; Authentication</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {pwError && <div className="bg-red-100 text-red-700 text-sm p-2 rounded">{pwError}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {pwSaving ? 'Changing...' : 'Change Password'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <div className="text-sm font-medium mb-2">Active Sessions</div>
          <button
            onClick={handleLogoutAllDevices}
            className="text-sm text-red-600 border border-red-200 rounded px-4 py-1.5 hover:bg-red-50"
          >
            Log out of all devices
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <button onClick={() => exportTransactionsCsv()} className="text-sm border rounded px-4 py-1.5 hover:bg-gray-50">
          Export My Expenses (CSV)
        </button>
      </div>
    </div>
  )
}