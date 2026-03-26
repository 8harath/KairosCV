"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { useForm } from "react-hook-form"
import { CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
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
        toast({ title: "Message saved", description: "Contact form is not yet configured." })
        reset()
        return
      }

      await emailjs.send(serviceId, templateId, {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: "8harath.k@gmail.com",
      }, publicKey)

      setIsSuccess(true)
      toast({ title: "Message sent", description: "Thanks for reaching out." })
      reset()
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="container py-10 md:py-14">
          <div className="mx-auto max-w-lg">
            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Contact</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Questions, feedback, or bug reports.
            </p>

            {isSuccess ? (
              <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
                <p className="mt-3 text-sm font-medium text-foreground">Message sent</p>
                <p className="mt-1 text-sm text-muted-foreground">We'll get back to you soon.</p>
                <Button className="mt-4" variant="outline" onClick={() => setIsSuccess(false)}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                    <Input id="name" {...register("name", { required: "Required" })} placeholder="Jane Doe" />
                    {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Required",
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" },
                      })}
                      placeholder="jane@example.com"
                    />
                    {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                  <Input id="subject" {...register("subject", { required: "Required" })} placeholder="Feedback about KairosCV" />
                  {errors.subject ? <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p> : null}
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
                  <Textarea id="message" rows={5} {...register("message", { required: "Required" })} placeholder="What's on your mind?" />
                  {errors.message ? <p className="mt-1 text-xs text-destructive">{errors.message.message}</p> : null}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
