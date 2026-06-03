import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')
    const filename = searchParams.get('name') || 'download.pdf'

    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 })
    }

    // Fetch the file from the remote source (Supabase)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch file from remote source: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Return the response with Content-Disposition header to force attachment download.
    // We pass response.body (ReadableStream) directly to stream the file efficiently without memory overhead.
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Error during file download proxy:', error)
    return new NextResponse('Failed to process download', { status: 500 })
  }
}
