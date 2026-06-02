import { NextRequest, NextResponse } from 'next/server'

async function getExpectedToken(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_SECRET_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'كلمة السر غير صحيحة' }, { status: 401 })
    }

    const sessionToken = await getExpectedToken(adminPassword)

    // Set an HttpOnly secure cookie valid for 7 days
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
