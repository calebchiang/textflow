'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface Contact {
  id: string
  phone_number: string
  first_name: string | null
  last_name: string | null
}

interface AddConversationModalProps {
  open: boolean
  onClose: () => void
  onNewConversation: (convo: any) => void
}

export default function AddConversationModal({
  open,
  onClose,
  onNewConversation,
}: AddConversationModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [recipient, setRecipient] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep(1)
    setRecipient('')
    setSelectedContact(null)
    setMessage('')
    setErrorMsg(null)

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
  }, [open])

  const filteredContacts = recipient.trim()
    ? contacts.filter((c) => {
        const query = recipient.toLowerCase()
        return (
          c.first_name?.toLowerCase().includes(query) ||
          c.last_name?.toLowerCase().includes(query) ||
          c.phone_number.includes(query)
        )
      })
    : []

  const handleSelect = (contact: Contact) => {
    setSelectedContact(contact)
    setStep(2)
    setErrorMsg(null)
  }

  const handleSend = async () => {
    if (!message.trim() || !selectedContact) return

    try {
      setLoading(true)
      setErrorMsg(null)

      const res = await fetch('/api/conversations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_id: selectedContact.id,
          message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errStr = String(data?.error || '')
        // Show a hazard banner for unverified TFN
        if (errStr === 'NUMBER_NOT_VERIFIED' || errStr.toLowerCase().includes('not verified')) {
          setErrorMsg('You must verify your Toll-Free number before sending messages.')
        } else {
          console.error('Failed to send message:', errStr || 'Unknown error')
        }
        return
      }

      // Build contact object into returned conversation for UI update
      const newConvo = {
        id: data.conversation_id,
        contact_id: selectedContact.id,
        created_at: new Date().toISOString(),
        contacts: selectedContact,
      }

      onNewConversation(newConvo)
      onClose()
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        {/* Hazard banner for unverified number */}
        {errorMsg && (
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
            <span>
              {errorMsg}{' '}
              <a href="/numbers/verify" className="underline text-amber-800 hover:text-amber-900">
                Verify here
              </a>
              .
            </span>
          </div>
        )}

        {step === 1 && (
          <>
            <div className="py-2 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 w-10 shrink-0">To:</label>
                <Input
                  placeholder="Enter name or phone number"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value)
                    setSelectedContact(null)
                    setErrorMsg(null)
                  }}
                />
              </div>
            </div>

            {filteredContacts.length > 0 && !selectedContact && (
              <div className="flex-grow border rounded-md my-2 overflow-y-auto">
                {filteredContacts.map((c) => {
                  const name = [c.first_name, c.last_name].filter(Boolean).join(' ')
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className={cn(
                        'px-3 py-2 hover:bg-zinc-100 cursor-pointer border-b last:border-b-0 text-sm'
                      )}
                    >
                      <p className="font-medium">{name || c.phone_number}</p>
                      {name && <p className="text-zinc-500 text-xs">{c.phone_number}</p>}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {step === 2 && selectedContact && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-zinc-600">
              To:{' '}
              <span className="font-medium">
                {[selectedContact.first_name, selectedContact.last_name]
                  .filter(Boolean)
                  .join(' ') || selectedContact.phone_number}
              </span>
            </p>
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
