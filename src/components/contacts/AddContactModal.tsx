'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddContactModalProps {
  open: boolean
  onClose: () => void
  onSave: (newContact: Contact) => void
}

interface Contact {
  id: string
  phone_number: string
  first_name: string
  last_name: string
  created_at: string
}

interface List {
  id: string
  name: string
}

export default function AddContactModal({ open, onClose, onSave }: AddContactModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const [lists, setLists] = useState<List[]>([])
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [newListName, setNewListName] = useState('')
  const [showAddListInput, setShowAddListInput] = useState(false)

  useEffect(() => {
    if (open) fetchLists()
  }, [open])

  const fetchLists = async () => {
    const res = await fetch('/api/lists/get')
    const data = await res.json()
    if (res.ok) {
      setLists(data.lists)
      if (data.lists.length > 0) {
        setSelectedList(data.lists[0].id)
      }
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
    if (!selectedList) return
    setLoading(true)

    const res = await fetch('/api/contacts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      setFirstName('')
      setLastName('')
      setPhoneNumber('')
      setSelectedList(null)
    } else {
      console.error(data.error || 'Failed to add contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="flex gap-2">
            <div className="flex-1 grid gap-2">
              <label className="text-sm font-medium text-zinc-700">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Required" />
            </div>
            <div className="flex-1 grid gap-2">
              <label className="text-sm font-medium text-zinc-700">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <Input
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="123 456 7890"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={12}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Assign to List</label>

            {lists.length > 0 ? (
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
            ) : (
              <div className="text-sm text-zinc-500">No lists yet.</div>
            )}

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
            disabled={loading || !firstName || phoneNumber.replace(/\D/g, '').length !== 10 || !selectedList}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Saving...' : 'Add Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
