# EmailJS Setup Guide

This guide will help you set up EmailJS for the contact form in KairosCV.

## Steps

### 1. Create an EmailJS Account
- Visit [EmailJS.com](https://www.emailjs.com/)
- Sign up for a free account
- Verify your email address

### 2. Create an Email Service
- Log in to your EmailJS dashboard
- Click on "Email Services" in the sidebar
- Click "Add New Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the instructions to connect your email
- Copy the **Service ID** (you'll need this later)

### 3. Create an Email Template
- Click on "Email Templates" in the sidebar
- Click "Create New Template"
- Use this template structure:

```
Subject: {{subject}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}
```

- Save the template
- Copy the **Template ID**

### 4. Get Your Public Key
- Click on "Account" in the sidebar
- Find your **Public Key** (also called API Key)
- Copy it

### 5. Configure Your Local Environment
- Copy `.env.local.example` to `.env.local`
- Add your credentials:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 6. Update the Recipient Email
- Open `app/contact/page.tsx`
- Find line with `to_email: "your-email@example.com"`
- Replace with your actual email address

### 7. Test the Contact Form
- Run `pnpm dev`
- Navigate to `/contact`
- Fill out and submit the form
- Check your email for the message

## Demo Mode

If you don't configure EmailJS, the contact form will still work in "demo mode" - it will log messages to the console instead of sending emails. This is useful for development and testing.

## Troubleshooting

### Emails not sending?
- Check your EmailJS dashboard for error logs
- Verify all three credentials are correct
- Make sure your email service is connected properly
- Check spam folder for test emails

### Rate Limits
- EmailJS free tier allows 200 emails/month
- For production, consider upgrading or implementing your own backend

## Production Deployment

When deploying to Render.com or other hosting platforms:

1. Add environment variables in your hosting platform's dashboard
2. Use the same variable names from `.env.local.example`
3. Keep your keys secure - never commit them to git!

## Alternative: Using Your Own Backend

If you prefer not to use EmailJS, you can replace the contact form with:
- Formspree
- SendGrid
- AWS SES
- Your own Node.js email API

The form is built with react-hook-form, so it's easy to swap out the email provider.
