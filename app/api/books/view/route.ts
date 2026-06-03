import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'مُعرف الكتاب مطلوب' }, { status: 400 })
    }

    const book = await prisma.book.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, viewCount: book.viewCount })
  } catch (error) {
    console.error('Failed to increment book views:', error)
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 })
  }
}
