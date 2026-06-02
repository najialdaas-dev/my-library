import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType, bucket } = await request.json()

    if (!fileName || !contentType || !bucket) {
      return NextResponse.json(
        { error: 'fileName, contentType, and bucket are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'SUPABASE_URL and SUPABASE_SERVICE_KEY are required' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate signed URL for upload (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(fileName, {
        upsert: false,
      })

    if (error) {
      console.error('Error creating signed URL:', error)
      return NextResponse.json(
        { error: `Failed to create signed URL: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Error in sign-url endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
