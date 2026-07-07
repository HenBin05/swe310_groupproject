import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getFinancialInsights } from '../api/ai'

const mdComponents = {
  h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1">{children}</h3>,
  p: ({ children }) => <p className="text-sm text-gray-700 mb-2">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ul>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-sm text-gray-600 my-3">
      {children}
    </blockquote>
  ),
  em: ({ children }) => <em className="text-xs text-gray-400">{children}</em>,
}

export default function AiInsights() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getFinancialInsights()
      setInsights(result)
    } catch {
      setError('Could not generate insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-600 mb-4">
          Get a personalized summary of your spending, powered by AI.
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Generating...' : 'Generate Financial Insights'}
        </button>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      {insights && (
        <div className="bg-white rounded-lg shadow p-6">
          <ReactMarkdown components={mdComponents}>{insights}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}