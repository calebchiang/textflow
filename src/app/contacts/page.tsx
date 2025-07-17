'use client'

import { useEffect, useState } from 'react'
import ContactsOverview from '@/components/contacts/ContactsOverview'
import ContactsList from '@/components/contacts/ContactsList'
import EditContactModal from '@/components/contacts/EditContactModal'
import AddContactModal from '@/components/contacts/AddContactModal'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [editingContact, setEditingContact] = useState<any | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts/get')
        const { contacts } = await res.json()
        setContacts(contacts)
      } catch (err) {
        console.error('Error fetching contacts:', err)
      }
    }

    fetchContacts()
  }, [])

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const newThisMonth = contacts.filter((c) => {
    const created = new Date(c.created_at)
    return (
      created.getMonth() === currentMonth && created.getFullYear() === currentYear
    )
  }).length

  const handleSave = (updatedContact: any) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    )
    setEditingContact(null)
  }

  const handleAdd = (newContact: any) => {
    setContacts((prev) => [newContact, ...prev])
    setShowAddModal(false)
  }

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Contacts</h1>
      <p className="mt-1 text-zinc-600">Manage your SMS list here.</p>

      <div className="mt-6 w-full">
        <ContactsOverview
          totalContacts={contacts.length}
          newThisMonth={newThisMonth}
        />
        <ContactsList contacts={contacts} onEdit={setEditingContact} onAddManual={() => setShowAddModal(true)} />
      </div>

      {editingContact && (
        <EditContactModal
          open={!!editingContact}
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSave={handleSave}
        />
      )}
      {showAddModal && (
      <AddContactModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
      />
    )}
    </main>
  )
}
