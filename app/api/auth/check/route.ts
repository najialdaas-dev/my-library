import { NextRequest, NextResponse } from 'next/server'

async function getExpectedToken(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session')
  const adminPassword = process.env.ADMIN_SECRET_PASSWORD

  if (!sessionCookie || !adminPassword) {
    return NextResponse.json({ isAdmin: false })
  }

  const expectedToken = await getExpectedToken(adminPassword)
  const isAdmin = sessionCookie.value === expectedToken

  return NextResponse.json({ isAdmin })
}
