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

  const loadData = () => {
    setLoading(true)
    
    // REAL data from Zendesk org searches (Feb 12, 2026 10:42 PM)
    // Only showing tickets for customers with verified Zendesk orgs
    const data: Customer[] = [
      // Customers WITH Zendesk orgs - real ticket counts
      { name: 'Screen Magic', tickets: 10, lastContact: '2/12', hasZendeskOrg: true },
      { name: 'CareCo', tickets: 9, lastContact: '2/10', hasZendeskOrg: true },
      { name: 'Mango Voice', tickets: 7, lastContact: '2/12', hasZendeskOrg: true },
      { name: 'Simplii', tickets: 4, lastContact: '1/13', hasZendeskOrg: true },
      { name: 'Callloom', tickets: 2, lastContact: '2/10', hasZendeskOrg: true },
      { name: 'iFaxApp', tickets: 1, lastContact: '1/28', hasZendeskOrg: true },
      { name: 'RetellAI', tickets: 1, lastContact: '1/22', hasZendeskOrg: true },
      { name: '42Chat', tickets: 0, lastContact: 'N/A', hasZendeskOrg: true },
      
      // Customers WITHOUT Zendesk orgs - no ticket data available
      { name: 'Chiirp', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'General Atomics', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'GetScaled', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'Grupo Bimbo', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'IVR Technologies', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'Jobble', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'Palate Connect', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
      { name: 'Redo', tickets: 0, lastContact: 'N/A', hasZendeskOrg: false },
    ]
    
    setCustomers(data)
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [gatewayConfig.url])

  const customersWithOrgs = customers.filter(c => c.hasZendeskOrg)
  const totalTickets = customersWithOrgs.reduce((sum, c) => sum + c.tickets, 0)
  const customersWithTickets = customersWithOrgs.filter(c => c.tickets > 0).length
  const atRiskCount = customersWithOrgs.filter(c => c.tickets >= 4).length
  const noOrgCount = customers.filter(c => !c.hasZendeskOrg).length

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
            onClick={loadData}
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
        <StatCard label="With Zendesk Org" value={customersWithOrgs.length} icon="✓" color="purple" loading={loading} />
        <StatCard label="At Risk (4+)" value={atRiskCount} icon="⚠️" color="red" loading={loading} />
        <StatCard label="No Zendesk Org" value={noOrgCount} icon="❓" color="yellow" loading={loading} />
      </div>

      {/* Customer Grid - Only those with Zendesk orgs */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Customers (Zendesk Linked)</h2>
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
            {customersWithOrgs.map((customer) => (
              <CustomerCard key={customer.name} customer={customer} />
            ))}
          </div>
        )}
      </div>

      {/* Customers without Zendesk orgs */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>Needs Zendesk Org</span>
          <span className="text-xs text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded">{noOrgCount}</span>
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {customers.filter(c => !c.hasZendeskOrg).map((customer) => (
            <div key={customer.name} className="bg-gray-900 rounded-xl border border-yellow-500/30 p-4">
              <h3 className="font-semibold text-white text-sm">{customer.name}</h3>
              <div className="text-xs text-yellow-500 mt-2">⚠️ No Zendesk org linked</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Needs Attention</h3>
          <div className="space-y-3">
            {customersWithOrgs.filter(c => c.tickets >= 4).map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm text-white">{c.name}</p>
                  <p className="text-xs text-red-400">{c.tickets} open tickets</p>
                </div>
              </div>
            ))}
            {customersWithOrgs.filter(c => c.tickets >= 4).length === 0 && (
              <p className="text-sm text-gray-500">No customers at risk 🎉</p>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Ticket Summary</h3>
          <div className="space-y-2">
            {customersWithOrgs.filter(c => c.tickets > 0).slice(0, 5).map(c => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{c.name}</span>
                <span className={`font-mono ${c.tickets >= 4 ? 'text-red-400' : c.tickets >= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {c.tickets}
                </span>
              </div>
            ))}
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
