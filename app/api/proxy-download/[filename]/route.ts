/**
 * Proxy Download API Endpoint
 *
 * Downloads PDF from Python backend and serves it to the frontend
 * This allows the frontend to download PDFs through Next.js API routes
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/proxy-download/[filename]
 * Downloads PDF from Python backend and streams it to client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params

    // Validate filename (security check)
    if (!filename || !filename.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    // Get backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

    // Download PDF from Python backend
    const backendResponse = await fetch(`${backendUrl}/download/${filename}`)

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: 'PDF not found' },
          { status: 404 }
        )
      }
      throw new Error(`Backend download failed: ${backendResponse.statusText}`)
    }

    // Get PDF blob from backend
    const pdfBlob = await backendResponse.blob()

    // Stream PDF to client with proper headers
    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Proxy Download] Error:', errorMessage)

    return NextResponse.json(
      { error: `Failed to download PDF: ${errorMessage}` },
      { status: 500 }
    )
  }
}
