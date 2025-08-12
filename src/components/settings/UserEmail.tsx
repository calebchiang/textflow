'use client'

type Props = {
  email: string | null
  loading: boolean
}

export default function UserEmail({ email, loading }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">Email</label>
      <input
        type="text"
        value={
          loading
            ? ''
            : email ?? 'Not signed in'
        }
        readOnly
        disabled
        className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-800 placeholder:text-zinc-400"
        placeholder={loading ? 'Loading…' : undefined}
      />
    </div>
  )
}
