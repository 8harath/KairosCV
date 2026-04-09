export default function DashboardLoading() {
  return (
    <main className="container py-10">
      {/* Header row */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-36 animate-pulse rounded-md bg-secondary" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-secondary" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-secondary" />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-panel p-5 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-8 w-12 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-32 animate-pulse rounded bg-secondary" />
          </div>
        ))}
      </div>

      {/* Recent resumes panel */}
      <div className="mt-6 surface-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
        </div>
        <div className="divide-y divide-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-secondary" />
                <div className="space-y-1.5">
                  <div className="h-4 w-48 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <div className="h-7 w-7 animate-pulse rounded-md bg-secondary" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
