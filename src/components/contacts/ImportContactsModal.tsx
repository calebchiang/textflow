'use client'

import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, Plus, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ImportContactsModalProps {
  open: boolean
  onClose: () => void
  onImportComplete: (newContacts: any[]) => void
}

interface Contact {
  phone_number: string
  first_name: string
  last_name: string
}

interface List {
  id: string
  name: string
}

export default function ImportContactsModal({ open, onClose, onImportComplete }: ImportContactsModalProps) {
  const [step, setStep] = useState(1)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [showAddListInput, setShowAddListInput] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [editingField, setEditingField] = useState<{ row: number; field: keyof Contact } | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    if (step === 2) fetchLists()
  }, [step])

  const fetchLists = async () => {
    const res = await fetch('/api/lists/get')
    const data = await res.json()
    if (res.ok) {
      setLists(data.lists)
      if (data.lists.length > 0 && !selectedList) {
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

  const normalizeHeader = (key: string): string => {
    const lower = key.trim().toLowerCase()
    if (['phone', 'phone number', 'number'].includes(lower)) return 'phone_number'
    if (['first', 'first name', 'fname'].includes(lower)) return 'first_name'
    if (['last', 'last name', 'lname'].includes(lower)) return 'last_name'
    return key.trim()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
        const rawRows = results.data as Record<string, string>[]

        const normalizePhone = (raw: string) => {
            const digits = raw.replace(/\D/g, '')
            return digits.length > 10 ? digits.slice(-10) : digits
        }

        const parsed = rawRows.map((row) => {
            const normalizedRow: Record<string, string> = {}
            for (const key in row) {
            const normalizedKey = normalizeHeader(key)
            normalizedRow[normalizedKey] = row[key]?.trim() || ''
            }

            return {
            phone_number: normalizePhone(normalizedRow.phone_number || ''),
            first_name: normalizedRow.first_name || '',
            last_name: normalizedRow.last_name || '',
            }
        })

        setContacts(parsed)
        setStep(2)
        },
        error: (err) => {
        console.error('CSV parsing error:', err)
        }
    })
    }

  const handleInlineChange = (value: string, row: number, field: keyof Contact) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === row ? { ...c, [field]: field === 'phone_number' ? value.replace(/\D/g, '') : value } : c))
    )
  }

  const handleImport = async () => {
    if (!selectedList || contacts.length === 0) return

    setIsImporting(true)
    try {
      const res = await fetch('/api/contacts/bulk-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts,
          list_id: selectedList,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to import contacts')
      }

      if (data.contacts && Array.isArray(data.contacts)) {
        onImportComplete(data.contacts)
        onClose()
        setStep(1)
        setContacts([])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Import error:', err)
      alert(`Failed to import contacts: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsImporting(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setContacts([])
    setEditingField(null)
    setShowAddListInput(false)
    setNewListName('')
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        resetModal()
        onClose()
      }
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="py-4 flex flex-col items-center gap-4 text-center">
            <Upload className="w-10 h-10 text-emerald-600" />
            <label htmlFor="file-upload" className="cursor-pointer text-emerald-600 hover:underline">
              Click to upload your CSV file
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <p className="text-sm text-zinc-500">Only .csv files are supported for now.</p>
          </div>
        )}

        {step === 2 && (
          <div className="py-2 space-y-4">
            <p className="text-sm text-zinc-700 font-medium">
              ✅ {contacts.length} contacts parsed successfully.
            </p>

            <div className="max-h-64 overflow-y-auto border rounded-md">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-100 text-zinc-600 font-medium sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Phone Number</th>
                    <th className="px-3 py-2">First Name</th>
                    <th className="px-3 py-2">Last Name</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr key={i} className="border-t last:border-b hover:bg-zinc-50">
                      {(['phone_number', 'first_name', 'last_name'] as (keyof Contact)[]).map((field) => {
                        const value = c[field]
                        const isInvalid = field === 'phone_number'
                          ? value.length !== 10
                          : !value

                        const isEditing = editingField?.row === i && editingField.field === field

                        return (
                          <td key={field} className="px-3 py-2">
                            {isEditing ? (
                              <Input
                                autoFocus
                                value={value}
                                onChange={(e) => handleInlineChange(e.target.value, i, field)}
                                onBlur={() => setEditingField(null)}
                                className="w-full text-sm"
                                placeholder={field === 'phone_number' ? '1234567890' : 'Enter'}
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                {value}
                                {isInvalid && (
                                  <button
                                    onClick={() => setEditingField({ row: i, field })}
                                    className="text-yellow-600"
                                    title="Click to edit"
                                  >
                                    <AlertTriangle className="w-4 h-4 cursor-pointer transition-transform duration-150 hover:scale-150" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
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
        )}
        <DialogFooter className="justify-start mt-4">
          <Button
            onClick={handleImport}
            disabled={!selectedList || isImporting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>

          <DialogClose asChild>
            <Button variant="ghost" className="ml-2">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}