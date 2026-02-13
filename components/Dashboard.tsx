'use client'

// VIP customers - ticket counts from Google Sheet (updated 2026-02-12)
// TODO: Fetch dynamically from gateway → Google Sheets
const vipCustomers = [
  { name: 'CareCo', tickets: 0, mmcStatus: 'healthy', lastContact: 'Today' },
  { name: 'Callloom', tickets: 3, mmcStatus: 'warning', lastContact: '2/10' },
  { name: 'Chiirp', tickets: 1, mmcStatus: 'at-risk', lastContact: '3/24/25' },
  { name: 'RetellAi', tickets: 3, mmcStatus: 'healthy', lastContact: '2/2' },
  { name: 'Screen Magic', tickets: 5, mmcStatus: 'warning', lastContact: '2/9' },
  { name: 'Simplii', tickets: 5, mmcStatus: 'warning', lastContact: '1/18' },
  { name: 'iFaxApp', tickets: 2, mmcStatus: 'healthy', lastContact: '1/28' },
  { name: '42Chat', tickets: 2, mmcStatus: 'at-risk', lastContact: '12/18' },
  { name: 'Mango Voice', tickets: 5, mmcStatus: 'at-risk', lastContact: '1/16' },
  { name: 'Redo', tickets: 5, mmcStatus: 'warning', lastContact: '2/7' },
  { name: 'Jobble', tickets: 0, mmcStatus: 'healthy', lastContact: 'N/A' },
  { name: 'Palate Connect', tickets: 0, mmcStatus: 'healthy', lastContact: 'N/A' },
  { name: 'GetScaled', tickets: 0, mmcStatus: 'healthy', lastContact: 'N/A' },
  { name: 'Grupo Bimbo', tickets: 0, mmcStatus: 'healthy', lastContact: 'N/A' },
  { name: 'General Atomics', tickets: 0, mmcStatus: 'healthy', lastContact: 'N/A' },
  { name: 'IVR Technologies', tickets: 0, mmcStatus: 'healthy', lastContact: 'N/A' },
  { name: 'Automentor', tickets: 0, mmcStatus: 'warning', lastContact: 'N/A' },
]

const mmcStatusColors: Record<string, string> = {
  'healthy': 'bg-green-500/20 text-green-400 border-green-500/30',
  'warning': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'at-risk': 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function Dashboard() {
  const totalTickets = vipCustomers.reduce((sum, c) => sum + c.tickets, 0)
  const atRiskCount = vipCustomers.filter(c => c.mmcStatus === 'at-risk').length
  const warningCount = vipCustomers.filter(c => c.mmcStatus === 'warning').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Good evening, Ben 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={totalTickets} icon="🎫" color="blue" />
        <StatCard label="VIP Customers" value={vipCustomers.length} icon="👥" color="purple" />
        <StatCard label="At Risk" value={atRiskCount} icon="⚠️" color="red" />
        <StatCard label="Needs Attention" value={warningCount} icon="👀" color="yellow" />
      </div>

      {/* VIP Customer Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">VIP Customers</h2>
        <div className="grid grid-cols-3 gap-4">
          {vipCustomers.map((customer) => (
            <CustomerCard key={customer.name} customer={customer} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem
              icon="📧"
              text="Email from Ryan @ Automentor"
              time="2 hours ago"
            />
            <ActivityItem
              icon="🎫"
              text="New ticket from Chiirp"
              time="4 hours ago"
            />
            <ActivityItem
              icon="💬"
              text="Slack mention in #messaging-inquiries"
              time="5 hours ago"
            />
            <ActivityItem
              icon="📞"
              text="Call with Callloom completed"
              time="Yesterday"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Upcoming</h3>
          <div className="space-y-3">
            <CalendarItem
              title="Sync with RetellAi"
              time="Tomorrow, 10:00 AM"
              type="meeting"
            />
            <CalendarItem
              title="Chiirp QBR Prep"
              time="Friday, 2:00 PM"
              type="task"
            />
            <CalendarItem
              title="MMC Review - Automentor"
              time="Next Monday"
              type="deadline"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    red: 'bg-red-500/10 border-red-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
  }
  
  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </div>
  )
}

function CustomerCard({ customer }: { customer: typeof vipCustomers[0] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white">{customer.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${mmcStatusColors[customer.mmcStatus]}`}>
          {customer.mmcStatus === 'healthy' ? '✓ Healthy' : customer.mmcStatus === 'warning' ? '⚡ Warning' : '⚠️ At Risk'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>🎫 {customer.tickets} tickets</span>
        <span>📅 {customer.lastContact}</span>
      </div>
    </div>
  )
}

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

function CalendarItem({ title, time, type }: { title: string; time: string; type: string }) {
  const typeIcons = { meeting: '📅', task: '✅', deadline: '⏰' }
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{typeIcons[type as keyof typeof typeIcons]}</span>
      <div className="flex-1">
        <p className="text-sm text-white">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}
