'use client'

import { useState } from 'react'

type TaskStatus = 'todo' | 'in-progress' | 'waiting' | 'done'

interface Task {
  id: string
  title: string
  customer?: string
  status: TaskStatus
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
}

const initialTasks: Task[] = [
  { id: '1', title: 'Follow up on Automentor renegotiation', customer: 'Automentor', status: 'todo', priority: 'high', dueDate: 'Today' },
  { id: '2', title: 'Check Chiirp TFN rejection', customer: 'Chiirp', status: 'in-progress', priority: 'high' },
  { id: '3', title: 'Prepare RetellAi QBR deck', customer: 'RetellAi', status: 'todo', priority: 'medium', dueDate: 'Friday' },
  { id: '4', title: 'Review Mango Voice call quality ticket', customer: 'Mango Voice', status: 'waiting', priority: 'medium' },
  { id: '5', title: 'Send Callloom billing analysis to Mike', customer: 'Callloom', status: 'done', priority: 'low' },
  { id: '6', title: 'Update customer tracker sheet', status: 'todo', priority: 'low' },
]

const columns: { id: TaskStatus; title: string; icon: string }[] = [
  { id: 'todo', title: 'To Do', icon: '📋' },
  { id: 'in-progress', title: 'In Progress', icon: '🔄' },
  { id: 'waiting', title: 'Waiting', icon: '⏳' },
  { id: 'done', title: 'Done', icon: '✅' },
]

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-500',
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showNewTask, setShowNewTask] = useState(false)

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400">Drag and drop to update status</p>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-aurora-600 hover:bg-aurora-500 text-white rounded-lg transition-colors"
        >
          <span>+</span>
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex flex-col"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span>{column.icon}</span>
                <h3 className="font-semibold text-white">{column.title}</h3>
              </div>
              <span className="text-sm text-gray-500">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasks
                .filter(t => t.status === column.id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(newStatus) => moveTask(task.id, newStatus)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <NewTaskModal onClose={() => setShowNewTask(false)} onAdd={(task) => {
          setTasks([...tasks, task])
          setShowNewTask(false)
        }} />
      )}
    </div>
  )
}

function TaskCard({ task, onMove }: { task: Task; onMove: (status: TaskStatus) => void }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className={`bg-gray-900 rounded-lg border border-gray-800 p-3 border-l-4 ${priorityColors[task.priority]} cursor-pointer hover:border-gray-700 transition-colors relative`}
      onClick={() => setShowMenu(!showMenu)}
    >
      <h4 className="text-sm font-medium text-white mb-2">{task.title}</h4>
      
      {task.customer && (
        <span className="inline-block text-xs px-2 py-0.5 bg-aurora-600/20 text-aurora-400 rounded mb-2">
          {task.customer}
        </span>
      )}
      
      {task.dueDate && (
        <p className="text-xs text-gray-500">📅 {task.dueDate}</p>
      )}

      {/* Quick Move Menu */}
      {showMenu && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 p-2">
          <p className="text-xs text-gray-500 mb-2 px-2">Move to:</p>
          {columns.filter(c => c.id !== task.status).map((col) => (
            <button
              key={col.id}
              onClick={(e) => { e.stopPropagation(); onMove(col.id); setShowMenu(false); }}
              className="w-full text-left px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors flex items-center gap-2"
            >
              <span>{col.icon}</span>
              <span>{col.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function NewTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Task) => void }) {
  const [title, setTitle] = useState('')
  const [customer, setCustomer] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')

  const handleSubmit = () => {
    if (!title) return
    onAdd({
      id: Date.now().toString(),
      title,
      customer: customer || undefined,
      status: 'todo',
      priority,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">New Task</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer (optional)</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="e.g., RetellAi"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Priority</label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${
                    priority === p
                      ? p === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : p === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-aurora-600 hover:bg-aurora-500 text-white rounded-lg transition-colors"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}
