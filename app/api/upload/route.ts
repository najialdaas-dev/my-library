import { NextRequest, NextResponse } from 'next/server'
import { uploadToSupabase, getSignedUploadUrl } from '@/lib/supabase'

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

// Threshold for using direct upload (10MB) - increased to reduce issues
const DIRECT_UPLOAD_THRESHOLD = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  console.log('=== Upload endpoint called ===')
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string || 'books' // 'books' or 'covers' or 'thumbnails'

    console.log('File info:', { name: file?.name, size: file?.size, folder })

    if (!file) {
      console.log('Error: No file provided')
      return NextResponse.json({ error: 'لم يتم تحديد أي ملف للرفع' }, { status: 400 })
    }

    // Security: Validate file extension
    const originalName = file.name
    const fileExtension = originalName.substring(originalName.lastIndexOf('.')).toLowerCase()

    // Allowed extensions for books, images, and videos (MP4, WEBM, OGG, MOV)
    const allowedExtensions = ['.pdf', '.epub', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.ogg', '.mov']
    if (!allowedExtensions.includes(fileExtension)) {
      console.log('Error: Invalid file extension:', fileExtension)
      return NextResponse.json({ error: 'صيغة الملف غير مدعومة لأسباب أمنية' }, { status: 400 })
    }

    // Security: Validate size limit (max 50MB for books, max 5MB for images, max 150MB for videos)
    const maxBookSize = 50 * 1024 * 1024 // 50MB
    const maxImageSize = 5 * 1024 * 1024 // 5MB
    const maxVideoSize = 150 * 1024 * 1024 // 150MB
    if (folder === 'books' && file.size > maxBookSize) {
      console.log('Error: Book file too large:', file.size)
      return NextResponse.json({ error: 'حجم ملف الكتاب يتجاوز الحد الأقصى المسموح به (50 ميجابايت)' }, { status: 400 })
    }
    if ((folder === 'covers' || folder === 'thumbnails') && file.size > maxImageSize) {
      console.log('Error: Image file too large:', file.size)
      return NextResponse.json({ error: 'حجم الصورة يتجاوز الحد الأقصى المسموح به (5 ميجابايت)' }, { status: 400 })
    }
    if (folder === 'videos' && file.size > maxVideoSize) {
      console.log('Error: Video file too large:', file.size)
      return NextResponse.json({ error: 'حجم الفيديو يتجاوز الحد الأقصى المسموح به (150 ميجابايت)' }, { status: 400 })
    }

    console.log(`Uploading file: ${originalName}, size: ${file.size} bytes, folder: ${folder}`)

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
    const fileName = `${prefix}-${uniqueSuffix}${fileExtension}`

    // Get content type for the file
    const contentType = CONTENT_TYPES[fileExtension] || 'application/octet-stream'

    // Get bucket name from folder
    const bucketMap: Record<string, string> = {
      books: 'books',
      covers: 'images',
      thumbnails: 'images',
      images: 'images',
      videos: 'videos',
    }
    const bucket = bucketMap[folder] || folder

    // Use direct upload for large files (>10MB) to avoid server timeout
    if (file.size > DIRECT_UPLOAD_THRESHOLD) {
      console.log(`Using direct upload for large file: ${fileName}`)

      try {
        const { signedUrl, path } = await getSignedUploadUrl(bucket, fileName)

        console.log('Signed URL generated successfully')
        return NextResponse.json({
          success: true,
          useDirectUpload: true,
          signedUrl,
          path,
          bucket,
          fileName: file.name,
          fileSize: file.size,
          contentType,
        })
      } catch (signedUrlError) {
        console.error('Error getting signed URL:', signedUrlError)
        // Fallback to server upload if signed URL fails
        console.log('Falling back to server upload')
      }
    }

    // For small files, upload via server
    console.log(`Using server upload for small file: ${fileName}`)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log(`Starting upload to Supabase: ${fileName}`)

    // Upload to Supabase Storage (cloud) instead of local filesystem
    const fileUrl = await uploadToSupabase(folder, fileName, buffer, contentType)

    console.log(`Upload successful: ${fileUrl}`)

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
    })
  } catch (error) {
    console.error('Error during file upload:', error)
    const message = error instanceof Error ? error.message : 'حدث خطأ أثناء رفع وحفظ الملف في السيرفر'
    console.error('Error message to return:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
