import { NextRequest, NextResponse } from 'next/server'

async function getExpectedToken(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // قائمة بالـ User-Agents الممنوعة (السكريبتات التلقائية، بوتات الذكاء الاصطناعي الضارة، وأدوات الفحص)
  const blockedAgents = [
    'python',         // سكريبتات بايثون (requests, urllib, etc.)
    'curl',           // أداة curl
    'wget',           // أداة wget
    'urllib',         // مكتبة urllib في بايثون
    'scrapy',         // إطار عمل scrapy للكشط
    'aiohttp',        // مكتبة aiohttp في بايثون
    'httpie',         // أداة httpie
    'selenium',       // أداة أتمتة المتصفح
    'puppeteer',      // أداة أتمتة المتصفح
    'headlesschrome', // كروم بدون واجهة رسومية
    'gptbot',         // بوت تدريب OpenAI
    'claudebot',      // بوت تدريب Anthropic
    'perplexitybot',  // بوت Perplexity
    'cohere-ai',      // بوت Cohere AI
    'bytespider',     // بوت بايت دانس (تيك توك)
    'ccbot',          // Common Crawl bot
  ]

  const isBlocked = blockedAgents.some(agent => userAgent.includes(agent))
  
  if (isBlocked) {
    return new NextResponse(
      JSON.stringify({ error: 'Access Denied: Request blocked for security reasons.' }),
      { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }

  // Only protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('admin_session')
    const adminPassword = process.env.ADMIN_SECRET_PASSWORD

    if (!adminPassword) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const expectedToken = await getExpectedToken(adminPassword)

    // If no cookie or cookie doesn't match the hash, redirect to login
    if (!sessionCookie || sessionCookie.value !== expectedToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
}
