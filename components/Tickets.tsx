'use client'

interface Ticket {
  customer: string
  url: string
  id: string
  description: string
  status: string
  opened: string
}

// Tickets from Google Sheet tracker (updated Feb 12, 2026)
const allTickets: Ticket[] = [
  // Callloom (3 tickets)
  { customer: 'Callloom', id: '2681181', url: 'https://telnyx.zendesk.com/agent/tickets/2681181', description: 'Dead-air issue', status: 'open', opened: '2/10' },
  { customer: 'Callloom', id: '2678598', url: 'https://telnyx.zendesk.com/agent/tickets/2678598', description: 'Distorting audio', status: 'open', opened: '2/9' },
  { customer: 'Callloom', id: '2646380', url: 'https://telnyx.zendesk.com/agent/tickets/2646380', description: 'SMS errors', status: 'open', opened: '1/23' },
  
  // Chiirp (1 ticket)
  { customer: 'Chiirp', id: '2098521', url: 'https://telnyx.zendesk.com/agent/tickets/2098521', description: 'Inbound Support Request', status: 'open', opened: '3/24/25' },
  
  // RetellAI (3 tickets)
  { customer: 'RetellAI', id: '2664371', url: 'https://telnyx.zendesk.com/agent/tickets/2664371', description: 'Inbound Support Request', status: 'open', opened: '2/2' },
  { customer: 'RetellAI', id: '2663036', url: 'https://telnyx.zendesk.com/agent/tickets/2663036', description: 'Misconfiguration on Telnyx', status: 'open', opened: '2/1' },
  { customer: 'RetellAI', id: '2641849', url: 'https://telnyx.zendesk.com/agent/tickets/2641849', description: 'Fraudulent calls from network', status: 'open', opened: '1/22' },
  
  // Screen Magic (5 tickets)
  { customer: 'Screen Magic', id: '2678629', url: 'https://telnyx.zendesk.com/agent/tickets/2678629', description: 'Text enablement case', status: 'open', opened: '2/9' },
  { customer: 'Screen Magic', id: '2675382', url: 'https://telnyx.zendesk.com/agent/tickets/2675382', description: 'Observing issues', status: 'open', opened: '2/6' },
  { customer: 'Screen Magic', id: '2670353', url: 'https://telnyx.zendesk.com/agent/tickets/2670353', description: 'Messages being blocked', status: 'open', opened: '2/4' },
  { customer: 'Screen Magic', id: '2645057', url: 'https://telnyx.zendesk.com/agent/tickets/2645057', description: 'Text enable number', status: 'open', opened: '1/23' },
  { customer: 'Screen Magic', id: '2637305', url: 'https://telnyx.zendesk.com/agent/tickets/2637305', description: 'Assessing Telnyx capabilities', status: 'open', opened: '1/21' },
  
  // Simplii (5 tickets)
  { customer: 'Simplii', id: '2628312', url: 'https://telnyx.zendesk.com/agent/tickets/2628312', description: 'Outbound Failed SMS', status: 'open', opened: '1/18' },
  { customer: 'Simplii', id: '2612308', url: 'https://telnyx.zendesk.com/agent/tickets/2612308', description: 'Resubmit Campaign C2S48PH', status: 'open', opened: '1/13' },
  { customer: 'Simplii', id: '2583053', url: 'https://telnyx.zendesk.com/agent/tickets/2583053', description: 'Port Out Notification', status: 'open', opened: '1/1' },
  { customer: 'Simplii', id: '2531840', url: 'https://telnyx.zendesk.com/agent/tickets/2531840', description: 'Resubmit Multiple Campaigns', status: 'open', opened: '12/9' },
  { customer: 'Simplii', id: '1040116', url: 'https://telnyx.zendesk.com/agent/tickets/1040116', description: 'Robocall Weekly Updates', status: 'open', opened: '5/3/22' },
  
  // iFaxApp (1 ticket)
  { customer: 'iFaxApp', id: '2654944', url: 'https://telnyx.zendesk.com/agent/tickets/2654944', description: 'URGENT: Fax Failures', status: 'open', opened: '1/28' },
  
  // 42Chat (2 tickets)
  { customer: '42Chat', id: '2550080', url: 'https://telnyx.zendesk.com/agent/tickets/2550080', description: 'Outbound Failed SMS', status: 'open', opened: '12/18' },
  { customer: '42Chat', id: '2548629', url: 'https://telnyx.zendesk.com/agent/tickets/2548629', description: 'Message blocked as SPAM', status: 'open', opened: '12/17' },
  
  // Mango Voice (5 tickets)
  { customer: 'Mango Voice', id: '2627147', url: 'https://telnyx.zendesk.com/agent/tickets/2627147', description: 'End user validation port', status: 'open', opened: '1/16' },
  { customer: 'Mango Voice', id: '2625650', url: 'https://telnyx.zendesk.com/agent/tickets/2625650', description: 'Port Out Notification', status: 'open', opened: '1/16' },
  { customer: 'Mango Voice', id: '2524604', url: 'https://telnyx.zendesk.com/agent/tickets/2524604', description: 'Port Out Notification', status: 'open', opened: '12/5' },
  { customer: 'Mango Voice', id: '2524603', url: 'https://telnyx.zendesk.com/agent/tickets/2524603', description: 'Port Out Notification', status: 'open', opened: '12/5' },
  { customer: 'Mango Voice', id: '2194139', url: 'https://telnyx.zendesk.com/agent/tickets/2194139', description: 'Migrate campaign CGZ09YJ', status: 'open', opened: '5/23/25' },
  
  // Redo (5 tickets)
  { customer: 'Redo', id: '2676743', url: 'https://telnyx.zendesk.com/agent/tickets/2676743', description: 'URGENT: TF blocked', status: 'open', opened: '2/7' },
  { customer: 'Redo', id: '2667295', url: 'https://telnyx.zendesk.com/agent/tickets/2667295', description: 'Account Registration Review', status: 'open', opened: '2/3' },
  { customer: 'Redo', id: '2676531', url: 'https://telnyx.zendesk.com/agent/tickets/2676531', description: 'Questions about 10DLC', status: 'open', opened: '2/7' },
  { customer: 'Redo', id: '2625640', url: 'https://telnyx.zendesk.com/agent/tickets/2625640', description: 'Porting Numbers', status: 'open', opened: '1/16' },
  { customer: 'Redo', id: '2490079', url: 'https://telnyx.zendesk.com/agent/tickets/2490079', description: 'Expedite TFN Verification', status: 'open', opened: '11/18/25' },
]

