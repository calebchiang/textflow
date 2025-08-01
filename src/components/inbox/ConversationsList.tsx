'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Conversation = {
  id: string
  contact_id: string
  created_at: string
  contacts: {
    first_name: string | null
    last_name: string | null
    phone_number: string
  }
}

interface Props {
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  onStartNewConversation: () => void
  onSelectConversation: (conv: Conversation) => void
  selectedConversation: Conversation | null
  loading: boolean
}

function getInitials(first: string | null, last: string | null) {
  if (first && last) return `${first[0]}${last[0]}`
  if (first) return `${first[0]}`
  return '?'
}

export default function ConversationsList({
  conversations,
  onStartNewConversation,
  onSelectConversation,
  selectedConversation,
  loading
}: Props) {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((conv) => {
    const { first_name, last_name, phone_number } = conv.contacts
    const query = search.toLowerCase()
    return (
      first_name?.toLowerCase().includes(query) ||
      last_name?.toLowerCase().includes(query) ||
      phone_number.includes(query)
    )
  })

  return (
    <aside className="w-full bg-white dark:bg-zinc-900 h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button
            title="Start new conversation"
            onClick={onStartNewConversation}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 animate-pulse"
            >
              <div className="w-9 h-9 rounded-full bg-zinc-200" />
              <div className="h-4 w-3/4 bg-zinc-200 rounded" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="text-sm text-center text-zinc-400 mt-4">No conversations yet.</p>
        ) : (
          filtered.map((conv) => {
            const contact = conv.contacts
            const fullName =
              [contact.first_name, contact.last_name].filter(Boolean).join(' ') ||
              contact.phone_number
            const initials = getInitials(contact.first_name, contact.last_name)

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-zinc-100 dark:border-zinc-800',
                  conv.id === selectedConversation?.id
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                )}
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                  {initials}
                </div>
                <p className="text-sm font-medium">{fullName}</p>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
