import { type NextRequest, NextResponse } from "next/server"

interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()
    const { name, email, subject, message } = body

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Send an email using a service like SendGrid, Resend, or Mailgun
    // 2. Store the contact message in a database
    // 3. Send a confirmation email to the user
    // 4. Notify the team about the new message

    // Mock response
    const contactData = {
      success: true,
      message: "Thank you for reaching out! We'll get back to you soon.",
      submittedAt: new Date().toISOString(),
      ticketId: `TICKET-${Date.now()}`,
      data: {
        name,
        email,
        subject,
        message,
      },
    }

    return NextResponse.json(contactData, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
