'use client'

type View = 'dashboard' | 'customers' | 'inbox' | 'tasks' | 'issue-dive' | 'chat'

interface SidebarProps {
  currentView: View
  setCurrentView: (view: View) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'inbox', label: 'Inbox', icon: '📥' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'issue-dive', label: 'Issue Dive', icon: '🔍' },
  { id: 'chat', label: 'Chat', icon: '💬' },
] as const

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🌅</span>
          <span>Aurora Hub</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">CSM Command Center</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              currentView === item.id
                ? 'bg-aurora-600/20 text-aurora-400 border border-aurora-600/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Actions */}
      <div className="border-t border-gray-800 pt-4 mt-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Quick Actions</div>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <span>⚡</span>
          <span>New Task</span>
          <kbd className="ml-auto text-xs bg-gray-800 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <span>🔍</span>
          <span>Quick Lookup</span>
          <kbd className="ml-auto text-xs bg-gray-800 px-1.5 py-0.5 rounded">⌘/</kbd>
        </button>
      </div>

      {/* Status */}
      <div className="border-t border-gray-800 pt-4 mt-4">
        <div className="flex items-center gap-2 px-2 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-gray-400">Gateway Connected</span>
        </div>
      </div>
    </aside>
  )
}
