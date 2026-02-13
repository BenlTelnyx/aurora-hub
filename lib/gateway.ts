// Gateway API client for Aurora Hub

export interface GatewayConfig {
  url: string
  token: string
}

export interface Customer {
  name: string
  tickets: number
  lastContact: string
  openTickets?: TicketSummary[]
}

export interface TicketSummary {
  id: string
  subject: string
  status: string
  created: string
  url: string
}

// Customer list - the canonical list of customers to track (from memory/customers.json)
export const TRACKED_CUSTOMERS = [
  'CareCo', 'Callloom', 'Chiirp', 'RetellAI', 'Screen Magic', 
  'Simplii', 'iFaxApp', '42Chat', 'Mango Voice', 'Redo',
  'Jobble', 'Palate Connect', 'GetScaled', 'Grupo Bimbo',
  'General Atomics', 'IVR Technologies'
]

export async function fetchCustomerTickets(config: GatewayConfig): Promise<Customer[]> {
  // Call the gateway's chat endpoint to ask Aurora to fetch Zendesk data
  const response = await fetch(`${config.url}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    },
    body: JSON.stringify({
      model: 'default',
      messages: [{
        role: 'user',
        content: `Fetch open Zendesk tickets for these customers and return as JSON array: ${TRACKED_CUSTOMERS.join(', ')}. 
        
Format: [{"name": "CustomerName", "tickets": count, "openTickets": [{"id": "123", "subject": "...", "status": "open", "created": "date", "url": "..."}]}]

Return ONLY the JSON, no explanation.`
      }],
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    throw new Error(`Gateway error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || '[]'
  
  // Parse JSON from response
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const tickets = JSON.parse(jsonMatch[0])
      return tickets.map((t: any) => ({
        name: t.name,
        tickets: t.tickets || t.openTickets?.length || 0,
        healthStatus: getHealthStatus(t.tickets || 0),
        lastContact: t.openTickets?.[0]?.created || 'N/A',
        openTickets: t.openTickets || []
      }))
    }
  } catch (e) {
    console.error('Failed to parse gateway response:', e)
  }

  return []
}

// Health status based on ticket count
function getHealthStatus(ticketCount: number): 'healthy' | 'warning' | 'at-risk' {
  if (ticketCount >= 4) return 'at-risk'
  if (ticketCount >= 2) return 'warning'
  return 'healthy'
}

export async function testGatewayConnection(config: GatewayConfig): Promise<boolean> {
  try {
    const response = await fetch(`${config.url}/health`, {
      headers: {
        'Authorization': `Bearer ${config.token}`
      }
    })
    return response.ok
  } catch {
    return false
  }
}
