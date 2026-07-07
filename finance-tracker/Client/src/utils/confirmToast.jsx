import toast from 'react-hot-toast'

export function confirmToast(message, onConfirm) {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm">{message}</span>
      <div className="flex gap-2 justify-end">
        <button
          className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          onClick={() => {
            toast.dismiss(t.id)
            onConfirm()
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  ), { duration: 8000 })
}