'use client'

import { useState } from 'react'

type LookupType = 'campaign' | 'call' | 'number' | 'message' | 'user'

export default function IssueDive() {
  const [query, setQuery] = useState('')
  const [lookupType, setLookupType] = useState<LookupType>('campaign')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSearch = async () => {
    if (!query) return
    setIsSearching(true)
    // Simulated delay - will connect to real API
    setTimeout(() => {
      setResult({
        type: lookupType,
        data: getMockData(lookupType, query),
        suggestions: getMockSuggestions(lookupType),
        docs: getMockDocs(lookupType),
      })
      setIsSearching(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Issue Deep Dive</h1>
        <p className="text-gray-400">Look up any ID and get instant context + solutions</p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="flex gap-4">
          {/* Type Selector */}
          <select
            value={lookupType}
            onChange={(e) => setLookupType(e.target.value as LookupType)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-500"
          >
            <option value="campaign">10DLC Campaign</option>
            <option value="call">Call ID</option>
            <option value="number">Phone Number</option>
            <option value="message">Message ID</option>
            <option value="user">User/Account</option>
          </select>

          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={getPlaceholder(lookupType)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-aurora-600 hover:bg-aurora-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isSearching ? '🔄 Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Quick Examples */}
        <div className="flex gap-2 mt-3">
          <span className="text-xs text-gray-500">Try:</span>
          <QuickButton text="campaign:CXXX123" onClick={() => { setLookupType('campaign'); setQuery('CXXX123'); }} />
          <QuickButton text="+18005551234" onClick={() => { setLookupType('number'); setQuery('+18005551234'); }} />
          <QuickButton text="user@example.com" onClick={() => { setLookupType('user'); setQuery('user@example.com'); }} />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Issue Data */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📋</span> Issue Data
            </h2>
            <div className="space-y-3">
              {Object.entries(result.data).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{formatKey(key)}</span>
                  <span className={`text-white ${getValueStyle(key, value as string)}`}>{value as string}</span>
                </div>
              ))}
            </div>

            {/* Related Tickets */}
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-white mb-2">Similar Tickets</h3>
              <div className="space-y-2">
                <TicketLink id="45123" subject="10DLC rejection - missing EIN" status="resolved" />
                <TicketLink id="44891" subject="Campaign registration stuck" status="resolved" />
              </div>
            </div>
          </div>

          {/* Right: Knowledge */}
          <div className="space-y-4">
            {/* Aurora's Take */}
            <div className="bg-aurora-600/10 border border-aurora-600/30 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-aurora-400 flex items-center gap-2 mb-3">
                <span>🤖</span> Aurora's Take
              </h2>
              <div className="text-sm text-gray-300 space-y-2">
                {result.suggestions.map((s: string, i: number) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
              <button className="mt-4 text-sm text-aurora-400 hover:text-aurora-300">
                ✉️ Draft response to customer →
              </button>
            </div>

            {/* Related Docs */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                <span>📚</span> Related Docs
              </h2>
              <div className="space-y-2">
                {result.docs.map((doc: { title: string; source: string }, i: number) => (
                  <a
                    key={i}
                    href="#"
                    className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <p className="text-sm text-white">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.source}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QuickButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
    >
      {text}
    </button>
  )
}

function TicketLink({ id, subject, status }: { id: string; subject: string; status: string }) {
  return (
    <a href="#" className="flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-aurora-400">#{id}</span>
        <span className="text-sm text-gray-300">{subject}</span>
      </div>
      <span className="text-xs text-green-400">{status}</span>
    </a>
  )
}

function getPlaceholder(type: LookupType): string {
  const placeholders = {
    campaign: 'Enter campaign ID (e.g., CXXX123)',
    call: 'Enter call ID (e.g., abc-def-123)',
    number: 'Enter phone number (e.g., +18005551234)',
    message: 'Enter message ID',
    user: 'Enter email or user ID',
  }
  return placeholders[type]
}

function formatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getValueStyle(key: string, value: string): string {
  if (key === 'status') {
    if (value === 'APPROVED' || value === 'ACTIVE') return 'text-green-400'
    if (value === 'PENDING') return 'text-yellow-400'
    if (value === 'FAILED' || value === 'REJECTED') return 'text-red-400'
  }
  return ''
}

function getMockData(type: LookupType, query: string) {
  if (type === 'campaign') {
    return {
      campaign_id: query,
      brand: 'Acme Corp',
      status: 'PENDING',
      tcr_status: 'FAILED',
      rejection_reason: 'Missing EIN documentation',
      use_case: 'Marketing',
      created_at: '2026-02-10',
      account: 'user-abc-123',
    }
  }
  return { id: query, status: 'Unknown' }
}

function getMockSuggestions(type: LookupType): string[] {
  if (type === 'campaign') {
    return [
      "This looks like a standard TCR EIN rejection.",
      "The brand was likely registered as sole proprietor but needs business documentation.",
      "Recommended: Have customer resubmit with valid EIN. Typical approval time: 24-72hrs.",
      "Similar issue resolved for iFaxApp last month (ticket #42156)."
    ]
  }
  return ["Analyzing issue..."]
}

function getMockDocs(type: LookupType) {
  if (type === 'campaign') {
    return [
      { title: '10DLC Registration Guide', source: 'Telnyx Docs' },
      { title: 'Common TCR Rejection Reasons', source: 'Guru' },
      { title: 'EIN Requirements for A2P Messaging', source: 'Telnyx Docs' },
    ]
  }
  return []
}