// Customers with Zendesk org info (from memory/customers.json)
const customers = [
  { name: 'CareCo', orgId: '24316179795357', sfdc: '001Qk00000AnastIAB' },
  { name: 'Callloom', orgId: '27751108046109', sfdc: '001Qk00000MBXOzIAP' },
  { name: 'Chiirp', orgId: null, sfdc: null },
  { name: 'General Atomics', orgId: null, sfdc: null },
  { name: 'GetScaled', orgId: null, sfdc: null },
  { name: 'Grupo Bimbo', orgId: null, sfdc: null },
  { name: 'iFaxApp', orgId: '360133372252', sfdc: null },
  { name: 'IVR Technologies', orgId: null, sfdc: null },
  { name: 'Jobble', orgId: null, sfdc: null },
  { name: 'Mango Voice', orgId: '360495178337', sfdc: '0013a00001bc3NNAAY' },
  { name: 'Palate Connect', orgId: null, sfdc: null },
  { name: 'Redo', orgId: null, sfdc: null },
  { name: 'RetellAI', orgId: '27751119088669', sfdc: '001Qk00000B8tAwIAJ' },
  { name: '42Chat', orgId: '360428930637', sfdc: '0013a00001etAMLAA2' },
  { name: 'Screen Magic', orgId: '16422620764829', sfdc: '0013a00001eKJdyAAG' },
  { name: 'Simplii', orgId: '9653484391069', sfdc: '0018Z00002Yc6T5QAJ' },
].sort((a, b) => a.name.localeCompare(b.name))

export default function Tickets() {
  const ticketsByCustomer = customers.map(customer => ({
    ...customer,
    tickets: allTickets.filter(t => t.customer === customer.name)
  }))

  // Sort by ticket count (most first)
  const sorted = [...ticketsByCustomer].sort((a, b) => b.tickets.length - a.tickets.length)

  const totalTickets = allTickets.length
  const customersWithTickets = ticketsByCustomer.filter(c => c.tickets.length > 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <p className="text-gray-400">{totalTickets} open tickets • {customersWithTickets} of {customers.length} customers with tickets</p>
      </div>

      <div className="space-y-4">
        {sorted.map(({ name, orgId, tickets }) => (
          <div key={name} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span>👥</span>
                {name}
                {!orgId && tickets.length > 0 && <span className="text-xs text-yellow-500 ml-2">(no Zendesk org)</span>}
              </h2>
              <span className={`text-sm px-2 py-0.5 rounded ${tickets.length > 0 ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}>
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="divide-y divide-gray-800/50">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="px-4 py-3 hover:bg-gray-800/30 transition-colors flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-aurora-400 font-mono text-sm">#{ticket.id}</span>
                        <span className="text-white truncate">{ticket.description}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{ticket.status}</span>
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
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  {orgId ? '✓ No open tickets' : '—'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
