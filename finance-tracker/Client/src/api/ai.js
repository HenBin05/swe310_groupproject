import { getTransactions } from './transactions'

// TODO: swap body for `const res = await api.post('/ai/insights'); return res.data.insights` once the Semantic Kernel endpoint exists
export async function getFinancialInsights() {
  const transactions = await getTransactions()
  const expenses = transactions.filter((t) => t.categoryType === 'Expense')

  const totalSpent = expenses.reduce((sum, t) => sum + Number(t.amount), 0)

  const fixedSpent = expenses
    .filter((t) => t.categoryNecessity === 'Fixed')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const optionalSpent = expenses
    .filter((t) => t.categoryNecessity === 'Optional')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const byOptionalCategory = {}
  expenses
    .filter((t) => t.categoryNecessity === 'Optional')
    .forEach((t) => {
      byOptionalCategory[t.categoryName] = (byOptionalCategory[t.categoryName] || 0) + Number(t.amount)
    })
  const topOptional = Object.entries(byOptionalCategory).sort((a, b) => b[1] - a[1])[0]

  const insights = `## Financial Summary

You spent a total of **RM ${totalSpent.toFixed(2)}** across ${expenses.length} transactions this period.

### Fixed vs Optional Spending
- **Fixed costs** (rent, utilities, and other recurring bills): RM ${fixedSpent.toFixed(2)} — these are locked in each month and can't realistically be reduced.
- **Optional spending** (everything discretionary): RM ${optionalSpent.toFixed(2)} — this is where you actually have room to cut back.

### Key Observations
- Your biggest optional expense is **${topOptional?.[0] ?? 'N/A'}** at RM ${topOptional?.[1]?.toFixed(2) ?? '0.00'}.
- Since fixed costs are unavoidable, focus any savings effort on discretionary categories like **${topOptional?.[0] ?? 'entertainment or dining'}**.

### Recommendation
> Cutting back 10% on your ${topOptional?.[0] ?? 'top optional category'} spending could save you roughly **RM ${((topOptional?.[1] ?? 0) * 0.1).toFixed(2)}** per month — without touching your fixed obligations.

*This is a placeholder response generated from mock data. Once the backend's Semantic Kernel + LLM endpoint is ready, this will call \`POST /api/ai/insights\` instead.*`

  return new Promise((resolve) => setTimeout(() => resolve(insights), 1500))
}