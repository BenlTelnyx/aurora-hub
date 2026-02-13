'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import Customers from '@/components/Customers'
import Inbox from '@/components/Inbox'
import Tasks from '@/components/Tasks'
import IssueDive from '@/components/IssueDive'
import Chat from '@/components/Chat'
import { GatewayConfig } from '@/lib/gateway'

type View = 'dashboard' | 'customers' | 'inbox' | 'tasks' | 'issue-dive' | 'chat'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Gateway config (for Chat feature)
  const [gatewayUrl, setGatewayUrl] = useState('https://amounts-elite-chapel-born.trycloudflare.com')
  const [token, setToken] = useState('dbbe1141634dba037ed5e5a9aeec1d70c6485b95a73483e4fda3684de17684d6')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  // Auto-connect on mount (saved creds or defaults)
  useEffect(() => {
    const savedUrl = localStorage.getItem('aurora_gateway_url')
    const savedToken = localStorage.getItem('aurora_token')
    if (savedUrl && savedToken) {
      setGatewayUrl(savedUrl)
      setToken(savedToken)
      setIsAuthenticated(true)
    } else if (gatewayUrl && token) {
      // Auto-connect with defaults
      localStorage.setItem('aurora_gateway_url', gatewayUrl)
      localStorage.setItem('aurora_token', token)
      setIsAuthenticated(true)
    }
  }, [])

  const gatewayConfig: GatewayConfig = { url: gatewayUrl, token }

  const handleConnect = async () => {
    setConnecting(true)
    setError('')
    
    try {
      // Test connection to gateway
      const response = await fetch(`${gatewayUrl}/health`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => null)
      
      if (response?.ok || gatewayUrl.includes('trycloudflare.com')) {
        // Save config
        localStorage.setItem('aurora_gateway_url', gatewayUrl)
        localStorage.setItem('aurora_token', token)
        setIsAuthenticated(true)
      } else {
        setError('Could not connect to gateway. Check URL and token.')
      }
    } catch (e) {
      setError('Connection failed. Is the gateway running?')
    } finally {
      setConnecting(false)
    }
  }

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
              <label className="block text-sm text-gray-400 mb-2">Gateway URL</label>
              <input
                type="url"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                placeholder="https://your-tunnel.trycloudflare.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Gateway Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your gateway token..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            
            <button
              onClick={handleConnect}
              disabled={connecting || !gatewayUrl || !token}
              className="w-full py-3 bg-aurora-600 hover:bg-aurora-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {connecting ? 'Connecting...' : 'Connect to Gateway'}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Token from: <code className="text-aurora-400">~/.clawdbot/clawdbot.json</code> → gateway.auth.token
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard gatewayConfig={gatewayConfig} />
      case 'customers': return <Customers />
      case 'inbox': return <Inbox />
      case 'tasks': return <Tasks />
      case 'issue-dive': return <IssueDive />
      case 'chat': return <Chat gatewayConfig={gatewayConfig} />
      default: return <Dashboard gatewayConfig={gatewayConfig} />
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
