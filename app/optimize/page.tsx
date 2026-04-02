import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { isAuthBypassed } from "@/lib/config/env"
import Header from "@/components/header"
import OptimizeClient from "@/components/optimize-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Optimize Resume | KairosCV",
  description: "Upload your resume and get AI-powered ATS optimization with KairosCV.",
}

export default async function OptimizePage() {
  const authBypassed = isAuthBypassed()

  if (!authBypassed) {
    const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }
  }

  return (
    <>
      <Header />
      <main className="container max-w-2xl py-10">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-foreground">Optimize</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a draft. We'll restructure, improve phrasing, and generate a clean PDF.
          </p>
        </div>
        <OptimizeClient authBypassed={authBypassed} />
      </main>
    </>
  )
}
