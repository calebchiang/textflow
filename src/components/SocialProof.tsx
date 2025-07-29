'use client'

import Image from 'next/image'

export default function SocialProof() {
  return (
    <section className="bg-zinc-50 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-8">
          Trusted by businesses like
        </p>
        <div className="flex flex-wrap justify-center items-center gap-24">
          <Image
            src="/logos/three_ships_logo.webp"
            alt="Three Ships Beauty"
            width={120}
            height={40}
            className="object-contain h-10 w-auto"
          />
          <Image
            src="/logos/tentree.png"
            alt="Tentree"
            width={120}
            height={40}
            className="object-contain h-15 w-auto"
          />
          <Image
            src="/logos/lulu.webp"
            alt="Lululemon"
            width={120}
            height={40}
            className="object-contain h-25 w-auto"
          />
          <Image
            src="/logos/onyx_logo.png"
            alt="Onyx Coffee"
            width={120}
            height={40}
            className="object-contain h-25 w-auto"
          />
          <Image
            src="/logos/shopify.png"
            alt="shopify"
            width={120}
            height={40}
            className="object-contain h-30 w-auto"
          />
        </div>
      </div>
    </section>
  )
}
