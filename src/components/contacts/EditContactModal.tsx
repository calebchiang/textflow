'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Contact {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  created_at: string
  list_id?: string
}

interface List {
  id: string
  name: string
}

interface EditContactModalProps {
  open: boolean
  contact: Contact
  onClose: () => void
  onSave: (updated: Contact) => void
}

export default function EditContactModal({
  open,
  contact,
  onClose,
  onSave,
}: EditContactModalProps) {
  const [firstName, setFirstName] = useState(contact.first_name)
  const [lastName, setLastName] = useState(contact.last_name)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const [lists, setLists] = useState<List[]>([])
  const [selectedList, setSelectedList] = useState<string | null>(contact.list_id ?? null)
  const [newListName, setNewListName] = useState('')
  const [showAddListInput, setShowAddListInput] = useState(false)

  useEffect(() => {
    setFirstName(contact.first_name)
    setLastName(contact.last_name)
    setSelectedList(contact.list_id ?? null)
    fetchLists()
    formatPhone(contact.phone_number)
  }, [contact])

  const fetchLists = async () => {
    const res = await fetch('/api/lists/get')
    const data = await res.json()
    if (res.ok) {
      setLists(data.lists)
    }
  }

  const handleCreateList = async () => {
    if (!newListName) return
    const res = await fetch('/api/lists/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newListName }),
    })
    const data = await res.json()
    if (res.ok) {
      setLists((prev) => [...prev, data.list])
      setSelectedList(data.list.id)
      setNewListName('')
      setShowAddListInput(false)
    }
  }

  const formatPhone = (phone: string) => {
    const raw = phone.replace(/\D/g, '').slice(0, 10)
    let formatted = raw
    if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`
    }
    setPhoneNumber(formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const limited = raw.slice(0, 10)

    let formatted = limited
    if (limited.length > 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
    } else if (limited.length > 3) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3)}`
    }

    setPhoneNumber(formatted)
  }

  const handleSubmit = async () => {
    setLoading(true)

    const res = await fetch('/api/contacts/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: contact.id,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber.replace(/\D/g, ''),
        list_id: selectedList,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      onSave(data.contact)
    } else {
      console.error(data.error || 'Failed to update contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">First Name</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Last Name</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <Input
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={12}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Assign to List</label>
            <Select value={selectedList ?? ''} onValueChange={(val) => setSelectedList(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddListInput(!showAddListInput)}
              className="mt-2 w-fit gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add List
            </Button>

            {showAddListInput && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="New list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button onClick={handleCreateList}>Add</Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
