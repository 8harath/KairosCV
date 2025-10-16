export default function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-white/80 dark:bg-slate-950/80 z-50">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-transparent dark:border-slate-700 dark:border-t-transparent" />
    </div>
  )
}


