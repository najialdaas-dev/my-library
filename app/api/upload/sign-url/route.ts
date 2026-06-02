import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Content-type mapping for common file extensions
const CONTENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.epub': 'application/epub+zip',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
}

const FOLDER_MAP: Record<string, { bucket: string; prefix: string }> = {
  books:      { bucket: 'books',  prefix: '' },
  covers:     { bucket: 'images', prefix: 'covers' },
  thumbnails: { bucket: 'images', prefix: 'thumbnails' },
  images:     { bucket: 'images', prefix: '' },
  videos:     { bucket: 'videos', prefix: '' },
}

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileSize, folder } = await request.json()

    if (!fileName || !fileSize || !folder) {
      return NextResponse.json(
        { error: 'fileName, fileSize, and folder are required' },
        { status: 400 }
      )
    }

    // Security: Validate file extension
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
    const allowedExtensions = ['.pdf', '.epub', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.ogg', '.mov']
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'صيغة الملف غير مدعومة لأسباب أمنية' },
        { status: 400 }
      )
    }

    // Security: Validate size limit (max 50MB for books, max 5MB for images, max 150MB for videos)
    const maxBookSize = 50 * 1024 * 1024 // 50MB
    const maxImageSize = 5 * 1024 * 1024 // 5MB
    const maxVideoSize = 150 * 1024 * 1024 // 150MB

    if (folder === 'books' && fileSize > maxBookSize) {
      return NextResponse.json(
        { error: 'حجم ملف الكتاب يتجاوز الحد الأقصى المسموح به (50 ميجابايت)' },
        { status: 400 }
      )
    }
    if ((folder === 'covers' || folder === 'thumbnails') && fileSize > maxImageSize) {
      return NextResponse.json(
        { error: 'حجم الصورة يتجاوز الحد الأقصى المسموح به (5 ميجابايت)' },
        { status: 400 }
      )
    }
    if (folder === 'videos' && fileSize > maxVideoSize) {
      return NextResponse.json(
        { error: 'حجم الفيديو يتجاوز الحد الأقصى المسموح به (150 ميجابايت)' },
        { status: 400 }
      )
    }

    // Resolve bucket and folder prefix
    const mapping = FOLDER_MAP[folder] || { bucket: folder, prefix: '' }
    const bucket = mapping.bucket

    // Generate safe, sanitized and unique ASCII-only filename based on the folder type
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const prefixMap: Record<string, string> = {
      books: 'book',
      covers: 'cover',
      thumbnails: 'thumb',
      images: 'image',
      videos: 'video',
    }
    const prefix = prefixMap[folder] || 'file'
    const uniqueFileName = `${prefix}-${uniqueSuffix}${fileExtension}`
    
    const storagePath = mapping.prefix
      ? `${mapping.prefix}/${uniqueFileName}`
      : uniqueFileName

    const contentType = CONTENT_TYPES[fileExtension] || 'application/octet-stream'

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'SUPABASE_URL and SUPABASE_SERVICE_KEY are required' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate signed URL for upload (valid for 2 hours for slow networks)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(storagePath, {
        upsert: false,
      })

    if (error) {
      console.error('Error creating signed URL:', error)
      return NextResponse.json(
        { error: `فشل إنشاء رابط الرفع الموقّع: ${error.message}` },
        { status: 500 }
      )
    }

    // Construct the public URL using the server-side SUPABASE_URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      publicUrl,
      fileName: uniqueFileName,
      contentType,
    })
  } catch (error) {
    console.error('Error in sign-url endpoint:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إنشاء الرابط الموقّع' },
      { status: 500 }
    )
  }
}
