import { cookies } from 'next/headers'

/**
 * حساب قيمة الـ SHA-256 لكلمة المرور لمقارنتها بالتوكن المحفوظ في الكوكيز
 */
export async function getExpectedToken(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * التحقق مما إذا كان المستخدم الحالي مصادقاً كمسؤول (Admin) أم لا
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const adminPassword = process.env.ADMIN_SECRET_PASSWORD
    if (!adminPassword) {
      console.warn('ADMIN_SECRET_PASSWORD is not configured in environment variables.')
      return false
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    if (!sessionCookie) {
      return false
    }

    const expectedToken = await getExpectedToken(adminPassword)
    return sessionCookie.value === expectedToken
  } catch (error) {
    console.error('Error verifying admin authentication:', error)
    return false
  }
}
