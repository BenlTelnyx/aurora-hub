'use client'

import { useState } from 'react'

// Customer data from memory/customers.json - single source of truth
const customers = [
  { id: 1, name: 'CareCo', email: 'support@careco.com', zendesk_id: '24316179795357', sfdc: '001Qk00000AnastIAB', tickets: 9, health: 'at-risk' },
  { id: 2, name: 'Callloom', email: 'nauman@marsadvertisingllc.com', zendesk_id: '27751108046109', sfdc: '001Qk00000MBXOzIAP', tickets: 3, health: 'at-risk' },
  { id: 3, name: 'Chiirp', email: 'cnielsen@chiirp.com', zendesk_id: null, sfdc: null, tickets: 1, health: 'warning' },
  { id: 4, name: 'General Atomics', email: null, zendesk_id: null, sfdc: null, tickets: 0, health: 'healthy' },
  { id: 5, name: 'GetScaled', email: null, zendesk_id: null, sfdc: null, tickets: 0, health: 'healthy' },
  { id: 6, name: 'Grupo Bimbo', email: null, zendesk_id: null, sfdc: null, tickets: 0, health: 'healthy' },
  { id: 7, name: 'iFaxApp', email: 'support@ifaxapp.com', zendesk_id: '360133372252', sfdc: null, tickets: 1, health: 'warning' },
  { id: 8, name: 'IVR Technologies', email: null, zendesk_id: null, sfdc: null, tickets: 0, health: 'healthy' },
  { id: 9, name: 'Jobble', email: null, zendesk_id: null, sfdc: null, tickets: 0, health: 'healthy' },
  { id: 10, name: 'Mango Voice', email: 'support@mangovoice.com', zendesk_id: '360495178337', sfdc: '0013a00001bc3NNAAY', tickets: 5, health: 'at-risk' },
  { id: 11, name: 'Palate Connect', email: null, zendesk_id: null, sfdc: null, tickets: 0, health: 'healthy' },
  { id: 12, name: 'Redo', email: null, zendesk_id: null, sfdc: null, tickets: 5, health: 'at-risk' },
  { id: 13, name: 'RetellAI', email: 'team@retellai.com', zendesk_id: '27751119088669', sfdc: '001Qk00000B8tAwIAJ', tickets: 3, health: 'warning' },
  { id: 14, name: '42Chat', email: 'ops@42chat.com', zendesk_id: '360428930637', sfdc: '0013a00001etAMLAA2', tickets: 2, health: 'warning' },
  { id: 15, name: 'Screen Magic', email: 'support@screenmagic.com', zendesk_id: '16422620764829', sfdc: '0013a00001eKJdyAAG', tickets: 10, health: 'at-risk' },
  { id: 16, name: 'Simplii', email: 'support@simplii.com', zendesk_id: '9653484391069', sfdc: '0018Z00002Yc6T5QAJ', tickets: 4, health: 'warning' },
]

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Sort by tickets (most first), then by health priority
  const sorted = [...filtered].sort((a, b) => {
    const healthOrder = { 'at-risk': 0, 'warning': 1, 'healthy': 2 }
    if (b.tickets !== a.tickets) return b.tickets - a.tickets
    return healthOrder[a.health as keyof typeof healthOrder] - healthOrder[b.health as keyof typeof healthOrder]
  })

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

        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {sorted.map((customer) => (
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
              {customer.email && <p className="text-sm text-gray-400">{customer.email}</p>}
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>🎫 {customer.tickets} tickets</span>
                {customer.zendesk_id ? (
                  <span className="text-green-500">✓ Zendesk</span>
                ) : (
                  <span className="text-yellow-500">⚠️ No org</span>
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

function CustomerDetail({ customer }: { customer: typeof customers[0] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
          {customer.email && <p className="text-gray-400">{customer.email}</p>}
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
          <p className="text-sm text-gray-400">Zendesk Org</p>
          <p className={`text-sm font-mono ${customer.zendesk_id ? 'text-green-400' : 'text-yellow-400'}`}>
            {customer.zendesk_id ? customer.zendesk_id.slice(0, 10) + '...' : 'Not linked'}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">SFDC Account</p>
          <p className={`text-sm font-mono ${customer.sfdc ? 'text-green-400' : 'text-gray-500'}`}>
            {customer.sfdc ? customer.sfdc.slice(0, 12) + '...' : 'None'}
          </p>
        </div>
      </div>

      {/* Status Info */}
      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
        <HealthBadge health={customer.health} />
        <span className="text-gray-400 text-sm">
          {customer.health === 'at-risk' && 'Multiple open issues - needs attention'}
          {customer.health === 'warning' && 'Some open tickets - monitor closely'}
          {customer.health === 'healthy' && 'No urgent issues'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
        {customer.zendesk_id && (
          <a 
            href={`https://telnyx.zendesk.com/agent/organizations/${customer.zendesk_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-aurora-600 hover:bg-aurora-500 text-white rounded-lg text-sm transition-colors"
          >
            🎫 View in Zendesk
          </a>
        )}
        {customer.sfdc && (
          <a
            href={`https://telnyx.lightning.force.com/lightning/r/Account/${customer.sfdc}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            ☁️ View in Salesforce
          </a>
        )}
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
          🔍 Lookup Account
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
