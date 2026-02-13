'use client'

import { useState, useEffect } from 'react'
import { GatewayConfig, Customer, TRACKED_CUSTOMERS } from '@/lib/gateway'

interface DashboardProps {
  gatewayConfig: GatewayConfig
}

export default function Dashboard({ gatewayConfig }: DashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Static data from Google Sheet (Ticket Tracker - updated 2026-02-12)
  const loadSheetData = () => {
    setLoading(true)
    
    // REAL data from customers.json and Google Sheet (Feb 12, 2026)
    const sheetData: Customer[] = [
      { name: 'Screen Magic', tickets: 5, lastContact: '2/9' },
      { name: 'Mango Voice', tickets: 5, lastContact: '1/16' },
      { name: 'Redo', tickets: 5, lastContact: '2/7' },
      { name: 'Simplii', tickets: 5, lastContact: '1/18' },
      { name: 'Callloom', tickets: 3, lastContact: '2/10' },
      { name: 'RetellAI', tickets: 3, lastContact: '2/2' },
      { name: '42Chat', tickets: 2, lastContact: '12/18' },
      { name: 'iFaxApp', tickets: 1, lastContact: '1/28' },
      { name: 'Chiirp', tickets: 1, lastContact: '3/24/25' },
      { name: 'CareCo', tickets: 0, lastContact: 'N/A' },
      { name: 'General Atomics', tickets: 0, lastContact: 'N/A' },
      { name: 'GetScaled', tickets: 0, lastContact: 'N/A' },
      { name: 'Grupo Bimbo', tickets: 0, lastContact: 'N/A' },
      { name: 'IVR Technologies', tickets: 0, lastContact: 'N/A' },
      { name: 'Jobble', tickets: 0, lastContact: 'N/A' },
      { name: 'Palate Connect', tickets: 0, lastContact: 'N/A' },
    ]
    
    setCustomers(sheetData)
    setLastUpdated(new Date())
    setLoading(false)
  }

  const fetchTickets = loadSheetData

  useEffect(() => {
    fetchTickets()
  }, [gatewayConfig.url])

  const totalTickets = customers.reduce((sum, c) => sum + c.tickets, 0)
  const customersWithTickets = customers.filter(c => c.tickets > 0).length
  const atRiskCount = customers.filter(c => c.tickets >= 4).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Good evening, Ben 👋</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={totalTickets} icon="🎫" color="blue" loading={loading} />
        <StatCard label="Total Customers" value={customers.length} icon="👥" color="purple" loading={loading} />
        <StatCard label="With Open Tickets" value={customersWithTickets} icon="📋" color="yellow" loading={loading} />
        <StatCard label="At Risk" value={atRiskCount} icon="⚠️" color="red" loading={loading} />
      </div>

      {/* Customer Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Customers</h2>
        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {customers.map((customer) => (
              <CustomerCard key={customer.name} customer={customer} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem icon="🎫" text="Redo: URGENT TF blocked" time="2/7" />
            <ActivityItem icon="🎫" text="Callloom: Dead-air issue" time="2/10" />
            <ActivityItem icon="🎫" text="Screen Magic: Text enablement" time="2/9" />
            <ActivityItem icon="🎫" text="RetellAI: Support request" time="2/2" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Needs Attention</h3>
          <div className="space-y-3">
            {customers.filter(c => c.tickets >= 4).map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm text-white">{c.name}</p>
                  <p className="text-xs text-red-400">{c.tickets} open tickets</p>
                </div>
              </div>
            ))}
            {customers.filter(c => c.tickets >= 4).length === 0 && (
              <p className="text-sm text-gray-500">No customers at risk 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, loading }: { label: string; value: number; icon: string; color: string; loading?: boolean }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    red: 'bg-red-500/10 border-red-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
  }
  
  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold text-white ${loading ? 'animate-pulse' : ''}`}>
          {loading ? '—' : value}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </div>
  )
}

function CustomerCard({ customer }: { customer: Customer }) {
  const healthColor = customer.tickets >= 4 ? 'border-red-500/30' : 
                      customer.tickets >= 2 ? 'border-yellow-500/30' : 
                      'border-gray-800'
  
  return (
    <div className={`bg-gray-900 rounded-xl border ${healthColor} p-4 hover:border-gray-700 transition-colors cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-sm">{customer.name}</h3>
        {customer.tickets > 0 && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            customer.tickets >= 4 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            customer.tickets >= 2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {customer.tickets}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500">
        {customer.tickets > 0 ? `Last: ${customer.lastContact}` : '✓ No tickets'}
      </div>
    </div>
  )
}

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}
