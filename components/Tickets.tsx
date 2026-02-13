'use client'

import { useState } from 'react'

interface Ticket {
  customer: string
  url: string
  id: string
  description: string
  status: string
  opened: string
}

// All tickets from Google Sheet (Summary tab) - Feb 12, 2026
const allTickets: Ticket[] = [
  { customer: 'Callloom', url: 'https://telnyx.zendesk.com/agent/tickets/2681181', id: '2681181', description: 'Dead-air issue', status: 'Open', opened: '2/10' },
  { customer: 'Callloom', url: 'https://telnyx.zendesk.com/agent/tickets/2678598', id: '2678598', description: 'Distorting audio', status: 'Open', opened: '2/9' },
  { customer: 'Callloom', url: 'https://telnyx.zendesk.com/agent/tickets/2646380', id: '2646380', description: 'SMS errors', status: 'Open', opened: '1/23' },
  { customer: 'Chiirp', url: 'https://telnyx.zendesk.com/agent/tickets/2098521', id: '2098521', description: 'Inbound Support Request', status: 'Open', opened: '3/24/25' },
  { customer: 'RetellAi', url: 'https://telnyx.zendesk.com/agent/tickets/2664371', id: '2664371', description: 'Inbound Support Request', status: 'Open', opened: '2/2' },
  { customer: 'RetellAi', url: 'https://telnyx.zendesk.com/agent/tickets/2663036', id: '2663036', description: 'Misconfiguration on Telnyx', status: 'Open', opened: '2/1' },
  { customer: 'RetellAi', url: 'https://telnyx.zendesk.com/agent/tickets/2641849', id: '2641849', description: 'Fraudulent calls from network', status: 'Open', opened: '1/22' },
  { customer: 'Screen Magic', url: 'https://telnyx.zendesk.com/agent/tickets/2678629', id: '2678629', description: 'Text enablement case', status: 'Open', opened: '2/9' },
  { customer: 'Screen Magic', url: 'https://telnyx.zendesk.com/agent/tickets/2675382', id: '2675382', description: 'Observing issues', status: 'Open', opened: '2/6' },
  { customer: 'Screen Magic', url: 'https://telnyx.zendesk.com/agent/tickets/2670353', id: '2670353', description: 'Messages being blocked', status: 'Open', opened: '2/4' },
  { customer: 'Screen Magic', url: 'https://telnyx.zendesk.com/agent/tickets/2645057', id: '2645057', description: 'Text enable number', status: 'Open', opened: '1/23' },
  { customer: 'Screen Magic', url: 'https://telnyx.zendesk.com/agent/tickets/2637305', id: '2637305', description: 'Assessing Telnyx capabilities', status: 'Open', opened: '1/21' },
  { customer: 'Simplii', url: 'https://telnyx.zendesk.com/agent/tickets/2628312', id: '2628312', description: 'Outbound Failed SMS', status: 'Open', opened: '1/18' },
  { customer: 'Simplii', url: 'https://telnyx.zendesk.com/agent/tickets/2612308', id: '2612308', description: 'Resubmit Campaign C2S48PH', status: 'Open', opened: '1/13' },
  { customer: 'Simplii', url: 'https://telnyx.zendesk.com/agent/tickets/2583053', id: '2583053', description: 'Port Out Notification', status: 'Open', opened: '1/1' },
  { customer: 'Simplii', url: 'https://telnyx.zendesk.com/agent/tickets/2531840', id: '2531840', description: 'Resubmit Multiple Campaigns', status: 'Open', opened: '12/9' },
  { customer: 'Simplii', url: 'https://telnyx.zendesk.com/agent/tickets/1040116', id: '1040116', description: 'Robocall Weekly Updates', status: 'Open', opened: '5/3/22' },
  { customer: 'iFaxApp', url: 'https://telnyx.zendesk.com/agent/tickets/2654944', id: '2654944', description: 'URGENT: Fax Failures', status: 'Open', opened: '1/28' },
  { customer: 'iFaxApp', url: 'https://telnyx.zendesk.com/agent/tickets/2402307', id: '2402307', description: 'Test Ticket', status: 'Open', opened: '9/30/25' },
  { customer: '42Chat', url: 'https://telnyx.zendesk.com/agent/tickets/2550080', id: '2550080', description: 'Outbound Failed SMS', status: 'Open', opened: '12/18' },
  { customer: '42Chat', url: 'https://telnyx.zendesk.com/agent/tickets/2548629', id: '2548629', description: 'Message blocked as SPAM', status: 'Open', opened: '12/17' },
  { customer: 'Mango Voice', url: 'https://telnyx.zendesk.com/agent/tickets/2627147', id: '2627147', description: 'End user validation port', status: 'Open', opened: '1/16' },
  { customer: 'Mango Voice', url: 'https://telnyx.zendesk.com/agent/tickets/2625650', id: '2625650', description: 'Port Out Notification', status: 'Open', opened: '1/16' },
  { customer: 'Mango Voice', url: 'https://telnyx.zendesk.com/agent/tickets/2524604', id: '2524604', description: 'Port Out Notification', status: 'Open', opened: '12/5' },
  { customer: 'Mango Voice', url: 'https://telnyx.zendesk.com/agent/tickets/2524603', id: '2524603', description: 'Port Out Notification', status: 'Open', opened: '12/5' },
  { customer: 'Mango Voice', url: 'https://telnyx.zendesk.com/agent/tickets/2194139', id: '2194139', description: 'Migrate campaign CGZ09YJ', status: 'Open', opened: '5/23/25' },
  { customer: 'Redo', url: 'https://telnyx.zendesk.com/agent/tickets/2676743', id: '2676743', description: 'URGENT: TF blocked', status: 'Open', opened: '2/7' },
  { customer: 'Redo', url: 'https://telnyx.zendesk.com/agent/tickets/2667295', id: '2667295', description: 'Account Registration Review', status: 'Open', opened: '2/3' },
  { customer: 'Redo', url: 'https://telnyx.zendesk.com/agent/tickets/2676531', id: '2676531', description: 'Questions about 10DLC', status: 'Open', opened: '2/7' },
  { customer: 'Redo', url: 'https://telnyx.zendesk.com/agent/tickets/2625640', id: '2625640', description: 'Porting Numbers', status: 'Open', opened: '1/16' },
  { customer: 'Redo', url: 'https://telnyx.zendesk.com/agent/tickets/2490079', id: '2490079', description: 'Expedite TFN Verification', status: 'Open', opened: '11/18/25' },
]

export default function Tickets() {
  const customers = Array.from(new Set(allTickets.map(t => t.customer))).sort()
  
  // Group tickets by customer
  const ticketsByCustomer = customers.map(customer => ({
    customer,
    tickets: allTickets.filter(t => t.customer === customer)
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <p className="text-gray-400">{allTickets.length} open tickets across {customers.length} customers</p>
      </div>

      {/* Tickets grouped by customer */}
      <div className="space-y-6">
        {ticketsByCustomer.map(({ customer, tickets }) => (
          <div key={customer} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {/* Customer Header */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span>👥</span>
                {customer}
              </h2>
              <span className="text-sm text-gray-400">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
            </div>
            
            {/* Tickets */}
            <div className="divide-y divide-gray-800/50">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="px-4 py-3 hover:bg-gray-800/30 transition-colors flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-aurora-400 font-mono text-sm">#{ticket.id}</span>
                      <span className="text-white truncate">{ticket.description}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Opened {ticket.opened}</div>
                  </div>
                  <a
                    href={ticket.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 inline-flex items-center gap-1 px-3 py-1.5 bg-aurora-600 hover:bg-aurora-500 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                  >
                    Open →
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
