'use client'

import { useState, useEffect } from 'react'
import { GatewayConfig, VIPCustomer, VIP_CUSTOMERS } from '@/lib/gateway'

interface DashboardProps {
  gatewayConfig: GatewayConfig
}

export default function Dashboard({ gatewayConfig }: DashboardProps) {
  const [customers, setCustomers] = useState<VIPCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Static data from Google Sheet (VIP Ticket Tracker - updated 2026-02-12 9:50 PM)
  const loadSheetData = () => {
    setLoading(true)
    
    // REAL data from Zendesk (via org ID search - Feb 12, 2026 10:15 PM)
    const sheetData: VIPCustomer[] = [
      { name: 'Careco', tickets: 9, lastContact: '2/10' },
      { name: 'Screen-magic', tickets: 10, lastContact: '2/12' },
      { name: 'Simplii', tickets: 4, lastContact: '1/13' },
      { name: 'iFax', tickets: 1, lastContact: '1/28' },
      { name: 'Retellai', tickets: 1, lastContact: '1/22' },
      { name: '42chat', tickets: 0, lastContact: 'N/A' },
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
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Open Tickets" value={totalTickets} icon="🎫" color="blue" loading={loading} />
        <StatCard label="VIP Customers" value={customers.length} icon="👥" color="purple" loading={loading} />
        <StatCard label="With Open Tickets" value={customersWithTickets} icon="📋" color="yellow" loading={loading} />
      </div>

      {/* VIP Customer Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">VIP Customers</h2>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
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
            <ActivityItem icon="📧" text="Email from Ryan @ Automentor" time="2 hours ago" />
            <ActivityItem icon="🎫" text="New ticket from Chiirp" time="4 hours ago" />
            <ActivityItem icon="💬" text="Slack mention in #messaging-inquiries" time="5 hours ago" />
            <ActivityItem icon="📞" text="Call with Callloom completed" time="Yesterday" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Upcoming</h3>
          <div className="space-y-3">
            <CalendarItem title="Sync with RetellAi" time="Tomorrow, 10:00 AM" type="meeting" />
            <CalendarItem title="Chiirp QBR Prep" time="Friday, 2:00 PM" type="task" />
            <CalendarItem title="MMC Review - Automentor" time="Next Monday" type="deadline" />
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

function CustomerCard({ customer }: { customer: VIPCustomer }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white">{customer.name}</h3>
        {customer.tickets > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {customer.tickets} open
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>🎫 {customer.tickets} tickets</span>
        <span>📅 {customer.lastContact}</span>
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

function CalendarItem({ title, time, type }: { title: string; time: string; type: string }) {
  const typeIcons = { meeting: '📅', task: '✅', deadline: '⏰' }
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{typeIcons[type as keyof typeof typeIcons]}</span>
      <div className="flex-1">
        <p className="text-sm text-white">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}
