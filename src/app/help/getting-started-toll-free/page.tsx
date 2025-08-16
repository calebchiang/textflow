'use client'

import HelpSidebar from '@/components/help/HelpSidebar'
import Image from 'next/image'

export default function GetTollFreePage() {
  const headers = [
    { id: 'create-account', text: 'Creating an Account', level: 2 },
    { id: 'get-number', text: 'Getting a Toll-Free Number', level: 2 },
  ]

  return (
    <main className="mx-auto max-w-6xl px-6 md:grid md:grid-cols-[1fr_200px] gap-8 mt-24">
      <div>
        <h1 className="text-4xl font-bold mb-6">
          Getting Started With a Toll Free Number
        </h1>
        <hr className="h-px bg-zinc-100 border-0 mb-12" />

        <article className="prose prose-zinc max-w-none">
          <h2 id="create-account" className="mt-12 mb-4 font-bold">Creating an Account</h2>
          <p>
            To get started, go to{' '}
            <a href="https://textflowapp.com/signup" target="_blank" rel="noopener noreferrer">
              textflowapp.com/signup
            </a>.
          </p>
          <p className="mt-2 font-medium">Sign up with either your:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Google account</li>
            <li>Email address</li>
          </ul>

          <Image
            src="/signup.png"
            alt="Screenshot of the TextFlow signup form"
            width={800}
            height={400}
            className="rounded-lg border max-w-md mx-auto"
          />
          <figcaption className="text-sm text-zinc-500 text-center">
            Choose between Google sign-in or email registration.
          </figcaption>

          <p className="mt-4">
            If you choose to sign up via <strong>Email</strong>, you must first check your
            inbox for a verification email and confirm before you can log in.
          </p>
          <p className="mt-4">
            Once you log in with your new account, you will be taken to your <span className="font-bold">dashboard.</span>
          </p>

          <h2 id="get-number" className="mt-12 mb-4 font-bold">Getting a Toll-Free Number</h2>
          <p>
            After creating your account, you can purchase a toll-free number directly
            inside your dashboard.
          </p>
          <p className="mt-4 mb-4">
            From your dashboard, click on the <span className="font-bold">Set Up My Phone Number</span> button.
          </p>

          <Image
            src="/dashboard-setup.png"
            alt="Screenshot of the dashboard highlighting the 'Set Up My Phone Number' button"
            width={900}
            height={500}
            className="rounded-lg border mx-auto"
          />
          <figcaption className="text-sm text-zinc-500 text-center">
            Dashboard view with the <span className="font-bold">Set Up My Phone Number</span> button highlighted.
          </figcaption>

          <p className="mt-6">
            Next, click on the <span className="font-bold">Search Available Numbers</span> button to see the list of available toll-free numbers.
          </p>

          <p className="mt-6 mb-4">
            Once you select the phone number you want, you will be taken to a <span className="font-bold">confirmation page</span> where you can see the number you are purchasing. 
            Select <span className="font-bold">Continue to Payment</span> and pay the <span className="font-bold">$4.99/month</span> fee. 
            After payment, the toll-free number will be yours.
          </p>

          <Image
            src="/confirmation.png"
            alt="Screenshot of the confirmation page with the 'Continue to Payment' button"
            width={900}
            height={500}
            className="rounded-lg border max-w-md mx-auto"
          />
          <figcaption className="text-sm text-zinc-500 text-center">
            Confirmation page showing the selected number and the <span className="font-bold">Continue to Payment</span> button.
          </figcaption>
        </article>
      </div>

      <HelpSidebar headers={headers} />
    </main>
  )
}
