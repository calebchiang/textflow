'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Phone,
  ShieldCheck,
  Upload,
  CreditCard,
  Megaphone,
  MessageSquare,
} from 'lucide-react'

export default function HelpIndex() {
  const topics = [
    {
      title: 'Getting Started with a Toll-Free Number',
      description: 'Learn how to purchase and start using your toll-free number in TextFlow.',
      icon: Phone,
      href: '/help/getting-started-toll-free',
      iconBg: 'bg-emerald-600/10',
      iconColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500',
    },
    {
      title: 'Verifying Your Toll-Free Number',
      description: 'Step-by-step guide to verifying your toll-free number for compliant messaging.',
      icon: ShieldCheck,
      href: '/help/verifying-toll-free',
      iconBg: 'bg-indigo-600/10',
      iconColor: 'text-indigo-400',
      borderHover: 'hover:border-indigo-500',
    },
    {
      title: 'Importing Your Contacts',
      description: 'Import your contact list into TextFlow quickly and efficiently.',
      icon: Upload,
      href: '/help/importing-contacts',
      iconBg: 'bg-sky-600/10',
      iconColor: 'text-sky-400',
      borderHover: 'hover:border-sky-500',
    },
    {
      title: 'Buying SMS Credits',
      description: 'Purchase credits to start sending campaigns and messages.',
      icon: CreditCard,
      href: '/help/buying-sms-credits',
      iconBg: 'bg-amber-600/10',
      iconColor: 'text-amber-400',
      borderHover: 'hover:border-amber-500',
    },
    {
      title: 'Creating Your First Campaign',
      description: 'Build, schedule, and send your first SMS campaign with best-practice tips.',
      icon: Megaphone,
      href: '/help/creating-first-campaign',
      iconBg: 'bg-violet-600/10',
      iconColor: 'text-violet-400',
      borderHover: 'hover:border-violet-500',
    },
    {
      title: 'Auto-Replies & Keywords',
      description: 'Set up auto-replies and keywords to capture leads and route conversations.',
      icon: MessageSquare,
      href: '/help/auto-replies-keywords',
      iconBg: 'bg-rose-600/10',
      iconColor: 'text-rose-400',
      borderHover: 'hover:border-rose-500',
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Browse guides and FAQs to get the most from TextFlow.</h1>
        
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const Icon = topic.icon
            return (
              <Link key={topic.title} href={topic.href}>
                <Card className={`bg-zinc-800 border-zinc-700 ${topic.borderHover} transition-colors h-full`}>
                  <CardHeader className="space-y-3">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-lg ${topic.iconBg} ${topic.iconColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-zinc-100 text-lg">
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
