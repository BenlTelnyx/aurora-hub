'use client'

import { useState, useEffect } from 'react'

interface CustomerRevenue {
  name: string
  user_id: string | null
  mtd: number | null           // Month to date spend
  lastMonth: number | null     // Last month total
  lastYearMonth: number | null // Same month last year
  momChange: number | null     // Month over month % change
  yoyChange: number | null     // Year over year % change
  mrc: number | null           // Monthly Recurring Charges
  mmc: number | null           // Monthly Metered Charges (usage)
  commitment: number | null    // Monthly commitment amount
  commitPct: number | null     // % of commitment reached
  updated: string | null
}

// Initial customer data - populated from revenue-data.json
const initialCustomers: CustomerRevenue[] = []

function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatPercent(value: number | null): string {
  if (value === null) return '—'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

function ChangeIndicator({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-500">—</span>
  
  const isPositive = value >= 0
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400'
  const bgClass = isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
  
  return (
    <span className={`${colorClass} ${bgClass} px-2 py-0.5 rounded text-sm font-medium`}>
      {formatPercent(value)}
    </span>
  )
}

function CommitmentIndicator({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-gray-500">—</span>
  
  let colorClass = 'text-red-400'
  let bgClass = 'bg-red-500/10'
  
  if (pct >= 100) {
    colorClass = 'text-green-400'
    bgClass = 'bg-green-500/10'
  } else if (pct >= 75) {
    colorClass = 'text-yellow-400'
    bgClass = 'bg-yellow-500/10'
  } else if (pct >= 50) {
    colorClass = 'text-orange-400'
    bgClass = 'bg-orange-500/10'
  }
  
  return (
    <span className={`${colorClass} ${bgClass} px-2 py-0.5 rounded text-sm font-medium`}>
      {pct.toFixed(0)}%
    </span>
  )
}

export default function Revenue() {
  const [customers, setCustomers] = useState<CustomerRevenue[]>(initialCustomers)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'mtd' | 'mrc' | 'mmc' | 'commitPct' | 'mom'>('mtd')
  const [sortDesc, setSortDesc] = useState(true)

  // Load revenue data from file
  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/revenue-data.json')
      if (response.ok) {
        const data = await response.json()
        if (data.customers) {
          // Calculate commitPct for each customer if they have commitment
          const customersWithPct = data.customers.map((c: CustomerRevenue) => ({
            ...c,
            commitPct: c.commitment && c.mmc ? Math.round((c.mmc / c.commitment) * 100) : c.commitPct
          }))
          setCustomers(customersWithPct)
          setLastUpdated(data.updated)
        }
      }
    } catch (e) {
      console.log('Revenue data not loaded yet')
    } finally {
      setLoading(false)
    }
  }

  // Sort customers
  const sorted = [...customers].sort((a, b) => {
    let aVal: number | string | null = null
    let bVal: number | string | null = null
    
    switch (sortBy) {
      case 'name':
        return sortDesc 
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      case 'mtd':
        aVal = a.mtd
        bVal = b.mtd
        break
      case 'mrc':
        aVal = a.mrc
        bVal = b.mrc
        break
      case 'mmc':
        aVal = a.mmc
        bVal = b.mmc
        break
      case 'commitPct':
        aVal = a.commitPct
        bVal = b.commitPct
        break
      case 'mom':
        aVal = a.momChange
        bVal = b.momChange
        break
    }
    
    if (aVal === null && bVal === null) return 0
    if (aVal === null) return 1
    if (bVal === null) return -1
    
    return sortDesc ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number)
  })

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc)
    } else {
      setSortBy(column)
      setSortDesc(true)
    }
  }

  const SortHeader = ({ column, label }: { column: typeof sortBy, label: string }) => (
    <th 
      onClick={() => handleSort(column)}
      className="px-4 py-3 text-left text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
    >
      {label} {sortBy === column && (sortDesc ? '↓' : '↑')}
    </th>
  )

  // Calculate totals
  const totalMTD = customers.reduce((sum, c) => sum + (c.mtd || 0), 0)
  const totalMRC = customers.reduce((sum, c) => sum + (c.mrc || 0), 0)
  const totalMMC = customers.reduce((sum, c) => sum + (c.mmc || 0), 0)
  const totalCommitment = customers.reduce((sum, c) => sum + (c.commitment || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">💰 Revenue</h1>
          <p className="text-gray-400 text-sm mt-1">
            VIP Customer Monthly Spend & Commitment Tracking
            {lastUpdated && <span className="text-gray-500"> • Updated: {new Date(lastUpdated).toLocaleString()}</span>}
          </p>
        </div>
        <button 
          onClick={loadRevenueData}
          disabled={loading}
          className="px-4 py-2 bg-aurora-600 hover:bg-aurora-500 disabled:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Total MTD</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalMTD)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Total MRC</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalMRC)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Total MMC</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalMMC)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Total Commitment</p>
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalCommitment || null)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Customers Tracked</p>
          <p className="text-2xl font-bold text-white">{customers.filter(c => c.user_id).length} / {customers.length}</p>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <SortHeader column="name" label="Customer" />
              <SortHeader column="mrc" label="MRC" />
              <SortHeader column="mmc" label="MMC" />
              <SortHeader column="mtd" label="Total MTD" />
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Commitment</th>
              <SortHeader column="commitPct" label="% to Commit" />
              <SortHeader column="mom" label="MoM" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sorted.map((customer, idx) => (
              <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{customer.name}</span>
                  {!customer.user_id && <span className="ml-2 text-yellow-500 text-xs">⚠️</span>}
                </td>
                <td className="px-4 py-3 text-blue-400 font-mono text-sm">
                  {formatCurrency(customer.mrc)}
                </td>
                <td className="px-4 py-3 text-green-400 font-mono text-sm">
                  {formatCurrency(customer.mmc)}
                </td>
                <td className="px-4 py-3 text-white font-mono font-medium">
                  {formatCurrency(customer.mtd)}
                </td>
                <td className="px-4 py-3 text-purple-400 font-mono text-sm">
                  {formatCurrency(customer.commitment)}
                </td>
                <td className="px-4 py-3">
                  <CommitmentIndicator pct={customer.commitPct} />
                </td>
                <td className="px-4 py-3">
                  <ChangeIndicator value={customer.momChange} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="text-sm text-gray-500 space-y-1 bg-gray-900/50 rounded-lg p-4">
        <p className="font-medium text-gray-400 mb-2">📖 Legend</p>
        <div className="grid grid-cols-2 gap-2">
          <p><span className="text-blue-400">MRC:</span> Monthly Recurring Charges (phone numbers, SIMs, etc.)</p>
          <p><span className="text-green-400">MMC:</span> Monthly Metered Charges (usage - calls, SMS, etc.)</p>
          <p><span className="text-purple-400">Commitment:</span> Monthly minimum spend commitment</p>
          <p><span className="text-white">% to Commit:</span> How close to hitting commitment (MMC / Commitment)</p>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-800">
          <p><strong>% Indicators:</strong> 🟢 ≥100% | 🟡 ≥75% | 🟠 ≥50% | 🔴 &lt;50%</p>
        </div>
      </div>
    </div>
  )
}
