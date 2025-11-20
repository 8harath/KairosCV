"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import { useForm } from "react-hook-form"
import emailjs from "@emailjs/browser"
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
      // EmailJS configuration
      // NOTE: Replace these with your actual EmailJS credentials
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID"
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID"
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"

      // For demo purposes, if credentials aren't set, just show success
      if (serviceId === "YOUR_SERVICE_ID") {
        console.log("Contact form submission:", data)
        setIsSuccess(true)
        toast({
          title: "Message sent! (Demo mode)",
          description: "Your message has been logged. Set up EmailJS credentials for real email sending.",
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
          to_email: "your-email@example.com", // Replace with your email
        },
        publicKey
      )

      setIsSuccess(true)
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      })
      reset()
    } catch (error) {
      console.error("EmailJS error:", error)
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-12 animate-in fade-in">
            <h1 className="mb-4">Contact Us</h1>
            <div className="w-24 h-1 bg-primary"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="mb-4">Get in Touch</h3>
                <p className="text-base text-muted-foreground mb-6">
                  Have questions, feedback, or suggestions? We&apos;d love to hear from you.
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-sm font-bold uppercase mb-1">EMAIL</h3>
                    <a href="mailto:hello@kairoscv.app" className="text-base hover:text-primary transition-colors">
                      hello@kairoscv.app
                    </a>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-sm font-bold uppercase mb-1">RESPONSE TIME</h3>
                    <p className="text-base text-muted-foreground">24-48 hours</p>
                  </div>
                </div>
              </div>

              <div className="border-3 border-primary p-6 bg-secondary">
                <h3 className="text-lg font-bold mb-2 uppercase">QUICK LINKS</h3>
                <div className="space-y-2">
                  <Link href="/" className="block text-sm hover:text-primary transition-colors">
                    → HOME
                  </Link>
                  <Link href="/intent" className="block text-sm hover:text-primary transition-colors">
                    → INTENT
                  </Link>
                  <Link href="/optimize" className="block text-sm hover:text-primary transition-colors">
                    → OPTIMIZE
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 uppercase">SEND A MESSAGE</h2>

              {isSuccess ? (
                <div className="border-3 border-primary p-6 bg-primary text-primary-foreground text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold mb-2 uppercase">MESSAGE SENT!</h3>
                  <p className="mb-4">We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-background text-foreground border-2 border-background px-4 py-2 font-bold text-sm uppercase hover:bg-secondary transition-all"
                  >
                    SEND ANOTHER
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold uppercase mb-2">
                      NAME *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full border-3 border-primary px-4 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold uppercase mb-2">
                      EMAIL *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full border-3 border-primary px-4 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold uppercase mb-2">
                      SUBJECT *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      {...register("subject", { required: "Subject is required" })}
                      className="w-full border-3 border-primary px-4 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Feedback about KairosCV"
                    />
                    {errors.subject && (
                      <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold uppercase mb-2">
                      MESSAGE *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register("message", { required: "Message is required" })}
                      className="w-full border-3 border-primary px-4 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Your message here..."
                    />
                    {errors.message && (
                      <p className="text-destructive text-xs mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Required fields
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t-3 border-primary pt-8">
            <h3 className="text-xl font-bold mb-4 uppercase">FREQUENTLY ASKED</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-3 border-primary p-4">
                <h4 className="font-bold mb-2 text-sm uppercase">Is it really free?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! KairosCV is completely free to use, no hidden costs or subscriptions.
                </p>
              </div>
              <div className="border-3 border-primary p-4">
                <h4 className="font-bold mb-2 text-sm uppercase">How do you handle data?</h4>
                <p className="text-sm text-muted-foreground">
                  We process your resume and delete all data after download. No storage.
                </p>
              </div>
              <div className="border-3 border-primary p-4">
                <h4 className="font-bold mb-2 text-sm uppercase">Can I suggest features?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! Use the form above to share your ideas.
                </p>
              </div>
              <div className="border-3 border-primary p-4">
                <h4 className="font-bold mb-2 text-sm uppercase">Report bugs?</h4>
                <p className="text-sm text-muted-foreground">
                  Please do! We&apos;re in beta and your feedback helps us improve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
