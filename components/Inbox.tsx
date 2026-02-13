'use client'

import { useState } from 'react'

type InboxSource = 'all' | 'email' | 'slack' | 'zendesk'

const inboxItems = [
  { id: 1, source: 'email', from: 'Ryan Federico', subject: 'RE: Commitment Discussion', preview: 'Thanks for the call yesterday. I wanted to follow up on...', time: '2 hours ago', unread: true },
  { id: 2, source: 'slack', from: '#messaging-inquiries', subject: 'Thread: Chiirp TFN Issue', preview: 'Can someone look at this toll-free rejection?', time: '4 hours ago', unread: true },
  { id: 3, source: 'zendesk', from: 'Mango Voice', subject: 'Ticket #45892 - Call Quality Issues', preview: 'We are experiencing intermittent call drops...', time: '5 hours ago', unread: false },
  { id: 4, source: 'email', from: 'Joe Rawling', subject: 'FW: Automentor Contract', preview: 'FYI - see thread below about their renegotiation request', time: 'Yesterday', unread: false },
  { id: 5, source: 'slack', from: '@mike.jakubisin', subject: 'DM: Callloom billing', preview: 'Any idea on that 6/6 vs 60/60 question?', time: 'Yesterday', unread: false },
  { id: 6, source: 'zendesk', from: 'RetellAi', subject: 'Ticket #45901 - API Rate Limits', preview: 'We need to increase our rate limits for the upcoming...', time: '2 days ago', unread: false },
]

const sourceIcons = {
  email: '📧',
  slack: '💬',
  zendesk: '🎫',
  all: '📥',
}

const sourceColors = {
  email: 'bg-blue-500/20 text-blue-400',
  slack: 'bg-purple-500/20 text-purple-400',
  zendesk: 'bg-orange-500/20 text-orange-400',
}

export default function Inbox() {
  const [filter, setFilter] = useState<InboxSource>('all')
  const [selectedItem, setSelectedItem] = useState<typeof inboxItems[0] | null>(null)

  const filtered = filter === 'all' ? inboxItems : inboxItems.filter(i => i.source === filter)
  const unreadCount = inboxItems.filter(i => i.unread).length

  return (
    <div className="flex gap-6 h-full">
      {/* Inbox List */}
      <div className="w-2/5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-aurora-600 text-white text-xs rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'email', 'slack', 'zendesk'] as InboxSource[]).map((source) => (
            <button
              key={source}
              onClick={() => setFilter(source)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === source
                  ? 'bg-aurora-600/20 text-aurora-400 border border-aurora-600/30'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}
            >
              <span>{sourceIcons[source]}</span>
              <span className="capitalize">{source}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedItem?.id === item.id
                  ? 'bg-aurora-600/20 border-aurora-600/30'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-xs px-2 py-1 rounded ${sourceColors[item.source as keyof typeof sourceColors]}`}>
                  {sourceIcons[item.source as keyof typeof sourceIcons]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${item.unread ? 'text-white' : 'text-gray-300'}`}>
                      {item.from}
                    </span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  <p className={`text-sm truncate ${item.unread ? 'text-white' : 'text-gray-400'}`}>
                    {item.subject}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">{item.preview}</p>
                </div>
                {item.unread && (
                  <span className="w-2 h-2 bg-aurora-500 rounded-full flex-shrink-0 mt-2"></span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1">
        {selectedItem ? (
          <MessageDetail item={selectedItem} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
            <p>Select a message to view</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageDetail({ item }: { item: typeof inboxItems[0] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-white">{item.subject}</h2>
            <p className="text-sm text-gray-400">From: {item.from}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${sourceColors[item.source as keyof typeof sourceColors]}`}>
            {item.source}
          </span>
        </div>
        <p className="text-xs text-gray-500">{item.time}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <p className="text-gray-300 leading-relaxed">
          {item.preview}
          <br /><br />
          [Full message content would be loaded here from the actual source]
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <button className="flex-1 py-2 bg-aurora-600 hover:bg-aurora-500 text-white rounded-lg transition-colors">
          Reply
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
          📌 Task
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
          🏷️ Label
        </button>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
          🗑️
        </button>
      </div>
    </div>
  )
}
