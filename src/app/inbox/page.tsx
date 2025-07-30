'use client'

import { useState } from 'react'
import ConversationsList from '@/components/inbox/ConversationsList'
import ConversationView from '@/components/inbox/ConversationView'
import AddConversationModal from '@/components/inbox/AddConversationModal'

export default function InboxPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Inbox</h1>
      <p className="mt-1 text-zinc-600">View and manage your SMS conversations here.</p>

      <div className="mt-6 flex h-[calc(100vh-8rem)] w-full rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="w-[30%] border-r border-zinc-200 bg-white">
          <ConversationsList onStartNewConversation={() => setShowAddModal(true)} />
        </div>
        <div className="w-[70%]">
          <ConversationView />
        </div>
      </div>

      {showAddModal && (
        <AddConversationModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </main>
  )
}
