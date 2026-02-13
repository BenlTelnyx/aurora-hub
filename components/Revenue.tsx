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
  mrc: number | null           // Monthly recurring charges
  updated: string | null
}

// Initial customer data - populated from vip-revenue.json
const initialCustomers: CustomerRevenue[] = [
  { name: 'CareCo', user_id: '3307ca65-df56-4f15-8ba7-589d584d215b', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Callloom', user_id: null, mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Chiirp', user_id: null, mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'General Atomics', user_id: 'af78ea36-649b-4411-bd33-70326f452c8c', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'GetScaled', user_id: null, mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Grupo Bimbo (USA)', user_id: 'a2da2a31-3377-473b-8184-ed201e422c6d', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Grupo Bimbo (Canada)', user_id: '462a3df9-f7ec-4bcb-aa62-4f63e8529567', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'iFaxApp', user_id: 'a13411e0-1850-4778-8c09-2048d2945105', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'IVR Technologies', user_id: 'db941093-691f-4c8e-ac7a-a0f6a69555df', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Jobble', user_id: 'edc2b628-61e2-4b1d-81f8-687f60719fde', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Mango Voice', user_id: '36462c59-72e9-43f6-812c-89477b80b6b9', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Palate Connect', user_id: null, mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Redo', user_id: '7a0503f9-ead1-4d35-9795-c6359798e722', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'RetellAI', user_id: 'b2726e8d-d955-420a-bcf8-497231821daa', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: '42Chat', user_id: 'd0444236-00f6-4212-a01f-201f543b8eb1', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Screen Magic', user_id: '38285cf8-6803-4f7a-91be-ec50400b7277', mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
  { name: 'Simplii', user_id: null, mtd: null, lastMonth: null, lastYearMonth: null, momChange: null, yoyChange: null, mrc: null, updated: null },
]

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

export default function Revenue() {
  const [customers, setCustomers] = useState<CustomerRevenue[]>(initialCustomers)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'mtd' | 'mom' | 'yoy'>('mtd')
  const [sortDesc, setSortDesc] = useState(true)

  // Load revenue data from file
  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    try {
      // Fetch from static JSON file (updated daily by Aurora)
      const response = await fetch('/revenue-data.json')
      if (response.ok) {
        const data = await response.json()
        if (data.customers) {
          setCustomers(data.customers)
          setLastUpdated(data.updated)
        }
      }
    } catch (e) {
      // Data file doesn't exist yet, use initial data
      console.log('Revenue data not loaded yet')
    }
  }

  // Sort customers
  const sorted = [...customers].sort((a, b) => {
    let aVal: number | null = null
    let bVal: number | null = null
    
    switch (sortBy) {
      case 'name':
        return sortDesc 
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      case 'mtd':
        aVal = a.mtd
        bVal = b.mtd
        break
      case 'mom':
        aVal = a.momChange
        bVal = b.momChange
        break
      case 'yoy':
        aVal = a.yoyChange
        bVal = b.yoyChange
        break
    }
    
    // Handle nulls - put them at the bottom
    if (aVal === null && bVal === null) return 0
    if (aVal === null) return 1
    if (bVal === null) return -1
    
    return sortDesc ? bVal - aVal : aVal - bVal
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
  const totalLastMonth = customers.reduce((sum, c) => sum + (c.lastMonth || 0), 0)
  const totalMRC = customers.reduce((sum, c) => sum + (c.mrc || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">💰 Revenue</h1>
          <p className="text-gray-400 text-sm mt-1">
            VIP Customer Monthly Spend Tracking
            {lastUpdated && <span className="text-gray-500"> • Last updated: {lastUpdated}</span>}
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
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Total MTD</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalMTD)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Last Month Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalLastMonth)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-sm text-gray-400">Total MRC</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalMRC)}</p>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">MRC</th>
              <SortHeader column="mtd" label="MTD Spend" />
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Last Month</th>
              <SortHeader column="mom" label="MoM" />
              <SortHeader column="yoy" label="YoY" />
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sorted.map((customer, idx) => (
              <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{customer.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-300 font-mono text-sm">
                  {formatCurrency(customer.mrc)}
                </td>
                <td className="px-4 py-3 text-white font-mono">
                  {formatCurrency(customer.mtd)}
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-sm">
                  {formatCurrency(customer.lastMonth)}
                </td>
                <td className="px-4 py-3">
                  <ChangeIndicator value={customer.momChange} />
                </td>
                <td className="px-4 py-3">
                  <ChangeIndicator value={customer.yoyChange} />
                </td>
                <td className="px-4 py-3">
                  {customer.user_id ? (
                    <span className="text-green-500 text-sm">✓ Linked</span>
                  ) : (
                    <span className="text-yellow-500 text-sm">⚠️ No ID</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="text-sm text-gray-500 space-y-1">
        <p><strong>MTD:</strong> Month-to-date spend (current month so far)</p>
        <p><strong>MRC:</strong> Monthly Recurring Charges (phone numbers, SIMs, etc.)</p>
        <p><strong>MoM:</strong> Month-over-month change vs last month</p>
        <p><strong>YoY:</strong> Year-over-year change vs same month last year</p>
      </div>
    </div>
  )
}
