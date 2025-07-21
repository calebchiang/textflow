'use client'

import { useEffect, useState, useCallback } from 'react'
import ContactsOverview from '@/components/contacts/ContactsOverview'
import ContactsList from '@/components/contacts/ContactsList'
import EditContactModal from '@/components/contacts/EditContactModal'
import AddContactModal from '@/components/contacts/AddContactModal'
import ImportContactsModal from '@/components/contacts/ImportContactsModal'
import ContactsListSkeleton from '@/components/contacts/ContactsListSkeleton'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [editingContact, setEditingContact] = useState<any | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [filterType, setFilterType] = useState<'recent' | 'list'>('recent')
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [availableLists, setAvailableLists] = useState<string[]>([])

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts/get')
      const { contacts } = await res.json()
      setContacts(contacts)

      const listNames = Array.from(
        new Set(
          contacts
            .map((c: any) => c.lists?.name)
            .filter((name: string | null) => !!name)
        )
      )
      setAvailableLists(listNames as string[])
    } catch (err) {
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const newThisMonth = contacts.filter((c) => {
    if (!c.created_at) return false
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

  const handleImport = async (newContacts: any[]) => {
    const contactsWithDates = newContacts.map(contact => ({
      ...contact,
      created_at: contact.created_at || new Date().toISOString()
    }))
    setContacts((prev) => [...contactsWithDates, ...prev])
    setShowImportModal(false)
  }

  const filteredContacts =
    filterType === 'list' && selectedList
      ? contacts.filter((c) => c.lists?.name === selectedList)
      : contacts

  return (
    <main className="ml-60 flex min-h-screen flex-col items-start justify-start bg-zinc-50 px-4 text-zinc-800">
      <h1 className="mt-6 text-2xl font-semibold">Contacts</h1>
      <p className="mt-1 text-zinc-600">Manage your SMS list here.</p>

      <div className="mt-6 w-full">
        <ContactsOverview
          totalContacts={contacts.length}
          newThisMonth={newThisMonth}
        />
        {loading ? (
          <ContactsListSkeleton />
        ) : (
          <ContactsList
            contacts={filteredContacts}
            onEdit={setEditingContact}
            onAddManual={() => setShowAddModal(true)}
            onImport={() => setShowImportModal(true)}
            filterType={filterType}
            setFilterType={setFilterType}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            availableLists={availableLists}
          />
        )}
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

      {showImportModal && (
        <ImportContactsModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImport}
        />
      )}
    </main>
  )
}
