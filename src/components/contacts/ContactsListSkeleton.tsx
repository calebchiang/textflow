export default function ContactsListSkeleton() {
  const rows = Array.from({ length: 6 })

  return (
    <div className="mt-6 w-full animate-pulse">
      <div className="h-8 w-48 rounded bg-zinc-200 mb-4" />

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="bg-zinc-100 grid grid-cols-5 gap-4 px-4 py-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-24 bg-zinc-300 rounded" />
          ))}
        </div>

        {rows.map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 px-4 py-4 border-t border-zinc-100"
          >
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="h-4 w-full max-w-[120px] bg-zinc-200 rounded"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 h-6 w-32 bg-zinc-200 rounded mb-12" />
    </div>
  )
}
