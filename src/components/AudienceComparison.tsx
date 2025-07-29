'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShineBorder } from '@/components/magicui/shine-border'
import { XCircle, CheckCircle } from 'lucide-react'

export default function AudienceComparison() {
  return (
    <section className="py-20 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Build an Audience You Own
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">
                Social Followers (Rented Audience)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">Instagram, TikTok, X, YouTube etc.</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">Complete reliance on algorithms that determine who see your content</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">No direct access to your audience</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">At the mercy of shadowbans and rules</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardHeader>
              <CardTitle className="text-lg text-green-600">
                SMS Subscribers (Owned Audience)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">98% open rates. Zero reliance on algorithms.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">You control the message and the timing</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">Build long-term customer relationships</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                <p className="text-sm text-zinc-700">Direct access to every subscriber</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}