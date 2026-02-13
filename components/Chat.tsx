'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey Ben! 👋 I'm here and ready. What do you need?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // TODO: Connect to actual gateway API
    // For now, simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(input),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Chat with Aurora</h1>
          <p className="text-gray-400">Your AI assistant with full context</p>
        </div>
        <div className="flex gap-2">
          <QuickAction icon="📋" label="Summarize today" />
          <QuickAction icon="📧" label="Check inbox" />
          <QuickAction icon="🎫" label="Ticket status" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-aurora-600 flex items-center justify-center text-sm">
                🌅
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask anything... (⌘ + Enter to send)"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button className="p-1 text-gray-500 hover:text-white transition-colors" title="Attach file">
                📎
              </button>
              <button className="p-1 text-gray-500 hover:text-white transition-colors" title="Voice input">
                🎤
              </button>
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-6 py-3 bg-aurora-600 hover:bg-aurora-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            Send
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 mt-3">
          <SuggestionChip text="Check Automentor's MMC status" onClick={() => setInput("Check Automentor's MMC status")} />
          <SuggestionChip text="Draft email to Chiirp about their ticket" onClick={() => setInput("Draft email to Chiirp about their ticket")} />
          <SuggestionChip text="What's on my calendar tomorrow?" onClick={() => setInput("What's on my calendar tomorrow?")} />
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        isUser ? 'bg-gray-700' : 'bg-aurora-600'
      }`}>
        {isUser ? '👤' : '🌅'}
      </div>
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-aurora-600 text-white rounded-tr-none' 
          : 'bg-gray-800 text-gray-100 rounded-tl-none'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-aurora-200' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-full text-xs transition-colors"
    >
      {text}
    </button>
  )
}

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase()
  
  if (lower.includes('automentor') && lower.includes('mmc')) {
    return `**Automentor MMC Status:**\n\n📊 **Commitment:** $5,000/month\n📅 **Contract:** Apr 2025 → Apr 2027\n\n**Feb 2026 (thru Feb 13):**\n- Billable spend: **$1,910** (38% of MMC)\n- Passthrough fees: $1,089\n\n⚠️ **Pacing short.** At current rate, they'll likely hit an upcharge.\n\nPer Jan 12 call, Ryan is intentionally shifting to P2P + Voice AI. He wants to renegotiate to $3K MMC.`
  }
  
  if (lower.includes('email') || lower.includes('draft')) {
    return `I'll draft that for you. What key points should I include?\n\nOr I can check their recent ticket history first to make sure I have full context.`
  }
  
  if (lower.includes('calendar') || lower.includes('tomorrow')) {
    return `Let me check your calendar...\n\n📅 **Tomorrow (Feb 13):**\n- 9:00 AM - Stack\n- 10:00 AM - Sync with RetellAi\n- 2:00 PM - Ticket Review\n\nWant me to prep context for the RetellAi sync?`
  }
  
  return `Got it! I'll look into that for you. Is there anything specific you'd like me to focus on?`
}
