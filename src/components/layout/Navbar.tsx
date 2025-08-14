'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  ShieldCheck,
  Upload,
  CreditCard,
  Megaphone,
  MessageSquare,
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const helpRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!helpRef.current) return
      if (!helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false)
      }
    }
    if (helpOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [helpOpen])

  const shouldHide =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/campaigns') ||
    pathname.startsWith('/numbers') ||
    pathname.startsWith('/help') ||
    ['/login', '/signup', '/dashboard', '/contacts', '/inbox', '/settings'].includes(pathname)

  if (shouldHide) return null

  const helpItems = [
    {
      title: 'Getting Started with a Toll-Free Number',
      href: '/help/getting-started-toll-free',
      Icon: Phone,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Verifying Your Toll-Free Number',
      href: '/help/verifying-toll-free',
      Icon: ShieldCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Importing Your Contacts',
      href: '/help/importing-contacts',
      Icon: Upload,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      title: 'Buying SMS Credits',
      href: '/help/buying-sms-credits',
      Icon: CreditCard,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Creating Your First Campaign',
      href: '/help/creating-first-campaign',
      Icon: Megaphone,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      title: 'Auto-Replies & Keywords',
      href: '/help/auto-replies-keywords',
      Icon: MessageSquare,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  const navLinks = (
    <>
      {pathname === '/' && (
        <>
          <a href="#features" className="hover:text-emerald-600 transition-colors">
            Features
          </a>
          <a href="#testimonials" className="hover:text-emerald-600 transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">
            Pricing
          </a>
          <div className="relative" ref={helpRef}>
            <div className="flex items-center gap-1">
              <Link
                href="/help"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition-colors"
              >
                Help
              </Link>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={helpOpen}
                onClick={() => setHelpOpen(o => !o)}
                className="inline-flex items-center text-zinc-700 hover:text-emerald-600 transition-colors"
              >
                <ChevronDown size={16} className={`${helpOpen ? 'rotate-180' : ''} transition-transform`} />
              </button>
            </div>

            {helpOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-80 rounded-lg border border-zinc-200 bg-white shadow-xl ring-1 ring-black/5 z-50"
              >
                <ul className="py-2">
                  {helpItems.map(({ title, href, Icon, color, bg }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 hover:text-emerald-700 transition-colors"
                        onClick={() => setHelpOpen(false)}
                      >
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${bg}`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                        </span>
                        <span className="leading-tight">{title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {user ? (
        <Link
          href="/dashboard"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
        >
          Dashboard
        </Link>
      ) : (
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white/60 px-1 py-1 shadow-sm">
          <Link
            href="/login"
            className="px-3 py-1.5 text-zinc-700 hover:text-emerald-700 transition-colors"
          >
            <span className="font-semibold">Login</span>
          </Link>
          <Link
            href="/signup"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-50/90 backdrop-blur px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo_4.png"
              alt="Textflow Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
          </Link>
          <span className="text-lg font-bold text-zinc-800">TextFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-700">
          {navLinks}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-800 hover:text-emerald-600 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col space-y-3 pt-4 text-sm font-medium text-zinc-700">
          {pathname === '/' && (
            <>
              <a href="#features" className="hover:text-emerald-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="hover:text-emerald-600 transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="hover:text-emerald-600 transition-colors">
                Pricing
              </a>
              <Link
                href="/help"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition-colors"
              >
                Help
              </Link>
            </>
          )}

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex w-fit bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
            >
              Dashboard
            </Link>
          ) : (
            <div className="inline-flex w-fit items-center gap-1 rounded-lg border border-zinc-200 bg-white/60 px-1 py-1 shadow-sm">
              <Link
                href="/login"
                className="px-3 py-1.5 text-zinc-700 hover:text-emerald-700 transition-colors"
              >
                <span className="font-semibold">Login</span>
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
