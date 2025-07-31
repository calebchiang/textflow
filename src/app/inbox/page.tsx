'use client'

import { useState, useEffect } from 'react'
import ConversationsList from '@/components/inbox/ConversationsList'
import ConversationView from '@/components/inbox/ConversationView'
import AddConversationModal from '@/components/inbox/AddConversationModal'

export default function InboxPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <div className="mt-6 flex h-[calc(100vh-4rem)] w-full rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="w-[30%] border-r border-zinc-200 bg-white">
          <ConversationsList
            conversations={conversations}
            setConversations={setConversations}
            onStartNewConversation={() => setShowAddModal(true)}
            onSelectConversation={(conv) => setSelectedConversation(conv)}
            selectedConversation={selectedConversation}
            loading={loading}
          />
        </div>
        <div className="w-[70%]">
          <ConversationView conversation={selectedConversation} />
        </div>
      </div>

      {showAddModal && (
        <AddConversationModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onNewConversation={(newConvo) => {
            setConversations((prev) => [newConvo, ...prev])
            setSelectedConversation(newConvo)
          }}
        />
      )}
    </main>
  )
}
