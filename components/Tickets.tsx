'use client'

interface Ticket {
  customer: string
  url: string
  id: string
  description: string
  status: string
  opened: string
}

// Real tickets from Zendesk (pulled Feb 12, 2026 10:05 PM)
const allTickets: Ticket[] = [
  // CareCo (9 tickets)
  { customer: 'CareCo', id: '2681890', url: 'https://telnyx.zendesk.com/agent/tickets/2681890', description: 'Intermittent audio issues on patient calls', status: 'open', opened: '2/10' },
  { customer: 'CareCo', id: '2678621', url: 'https://telnyx.zendesk.com/agent/tickets/2678621', description: 'Missing Call Recording – 2:09 Call', status: 'open', opened: '2/9' },
  { customer: 'CareCo', id: '2678904', url: 'https://telnyx.zendesk.com/agent/tickets/2678904', description: 'Destination Out of Order error', status: 'pending', opened: '2/9' },
  { customer: 'CareCo', id: '2567462', url: 'https://telnyx.zendesk.com/agent/tickets/2567462', description: 'Missing recording for bridged call', status: 'open', opened: '12/24' },
  { customer: 'CareCo', id: '2536736', url: 'https://telnyx.zendesk.com/agent/tickets/2536736', description: 'WebRTC client no audio in/out', status: 'open', opened: '12/11' },
  { customer: 'CareCo', id: '2560892', url: 'https://telnyx.zendesk.com/agent/tickets/2560892', description: 'Widespread WebRTC Audio Issues', status: 'pending', opened: '12/22' },
  { customer: 'CareCo', id: '2511621', url: 'https://telnyx.zendesk.com/agent/tickets/2511621', description: 'Incorrect Call and Recording Duration', status: 'hold', opened: '12/1' },
  { customer: 'CareCo', id: '2333729', url: 'https://telnyx.zendesk.com/agent/tickets/2333729', description: 'Calls purged due to internet lapses', status: 'hold', opened: '8/21' },
  { customer: 'CareCo', id: '2297449', url: 'https://telnyx.zendesk.com/agent/tickets/2297449', description: 'Calls dropping mid-call', status: 'pending', opened: '7/31' },
  
  // Screen Magic (10 tickets)
  { customer: 'Screen Magic', id: '2684958', url: 'https://telnyx.zendesk.com/agent/tickets/2684958', description: 'Ticket has been Closed', status: 'open', opened: '2/11' },
  { customer: 'Screen Magic', id: '2686955', url: 'https://telnyx.zendesk.com/agent/tickets/2686955', description: 'Text-enablement request', status: 'hold', opened: '2/12' },
  { customer: 'Screen Magic', id: '2678629', url: 'https://telnyx.zendesk.com/agent/tickets/2678629', description: 'Text enablement case', status: 'open', opened: '2/9' },
  { customer: 'Screen Magic', id: '2675382', url: 'https://telnyx.zendesk.com/agent/tickets/2675382', description: 'Observing issues', status: 'open', opened: '2/6' },
  { customer: 'Screen Magic', id: '2670353', url: 'https://telnyx.zendesk.com/agent/tickets/2670353', description: 'Messages being blocked', status: 'open', opened: '2/4' },
  { customer: 'Screen Magic', id: '2637305', url: 'https://telnyx.zendesk.com/agent/tickets/2637305', description: 'Assessing Telnyx capabilities', status: 'open', opened: '1/21' },
  { customer: 'Screen Magic', id: '2645057', url: 'https://telnyx.zendesk.com/agent/tickets/2645057', description: 'Text enable number', status: 'hold', opened: '1/23' },
  { customer: 'Screen Magic', id: '2595218', url: 'https://telnyx.zendesk.com/agent/tickets/2595218', description: '10DLC for Affinity Gaming', status: 'pending', opened: '1/6' },
  { customer: 'Screen Magic', id: '2539198', url: 'https://telnyx.zendesk.com/agent/tickets/2539198', description: '10DLC campaign submitted', status: 'pending', opened: '12/12' },
  { customer: 'Screen Magic', id: '2450446', url: 'https://telnyx.zendesk.com/agent/tickets/2450446', description: 'Campaign submission update', status: 'pending', opened: '10/27' },
  
  // Simplii (4 tickets)
  { customer: 'Simplii', id: '2612308', url: 'https://telnyx.zendesk.com/agent/tickets/2612308', description: 'Resubmit Campaign C2S48PH', status: 'pending', opened: '1/13' },
  { customer: 'Simplii', id: '2531840', url: 'https://telnyx.zendesk.com/agent/tickets/2531840', description: 'Resubmit Multiple Campaigns', status: 'pending', opened: '12/9' },
  { customer: 'Simplii', id: '2179033', url: 'https://telnyx.zendesk.com/agent/tickets/2179033', description: 'Port Out SMS Portion of a DID', status: 'open', opened: '5/14' },
  { customer: 'Simplii', id: '2079429', url: 'https://telnyx.zendesk.com/agent/tickets/2079429', description: 'Numbers Not Fully Ported', status: 'pending', opened: '3/11' },
  
  // RetellAi (1 ticket)
  { customer: 'RetellAi', id: '2641849', url: 'https://telnyx.zendesk.com/agent/tickets/2641849', description: 'Fraudulent calls from network', status: 'pending', opened: '1/22' },
]

// All VIP customers
const allCustomers = [
  '42Chat', 'Automentor', 'Callloom', 'CareCo', 'Chiirp', 'General Atomics', 
  'GetScaled', 'Grupo Bimbo', 'IVR Technologies', 'iFaxApp', 'Jobble', 
  'Mango Voice', 'Palate Connect', 'Redo', 'RetellAi', 'Screen Magic', 'Simplii'
].sort()

export default function Tickets() {
  const ticketsByCustomer = allCustomers.map(customer => ({
    customer,
    tickets: allTickets.filter(t => t.customer === customer)
  }))

  const totalTickets = allTickets.length
  const customersWithTickets = ticketsByCustomer.filter(c => c.tickets.length > 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <p className="text-gray-400">{totalTickets} open tickets • {customersWithTickets} customers need attention</p>
      </div>

      <div className="space-y-4">
        {ticketsByCustomer.map(({ customer, tickets }) => (
          <div key={customer} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span>👥</span>
                {customer}
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
                  ✓ No open tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
