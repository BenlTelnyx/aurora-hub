'use client'

import { useState } from 'react'

const vipCustomers = [
  { id: 1, name: 'CareCo', email: 'support@careco.com', tickets: 2, mmc: 15000, spend: 14200, health: 'healthy' },
  { id: 2, name: 'Callloom', email: 'nauman@marsadvertisingllc.com', tickets: 1, mmc: null, spend: 8500, health: 'healthy' },
  { id: 3, name: 'Chiirp', email: 'support@chiirp.com', tickets: 3, mmc: 10000, spend: 6800, health: 'at-risk' },
  { id: 4, name: 'RetellAi', email: 'team@retellai.com', tickets: 0, mmc: 25000, spend: 32000, health: 'healthy' },
  { id: 5, name: 'Automentor', email: 'ryan.federico@automentor.app', tickets: 0, mmc: 5000, spend: 1910, health: 'warning' },
  { id: 6, name: 'iFaxApp', email: 'support@ifaxapp.com', tickets: 2, mmc: 8000, spend: 9200, health: 'healthy' },
  { id: 7, name: '42Chat', email: 'ops@42chat.com', tickets: 1, mmc: 12000, spend: 10500, health: 'warning' },
  { id: 8, name: 'Mango Voice', email: 'support@mangovoice.com', tickets: 4, mmc: 7500, spend: 4200, health: 'at-risk' },
]

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof vipCustomers[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = vipCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex gap-6 h-full">
      {/* Customer List */}
      <div className="w-1/3 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Customers</h1>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedCustomer?.id === customer.id
                  ? 'bg-aurora-600/20 border-aurora-600/30'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">{customer.name}</span>
                <HealthBadge health={customer.health} />
              </div>
              <p className="text-sm text-gray-400">{customer.email}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>🎫 {customer.tickets} tickets</span>
                {customer.mmc && (
                  <span>💰 ${customer.spend.toLocaleString()} / ${customer.mmc.toLocaleString()}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Customer Detail */}
      <div className="flex-1">
        {selectedCustomer ? (
          <CustomerDetail customer={selectedCustomer} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select a customer to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

function HealthBadge({ health }: { health: string }) {
  const colors = {
    healthy: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    'at-risk': 'bg-red-500/20 text-red-400',
  }
  const labels = { healthy: '✓', warning: '⚡', 'at-risk': '⚠️' }
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[health as keyof typeof colors]}`}>
      {labels[health as keyof typeof labels]}
    </span>
  )
}

function CustomerDetail({ customer }: { customer: typeof vipCustomers[0] }) {
  const mmcPercent = customer.mmc ? Math.round((customer.spend / customer.mmc) * 100) : null

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
          <p className="text-gray-400">{customer.email}</p>
        </div>
        <div className="flex gap-2">
          <ActionButton icon="📧" label="Email" />
          <ActionButton icon="💬" label="Slack" />
          <ActionButton icon="📞" label="Call" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Open Tickets</p>
          <p className="text-2xl font-bold text-white">{customer.tickets}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Current Spend</p>
          <p className="text-2xl font-bold text-white">${customer.spend.toLocaleString()}</p>
        </div>
        {customer.mmc && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-400">MMC Progress</p>
            <p className={`text-2xl font-bold ${mmcPercent && mmcPercent >= 100 ? 'text-green-400' : mmcPercent && mmcPercent >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
              {mmcPercent}%
            </p>
          </div>
        )}
      </div>

      {/* MMC Progress Bar */}
      {customer.mmc && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">MMC: ${customer.mmc.toLocaleString()}/mo</span>
            <span className="text-gray-400">${customer.spend.toLocaleString()} spent</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${mmcPercent && mmcPercent >= 100 ? 'bg-green-500' : mmcPercent && mmcPercent >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(mmcPercent || 0, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
        <button className="px-4 py-2 bg-aurora-600 hover:bg-aurora-500 text-white rounded-lg text-sm transition-colors">
          🔍 Lookup Account
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
          🎫 View Tickets
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
          📊 Billing History
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
          📝 Add Note
        </button>
      </div>
    </div>
  )
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
