import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resourceId, resourceType } = body

    // Save download event to database
    await prisma.download.create({
      data: {
        resourceId,
        resourceType,
      },
    })

    // Update download or view counter in target table
    if (resourceType === 'book') {
      await prisma.book.update({
        where: { id: resourceId },
        data: { downloadCount: { increment: 1 } },
      })
    } else if (resourceType === 'tutorial') {
      await prisma.tutorial.update({
        where: { id: resourceId },
        data: { viewCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to track download:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
