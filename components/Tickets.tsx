'use client'

interface Ticket {
  customer: string
  id: string
  subject: string
  status: string
  created: string
  url: string
}

// Auto-generated from Zendesk - 2026-03-30 19:00 MDT
const allTickets: Ticket[] = [
  { customer: "CareCo", id: "2775665", subject: "User is experiencing an issue when trying to place an outbou", status: "open", created: "2026-03-26", url: "https://telnyx.zendesk.com/agent/tickets/2775665" },
  { customer: "CareCo", id: "2765864", subject: "This user has been experiencing a recurring but intermittent", status: "pending", created: "2026-03-23", url: "https://telnyx.zendesk.com/agent/tickets/2765864" },
  { customer: "CareCo", id: "2707690", subject: "Missing call recording:e454ab02-0e86-11f1-9a01-02420aef30a0", status: "open", created: "2026-02-23", url: "https://telnyx.zendesk.com/agent/tickets/2707690" },
  { customer: "CareCo", id: "2678621", subject: "Missing Call Recording – 2:09 Call", status: "hold", created: "2026-02-09", url: "https://telnyx.zendesk.com/agent/tickets/2678621" },
  { customer: "Screen Magic", id: "2782395", subject: "I initiated a text-enablement request for the numbers", status: "open", created: "2026-03-30", url: "https://telnyx.zendesk.com/agent/tickets/2782395" },
  { customer: "Screen Magic", id: "2748862", subject: "Could you please review why the messages are marked as *deli", status: "pending", created: "2026-03-13", url: "https://telnyx.zendesk.com/agent/tickets/2748862" },
  { customer: "Screen Magic", id: "2670353", subject: "We have a customer reporting that messages are being deliver", status: "open", created: "2026-02-04", url: "https://telnyx.zendesk.com/agent/tickets/2670353" },
  { customer: "Mango Voice", id: "2763657", subject: "Team! Do you see PON 485cfb67-905e-4d29-bc01-389e81b1484d in", status: "open", created: "2026-03-20", url: "https://telnyx.zendesk.com/agent/tickets/2763657" },
  { customer: "Mango Voice", id: "2773333", subject: "We're currently seeing issues with calls from a number under", status: "pending", created: "2026-03-25", url: "https://telnyx.zendesk.com/agent/tickets/2773333" },
  { customer: "Mango Voice", id: "2242342", subject: "406) 587-9700(tel:406)587-9700)* hi team, we have a campaign", status: "pending", created: "2025-06-26", url: "https://telnyx.zendesk.com/agent/tickets/2242342" },
  { customer: "Mango Voice", id: "2140178", subject: "Campaign CNW7TU8 assignment failed for tn 7404802452", status: "pending", created: "2025-04-21", url: "https://telnyx.zendesk.com/agent/tickets/2140178" },
  { customer: "Mango Voice", id: "2113956", subject: "We are having issues with campaign assignment to number *(74", status: "pending", created: "2025-04-03", url: "https://telnyx.zendesk.com/agent/tickets/2113956" },
  { customer: "Mango Voice", id: "2072112", subject: "4154610700", status: "pending", created: "2025-03-06", url: "https://telnyx.zendesk.com/agent/tickets/2072112" },
  { customer: "Mango Voice", id: "2029444", subject: "There is a pending NNID request we would like to be approved", status: "open", created: "2025-02-10", url: "https://telnyx.zendesk.com/agent/tickets/2029444" },
  { customer: "Simplii", id: "2730508", subject: "Queued Messaging", status: "hold", created: "2026-03-05", url: "https://telnyx.zendesk.com/agent/tickets/2730508" },
  { customer: "Simplii", id: "2179033", subject: "Port Out SMS Portion of a DID", status: "open", created: "2025-05-14", url: "https://telnyx.zendesk.com/agent/tickets/2179033" },
  { customer: "Simplii", id: "2079429", subject: "Numbers Not Fully Ported", status: "pending", created: "2025-03-11", url: "https://telnyx.zendesk.com/agent/tickets/2079429" },
  { customer: "RetellAI", id: "2777005", subject: "Benl, we are seeing an issue with RTP/audio originating from", status: "open", created: "2026-03-26", url: "https://telnyx.zendesk.com/agent/tickets/2777005" },
]

const customers = [
  { name: 'CareCo', orgId: '24316179795357', hasOrg: true },
  { name: 'Screen Magic', orgId: '16422620764829', hasOrg: true },
  { name: 'Mango Voice', orgId: '360495178337', hasOrg: true },
  { name: 'Simplii', orgId: '9653484391069', hasOrg: true },
  { name: 'Callloom', orgId: '27751108046109', hasOrg: true },
  { name: 'iFaxApp', orgId: '360133372252', hasOrg: true },
  { name: 'RetellAI', orgId: '27751119088669', hasOrg: true },
  { name: '42Chat', orgId: '360428930637', hasOrg: true },
  { name: 'Chiirp', orgId: null, hasOrg: false },
  { name: 'General Atomics', orgId: null, hasOrg: false },
  { name: 'GetScaled', orgId: null, hasOrg: false },
  { name: 'Grupo Bimbo', orgId: null, hasOrg: false },
  { name: 'IVR Technologies', orgId: null, hasOrg: false },
  { name: 'Jobble', orgId: null, hasOrg: false },
  { name: 'Palate Connect', orgId: null, hasOrg: false },
  { name: 'Redo', orgId: null, hasOrg: false },
]

export default function Tickets() {
  const ticketsByCustomer = customers
    .filter(c => c.hasOrg)
    .map(customer => ({
      ...customer,
      tickets: allTickets.filter(t => t.customer === customer.name)
    }))
    .sort((a, b) => b.tickets.length - a.tickets.length)

  const customersWithoutOrgs = customers.filter(c => !c.hasOrg)
  const totalTickets = allTickets.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <p className="text-gray-400">{totalTickets} open tickets across {ticketsByCustomer.filter(c => c.tickets.length > 0).length} customers</p>
      </div>

      <div className="space-y-4">
        {ticketsByCustomer.map(({ name, orgId, tickets }) => (
          <div key={name} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span>👥</span>
                {name}
              </h2>
              <div className="flex items-center gap-3">
                <span className={`text-sm px-2 py-0.5 rounded ${
                  tickets.length >= 4 ? 'bg-red-500/20 text-red-400' :
                  tickets.length >= 2 ? 'bg-yellow-500/20 text-yellow-400' :
                  tickets.length > 0 ? 'bg-blue-500/20 text-blue-400' :
                  'text-gray-500'
                }`}>
                  {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                </span>
                <a
                  href={`https://telnyx.zendesk.com/agent/organizations/${orgId}/tickets`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-aurora-400 hover:text-aurora-300"
                >
                  View all →
                </a>
              </div>
            </div>
            
            <div className="divide-y divide-gray-800/50">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="px-4 py-3 hover:bg-gray-800/30 transition-colors flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-aurora-400 font-mono text-sm">#{ticket.id}</span>
                        <span className="text-white truncate">{ticket.subject}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                          ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{ticket.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{ticket.created}</div>
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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Needs Zendesk Org
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{customersWithoutOrgs.length}</span>
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {customersWithoutOrgs.map(({ name }) => (
            <div key={name} className="bg-gray-900 rounded-xl border border-yellow-500/30 p-4">
              <h3 className="font-semibold text-white text-sm">{name}</h3>
              <p className="text-xs text-yellow-500 mt-2">⚠️ No Zendesk org</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
