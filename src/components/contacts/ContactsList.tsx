'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Filter, ChevronDown, UserPlus, Upload } from 'lucide-react'

interface Contact {
  id: string
  phone_number: string
  first_name: string
  last_name: string
  created_at: string
  lists?: {
    name: string
  } | null
}

interface ContactsListProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onAddManual: () => void
  onImport: () => void 
}

const ITEMS_PER_PAGE = 20

export default function ContactsList({ contacts, onEdit, onAddManual, onImport }: ContactsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter((c) => {
    const fullName = `${c.first_name ?? ''} ${c.last_name ?? ''}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  function formatPhoneNumber(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    }
    if (digits.length === 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    }
    return raw
  }

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search contacts by name..."
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1)
            setSearchTerm(e.target.value)
          }}
          className="w-full max-w-xs rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Add Contact
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={onAddManual}
                className="flex cursor-pointer items-center gap-2"
              >
                <UserPlus className="h-4 w-4 text-zinc-500" />
                Manual Add
              </DropdownMenuItem>
             <DropdownMenuItem
              onClick={onImport}
              className="flex cursor-pointer items-center gap-2"
            >
              <Upload className="h-4 w-4 text-zinc-500" />
              Import
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
            <Filter className="h-4 w-4" />
            Filter by
          </button>
        </div>
      </div>

      <table className="min-w-full divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        <thead className="bg-zinc-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Phone Number</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">First Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Last Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">List</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Date Added</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {paginatedContacts.map((contact, index) => (
            <tr
              key={contact.id}
              onClick={() => onEdit(contact)}
              className={`cursor-pointer hover:bg-zinc-50 ${index % 2 === 1 ? 'bg-zinc-50' : ''}`}
            >
              <td className="px-4 py-3 text-sm text-zinc-800">
                {formatPhoneNumber(contact.phone_number)}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-800">{contact.first_name || '-'}</td>
              <td className="px-4 py-3 text-sm text-zinc-800">{contact.last_name || '-'}</td>
              <td className="px-4 py-3 text-sm text-zinc-800">{contact.lists?.name || '-'}</td>
              <td className="px-4 py-3 text-sm text-zinc-600">
                {format(new Date(contact.created_at), 'MMM d, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500 mb-12">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2 mb-12">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
