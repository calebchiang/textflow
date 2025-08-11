'use client'

import { AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

type Props = {
  number: string
  status?: 'unverified' | 'in_review' | 'approved' | 'rejected' | string
  className?: string
  onVerify?: () => void
}

export default function PhoneNumberInfo({ number, status = 'unverified', className, onVerify }: Props) {
  const isUnverified = status === 'unverified'

  return (
    <Card className={clsx('w-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-800">
          Your Business Number: <span className="font-medium">{number}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {isUnverified && (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
            <div className="text-left text-sm text-amber-800">
              <p className="font-medium">Toll-Free number not verified.</p>
              <p className="text-amber-900/90">
                You can’t send messages until verification is complete.{' '}
                <Button
                  variant="link"
                  className="px-0 text-amber-900 underline cursor-pointer"
                  onClick={onVerify ?? (() => { window.location.href = '/numbers/verify' })}
                >
                  Verify here
                </Button>
                .
              </p>
            </div>
          </div>
        )}

        {!isUnverified && (
          <p className="text-left text-sm text-zinc-700">
            Your Toll-Free number is verified and ready to send messages.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
