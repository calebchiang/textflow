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
import { Calendar } from '@/components/ui/calendar'
import TemplatesModalContent from '@/components/campaigns/TemplatesModalContent'

interface AddCampaignModalProps {
  open: boolean
  onClose: () => void
  onCampaignCreated: () => void
}

interface List {
  id: string
  name: string
}

export default function AddCampaignModal({ open, onClose, onCampaignCreated }: AddCampaignModalProps) {
  const [step, setStep] = useState(1)
  const [showTemplates, setShowTemplates] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [lists, setLists] = useState<List[]>([])
  const [sendToAll, setSendToAll] = useState<boolean>(true)
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [sendNow, setSendNow] = useState(true)
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      fetchLists()
    }
  }, [open])

  const fetchLists = async () => {
    const res = await fetch('/api/lists/get')
    const data = await res.json()
    if (res.ok) {
      setLists(data.lists)
    }
  }

  const toggleListSelection = (listId: string) => {
    setSelectedLists((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    )
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleCreateCampaign = async () => {
    setLoading(true)

    const payload = {
      name: campaignName,
      message: messageContent,
      sendToAll,
      selectedLists,
      sendNow,
      scheduledDate: scheduledDate?.toISOString().split('T')[0],
      scheduledTime,
    }

    const res = await fetch('/api/campaigns/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      await onCampaignCreated()
      onClose()
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to create campaign')
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={step === 1 ? 'sm:max-w-4xl' : 'sm:max-w-md'}>
        <DialogHeader>
          <DialogTitle>
            {showTemplates ? 'Choose a Template' : 'Create New Campaign'}
          </DialogTitle>
        </DialogHeader>

        {/* Template Selection View */}
        {showTemplates ? (
          <TemplatesModalContent
            onBack={() => setShowTemplates(false)}
            onSelectTemplate={(message) => {
              setMessageContent(message)
              setShowTemplates(false)
            }}
          />
        ) : (
          <>
            {/* Step 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-zinc-700">Campaign Name</label>
                    <Input
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="e.g., July Promo Blast"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-zinc-700">Message Content</label>
                    <textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Your promotional message here..."
                      rows={5}
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTemplates(true)}
                      className="mt-2 px-4 py-1.5 text-sm font-medium text-zinc-800 border border-zinc-300 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors w-fit"
                    >
                      Choose Template
                    </button>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-zinc-700">Send to:</label>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="all"
                        name="audience"
                        checked={sendToAll}
                        onChange={() => setSendToAll(true)}
                      />
                      <label htmlFor="all" className="text-sm text-zinc-700">All Contacts</label>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="radio"
                        id="lists"
                        name="audience"
                        checked={!sendToAll}
                        onChange={() => setSendToAll(false)}
                      />
                      <label htmlFor="lists" className="text-sm text-zinc-700">Send to Lists</label>
                    </div>

                    {!sendToAll && (
                      <div className="flex flex-col gap-1 mt-2">
                        <p className="text-xs text-zinc-500">Select Lists</p>
                        {lists.map((list) => (
                          <div key={list.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={list.id}
                              checked={selectedLists.includes(list.id)}
                              onChange={() => toggleListSelection(list.id)}
                            />
                            <label htmlFor={list.id} className="text-sm text-zinc-700">
                              {list.name}
                            </label>
                          </div>
                        ))}
                        {lists.length === 0 && (
                          <div className="text-sm text-zinc-500 mt-1">No lists yet.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <p className="text-sm font-medium text-zinc-700 mb-2">Preview:</p>
                  <div className="flex flex-col justify-center items-center border border-zinc-200 rounded-lg p-4 bg-zinc-50 h-64">
                    <div className="relative px-4 py-2 text-sm max-w-[70%] whitespace-pre-wrap break-words bg-green-500 text-white rounded-2xl message-sent">
                      {messageContent}
                      <div className="text-[10px] mt-1 text-right text-white/70">Now</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="py-4 flex flex-col gap-6">
                <p className="text-sm font-medium text-zinc-700">Schedule Campaign</p>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="sendNow"
                    name="schedule"
                    checked={sendNow}
                    onChange={() => setSendNow(true)}
                  />
                  <label htmlFor="sendNow" className="text-sm text-zinc-700">Send Now</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="scheduleLater"
                    name="schedule"
                    checked={!sendNow}
                    onChange={() => setSendNow(false)}
                  />
                  <label htmlFor="scheduleLater" className="text-sm text-zinc-700">Schedule for Later</label>
                </div>

                {!sendNow && (
                  <>
                    <div className="mt-2 flex justify-center">
                      <Calendar
                        mode="single"
                        required={false}
                        selected={scheduledDate || undefined}
                        onSelect={(date) => setScheduledDate(date ?? null)}
                      />
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-sm font-medium text-zinc-700">Select Time</label>
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {!showTemplates && (
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            {step === 1 ? (
              <Button
                disabled={!campaignName || !messageContent || (!sendToAll && selectedLists.length === 0)}
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                disabled={!sendNow && !scheduledDate}
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCreateCampaign}
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
            )}
          </DialogFooter>
        )}

        <style jsx>{`
          .message-sent {
            margin-right: 14px;
            border-bottom-right-radius: 0px !important;
          }
          .message-sent::before {
            content: '';
            position: absolute;
            bottom: -1px;
            right: -14px;
            width: 30px;
            height: 22px;
            background: #22c55e;
            border-bottom-left-radius: 22px 20px;
          }
          .message-sent::after {
            content: '';
            position: absolute;
            bottom: -1px;
            right: -14px;
            width: 14px;
            height: 22px;
            background: #f9fafb;
            border-bottom-left-radius: 18px 16px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
