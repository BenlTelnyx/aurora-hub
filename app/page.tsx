'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import Customers from '@/components/Customers'
import Inbox from '@/components/Inbox'
import Tasks from '@/components/Tasks'
import IssueDive from '@/components/IssueDive'
import Chat from '@/components/Chat'

type View = 'dashboard' | 'customers' | 'inbox' | 'tasks' | 'issue-dive' | 'chat'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState('')

  // Simple auth check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🌅 Aurora Hub</h1>
            <p className="text-gray-400">CSM Command Center</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Gateway Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your O token..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
              />
            </div>
            
            <button
              onClick={() => {
                if (token.length > 10) {
                  localStorage.setItem('aurora_token', token)
                  setIsAuthenticated(true)
                }
              }}
              className="w-full py-3 bg-aurora-600 hover:bg-aurora-500 text-white font-medium rounded-lg transition-colors"
            >
              Connect to Gateway
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Get your token from: <code className="text-aurora-400">~/.clawdbot/config.yaml</code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />
      case 'customers': return <Customers />
      case 'inbox': return <Inbox />
      case 'tasks': return <Tasks />
      case 'issue-dive': return <IssueDive />
      case 'chat': return <Chat />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-6 overflow-auto">
        {renderView()}
      </main>
    </div>
  )
}
