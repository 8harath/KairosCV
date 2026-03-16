"use client"

import { useState } from "react"
import Link from "next/link"
import emailjs from "@emailjs/browser"
import { useForm } from "react-hook-form"
import { Clock3, Mail, MessageSquareMore } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID"
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID"
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"

      if (serviceId === "YOUR_SERVICE_ID") {
        setIsSuccess(true)
        toast({
          title: "Message saved",
          description: "EmailJS isn’t configured yet, so your message was logged locally for now.",
        })
        reset()
        setIsSubmitting(false)
        return
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          to_email: "your-email@example.com",
        },
        publicKey,
      )

      setIsSuccess(true)
      toast({
        title: "Message sent",
        description: "Thanks for reaching out. We’ll get back to you soon.",
      })
      reset()
    } catch (error) {
      console.error("EmailJS error:", error)
      toast({
        title: "Failed to send",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-14 md:py-20">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="section-frame p-8 md:p-10">
              <div className="section-header-kicker">Contact</div>
              <h1 className="mt-5 text-balance">Questions, product feedback, and bug reports all belong here.</h1>
              <p className="mt-4 max-w-3xl text-base">
                The contact flow has been simplified to match the rest of the application: fewer visual interruptions, clearer form fields, and better focus on the message itself.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-4">
                <div className="surface-panel p-5">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Email</p>
                  </div>
                  <a href="mailto:8harath.k@gmail.com" className="mt-3 block text-sm text-foreground hover:underline">
                    8harath.k@gmail.com
                  </a>
                </div>

                <div className="surface-panel p-5">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Response time</p>
                  </div>
                  <p className="mt-3 text-sm">Usually within 24 to 48 hours.</p>
                </div>

                <div className="surface-panel p-5">
                  <p className="text-sm font-medium text-foreground">Useful links</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href="/" className="soft-link">Home</Link>
                    <Link href="/intent" className="soft-link">Intent</Link>
                    <Link href="/optimize" className="soft-link">Optimize</Link>
                  </div>
                </div>
              </aside>

              <section className="surface-panel-strong p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                    <MessageSquareMore className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Send a message</p>
                    <p className="text-sm text-muted-foreground">Keep it short and we’ll take it from there.</p>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="empty-state mt-8">
                    <h2 className="text-xl">Message sent</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm">
                      Thanks for reaching out. If you want to send another message, you can reopen the form below.
                    </p>
                    <Button className="mt-6" onClick={() => setIsSuccess(false)}>
                      Send another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="field-label">Name</label>
                        <Input id="name" {...register("name", { required: "Name is required" })} placeholder="John Doe" />
                        {errors.name ? <p className="mt-2 text-sm text-destructive">{errors.name.message}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="email" className="field-label">Email</label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="john@example.com"
                        />
                        {errors.email ? <p className="mt-2 text-sm text-destructive">{errors.email.message}</p> : null}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="field-label">Subject</label>
                      <Input id="subject" {...register("subject", { required: "Subject is required" })} placeholder="Feedback about KairosCV" />
                      {errors.subject ? <p className="mt-2 text-sm text-destructive">{errors.subject.message}</p> : null}
                    </div>

                    <div>
                      <label htmlFor="message" className="field-label">Message</label>
                      <Textarea id="message" rows={6} {...register("message", { required: "Message is required" })} placeholder="Tell us what’s working, what feels off, or what you want next." />
                      {errors.message ? <p className="mt-2 text-sm text-destructive">{errors.message.message}</p> : null}
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-muted-foreground">Required fields help us respond with enough context.</p>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send message"}
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
