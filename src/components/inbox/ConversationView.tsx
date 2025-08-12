'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

export default function ConversationView({ conversation }: { conversation: any }) {
  const [messages, setMessages] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) return

      setLoading(true)
      try {
        const res = await fetch('/api/messages/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: conversation.id }),
        })

        const { messages, userId } = await res.json()
        setMessages(messages)
        setUserId(userId)
      } catch (err) {
        console.error('Error fetching messages:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [conversation])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return
    setSending(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: newMessage.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Backend currently returns { error: string }
        // Check for the unverified case
        if (typeof data?.error === 'string' && data.error.toLowerCase().includes('not verified')) {
          setErrorMsg('You must verify your Toll-Free number before sending messages.')
        } else {
          console.error('Failed to send message:', data?.error || 'Unknown error')
        }
        return
      }

      if (data?.message) {
        setMessages((prev) => [...prev, data.message])
        setNewMessage('')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const name =
    [conversation?.contacts?.first_name, conversation?.contacts?.last_name]
      .filter(Boolean)
      .join(' ') || conversation?.contacts?.phone_number

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  const formatDateHeader = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
    }).format(date)
  }

  if (!conversation) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center text-zinc-500 animate-fadeIn">
        <MessageCircle className="w-10 h-10 mb-2" />
        <p className="text-sm">No conversation selected</p>
      </div>
    )
  }

  return (
    <>
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
          background: white;
          border-bottom-left-radius: 18px 16px;
        }
        .message-received {
          margin-left: 14px;
          border-bottom-left-radius: 0px !important;
        }
        .message-received::before {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -14px;
          width: 30px;
          height: 22px;
          background: #f4f4f5;
          border-bottom-right-radius: 22px 20px;
        }
        .message-received::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -14px;
          width: 14px;
          height: 22px;
          background: white;
          border-bottom-right-radius: 18px 16px;
        }
      `}</style>

      <div className="h-full flex flex-col bg-white animate-fadeIn">
        <div className="px-6 py-4 border-b border-zinc-200">
          <p className="text-md font-semibold">{name}</p>
          {conversation.contacts?.phone_number && (
            <p className="text-xs text-zinc-500">{conversation.contacts.phone_number}</p>
          )}
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={clsx('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}
              >
                <div className="rounded-2xl bg-zinc-200 h-5 w-1/2 max-w-[70%] px-4 py-2 animate-pulse" />
              </div>
            ))
          ) : (
            (() => {
              let lastDate = ''
              return messages.map((msg) => {
                const isUser = msg.sender_id === userId
                const msgDate = formatDateHeader(msg.created_at)
                const showDateHeader = msgDate !== lastDate
                lastDate = msgDate

                return (
                  <div key={msg.id}>
                    {showDateHeader && (
                      <div className="text-center text-xs text-zinc-600 mb-2 mt-4">
                        {msgDate}
                      </div>
                    )}
                    <div className={clsx('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
                      <div
                        className={clsx(
                          'relative px-4 py-2 text-sm max-w-[70%] whitespace-pre-wrap break-words',
                          isUser
                            ? 'bg-green-500 text-white rounded-2xl message-sent'
                            : 'bg-zinc-100 text-zinc-900 rounded-2xl message-received'
                        )}
                      >
                        <div>{msg.content}</div>
                        <div
                          className={clsx(
                            'text-[10px] mt-1 text-right',
                            isUser ? 'text-white/70' : 'text-zinc-500'
                          )}
                        >
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            })()
          )}
        </div>

        {/* hazard banner if number isn't verified */}
        {errorMsg && (
          <div className="mx-4 mb-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
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

        <div className="px-4 py-3 border-t border-zinc-200 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-zinc-100"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />
          <button
            className="text-green-500 hover:text-green-600 p-2 rounded-full"
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}
