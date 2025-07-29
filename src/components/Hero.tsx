'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { AuroraText } from '@/components/magicui/aurora-text'

export default function Hero() {
  return (
    <section className="relative bg-zinc-50 py-8 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          backgroundPosition: '-1px -1px',
          zIndex: 0,
        }}
      />

      {/* Radial fade */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(250, 250, 250, 0.5) 70%, rgba(250, 250, 250, 0.9) 100%)`,
          zIndex: 1,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-16">
        {/* Left side text */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-5xl font-bold text-zinc-900">
            Grow Your SMS List.<br className="hidden md:block" />
            Drive <AuroraText className="inline-block">More Sales</AuroraText>.
          </h1>

          <p className="mt-4 text-lg text-zinc-600">
            TextFlow helps businesses build their SMS list, send bulk campaigns, and automate growth.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-start justify-center gap-4">
            <Link
              href="/signup"
              className="bg-emerald-600 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-emerald-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/#book-demo"
              className="border border-emerald-600 text-emerald-600 bg-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-emerald-50 transition"
            >
              Book Demo
            </Link>
          </div>
        </div>

        {/* Right side images */}
        <div className="md:w-1/2 flex justify-center -space-x-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <Image
              src="/hero.png"
              alt="SMS promo example"
              width={500}
              height={280}
              className="w-full max-w-[500px] h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          >
            <Image
              src="/hero_2.png"
              alt="SMS promo example 2"
              width={500}
              height={280}
              className="w-full max-w-[500px] h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
