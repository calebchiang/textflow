'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
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

interface ConversationsListProps {
  onStartNewConversation: () => void
}

export default function ConversationsList({ onStartNewConversation }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/conversations/get')
        const { conversations } = await res.json()
        setConversations(conversations)
      } catch (err) {
        console.error('Error fetching conversations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

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
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
         <button
          title="Start new conversation"
          onClick={onStartNewConversation}
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        {loading ? (
          <p className="text-sm text-center text-zinc-400 mt-4">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-center text-zinc-400 mt-4">No conversations yet.</p>
        ) : (
          filtered.map((conv) => {
            const contact = conv.contacts
            const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || contact.phone_number

            return (
              <div
                key={conv.id}
                className={cn(
                  'px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800'
                )}
              >
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-zinc-500">{contact.phone_number}</p>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
