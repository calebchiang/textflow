'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export default function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [country, setCountry] = useState('')
  const [step, setStep] = useState(1)

  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [stateProv, setStateProv] = useState('')
  const [zip, setZip] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (country === 'canada') {
      await handleSubmit()
    } else {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    const payload =
      country === 'canada'
        ? { country }
        : {
            country,
            business_name: businessName,
            business_type: businessType,
            industry,
            website,
            street,
            city,
            state_prov: stateProv,
            zip,
            phone,
            email,
          }
          
    try {
      const res = await fetch('/api/user-profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to update profile')

      onClose()
    } catch (err) {
      console.error('Submission failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-[650px] overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-4">
          <Image
            src="/logo_4.png"
            alt="Logo"
            width={80}
            height={80}
            className="mb-4 rounded-xl"
          />
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-800 text-center w-full">
              Welcome to TextFlow 👋
            </DialogTitle>
          </DialogHeader>
        </div>

        {step === 1 ? (
          <>
            <div className="text-zinc-700 text-sm text-center">
              Let’s get your account set up and ready to go.
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-zinc-700 mb-2 text-center">
                Where is your business based?
              </label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canada">🇨🇦 Canada</SelectItem>
                  <SelectItem value="us">🇺🇸 United States</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6 flex justify-between gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Close</Button>
              </DialogClose>
             <Button onClick={handleNext} disabled={!country || loading}>
              {loading ? 'Submitting...' : country === 'canada' ? 'Submit' : 'Next'}
            </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="overflow-y-auto pr-2 h-[450px]">
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Business Name</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Business Type</label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="sole_prop">Sole Proprietor</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Industry Category</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Street Address</label>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">State/Province</label>
                  <Input value={stateProv} onChange={(e) => setStateProv(e.target.value)} />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">ZIP Code</label>
                  <Input value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-between gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
             <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !businessName ||
                !businessType ||
                !industry ||
                !street ||
                !city ||
                !stateProv ||
                !zip ||
                !phone ||
                !email
              }
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
