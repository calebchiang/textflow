import { MessageCircle } from 'lucide-react'

export default function ConversationView() {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center text-zinc-500 animate-fadeIn">
      <MessageCircle className="w-10 h-10 mb-2" />
      <p className="text-sm">No conversation selected</p>
    </div>
  )
}