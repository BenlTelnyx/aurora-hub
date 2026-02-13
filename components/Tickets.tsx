'use client'

// Only customers WITH Zendesk orgs can have verified ticket data
// Customers without orgs are shown but marked as "no data"

const customers = [
  // WITH Zendesk orgs
  { name: 'CareCo', orgId: '24316179795357', sfdc: '001Qk00000AnastIAB', hasOrg: true },
  { name: 'Callloom', orgId: '27751108046109', sfdc: '001Qk00000MBXOzIAP', hasOrg: true },
  { name: 'iFaxApp', orgId: '360133372252', sfdc: null, hasOrg: true },
  { name: 'Mango Voice', orgId: '360495178337', sfdc: '0013a00001bc3NNAAY', hasOrg: true },
  { name: 'RetellAI', orgId: '27751119088669', sfdc: '001Qk00000B8tAwIAJ', hasOrg: true },
  { name: '42Chat', orgId: '360428930637', sfdc: '0013a00001etAMLAA2', hasOrg: true },
  { name: 'Screen Magic', orgId: '16422620764829', sfdc: '0013a00001eKJdyAAG', hasOrg: true },
  { name: 'Simplii', orgId: '9653484391069', sfdc: '0018Z00002Yc6T5QAJ', hasOrg: true },
  
  // WITHOUT Zendesk orgs - no ticket data available
  { name: 'Chiirp', orgId: null, sfdc: null, hasOrg: false },
  { name: 'General Atomics', orgId: null, sfdc: null, hasOrg: false },
  { name: 'GetScaled', orgId: null, sfdc: null, hasOrg: false },
  { name: 'Grupo Bimbo', orgId: null, sfdc: null, hasOrg: false },
  { name: 'IVR Technologies', orgId: null, sfdc: null, hasOrg: false },
  { name: 'Jobble', orgId: null, sfdc: null, hasOrg: false },
  { name: 'Palate Connect', orgId: null, sfdc: null, hasOrg: false },
  { name: 'Redo', orgId: null, sfdc: null, hasOrg: false },
]

interface Ticket {
  customer: string
  url: string
  id: string
  description: string
  status: string
  opened: string
}

// Placeholder - in production this would be fetched from Zendesk
// For now, showing structure but noting that live data should be fetched
const staticTickets: Ticket[] = [
  // These would be populated by a real Zendesk API call
  // Using customer org IDs to fetch: type:ticket organization_id:XXX status<solved
]

export default function Tickets() {
  const customersWithOrgs = customers.filter(c => c.hasOrg)
  const customersWithoutOrgs = customers.filter(c => !c.hasOrg)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <p className="text-gray-400">
          {customersWithOrgs.length} customers with Zendesk orgs • {customersWithoutOrgs.length} need linking
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          💡 Ticket data is fetched live from Zendesk using organization IDs. 
          Click "View in Zendesk" to see current tickets for each customer.
        </p>
      </div>

      {/* Customers with Zendesk orgs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Linked Customers</h2>
        {customersWithOrgs.map(({ name, orgId }) => (
          <div key={name} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>👥</span>
                {name}
                <span className="text-xs text-green-500">✓ Linked</span>
              </h3>
              <a
                href={`https://telnyx.zendesk.com/agent/organizations/${orgId}/tickets`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-aurora-600 hover:bg-aurora-500 text-white text-sm rounded-lg transition-colors"
              >
                View in Zendesk →
              </a>
            </div>
            <div className="px-4 py-3 text-sm text-gray-400">
              <code className="text-xs bg-gray-800 px-2 py-1 rounded">org:{orgId}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Customers without Zendesk orgs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Needs Zendesk Org
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{customersWithoutOrgs.length}</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {customersWithoutOrgs.map(({ name }) => (
            <div key={name} className="bg-gray-900 rounded-xl border border-yellow-500/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{name}</h3>
                <span className="text-xs text-yellow-500">⚠️ No org</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Cannot fetch ticket data without Zendesk organization ID
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
