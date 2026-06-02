import { createClient } from '@supabase/supabase-js'

// Lazy initialization of Supabase client to avoid build-time errors
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY are required.')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Map upload folder names to Supabase Storage buckets and paths
type FolderMapping = {
  bucket: string
  prefix: string // subfolder inside the bucket
}

const FOLDER_MAP: Record<string, FolderMapping> = {
  books:      { bucket: 'books',  prefix: '' },
  covers:     { bucket: 'images', prefix: 'covers' },
  thumbnails: { bucket: 'images', prefix: 'thumbnails' },
  images:     { bucket: 'images', prefix: '' },
  videos:     { bucket: 'videos', prefix: '' },
}

/**
 * Ensure a storage bucket exists. Creates it if not found.
 */
async function ensureBucket(bucketName: string) {
  const supabase = getSupabaseClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === bucketName)

  if (!exists) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 157286400, // 150MB max
    })
    // Ignore all bucket creation errors - if bucket already exists or has issues,
    // we'll get a clearer error during the actual upload
    if (error && !error.message.includes('already exists') && !error.message.includes('BucketAlreadyExists')) {
      console.warn(`Warning: Could not create bucket ${bucketName}: ${error.message}`)
    }
  }
}

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToSupabase(
  folder: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseClient()
  const mapping = FOLDER_MAP[folder] || { bucket: folder, prefix: '' }

  // Auto-create bucket if needed
  await ensureBucket(mapping.bucket)

  // Build the full storage path
  const storagePath = mapping.prefix
    ? `${mapping.prefix}/${fileName}`
    : fileName

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(mapping.bucket)
    .upload(storagePath, buffer, {
      contentType,
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    })

  if (uploadError) {
    // Provide more helpful error messages
    if (uploadError.message.includes('row-level security') || uploadError.message.includes('RLS')) {
      throw new Error(`سياسات الأمان (RLS) تمنع رفع الملفات إلى "${mapping.bucket}". يرجى تعطيل RLS على هذا الـ bucket في Supabase Dashboard: Storage > اختر الـ bucket > Policies > تعطيل RLS`)
    }
    if (uploadError.message.includes('size') || uploadError.message.includes('Size')) {
      throw new Error(`حجم الملف يتجاوز الحد الأقصى المسموح به في مساحة التخزين "${mapping.bucket}". يرجى التحقق من إعدادات حجم الملف في Supabase Dashboard أو تقليل حجم الملف.`)
    }
    if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
      throw new Error(`مساحة التخزين "${mapping.bucket}" غير موجودة. يرجى إنشاؤها يدوياً في Supabase Dashboard.`)
    }
    throw new Error(`فشل رفع الملف إلى التخزين السحابي: ${uploadError.message}`)
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(mapping.bucket)
    .getPublicUrl(storagePath)

  return urlData.publicUrl
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteFromSupabase(publicUrl: string): Promise<void> {
  const supabase = getSupabaseClient()
  // Extract bucket and path from URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const url = new URL(publicUrl)
  const pathParts = url.pathname.split('/storage/v1/object/public/')
  if (pathParts.length < 2) return

  const [bucket, ...rest] = pathParts[1].split('/')
  const filePath = rest.join('/')

  if (bucket && filePath) {
    await supabase.storage.from(bucket).remove([filePath])
  }
}

/**
 * Get a signed upload URL for direct client-to-Supabase upload.
 * This is better for large files as it bypasses server timeout limits.
 */
export async function getSignedUploadUrl(
  bucket: string,
  fileName: string
): Promise<{ signedUrl: string; path: string }> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(fileName, {
      upsert: false,
    })

  if (error) {
    throw new Error(`فشل إنشاء رابط الرفع الموقّع: ${error.message}`)
  }

  return {
    signedUrl: data.signedUrl,
    path: data.path,
  }
}
