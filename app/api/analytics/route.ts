import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'غير مصرح لك بإتمام هذه العملية (ممنوع)' }, { status: 401 })
    }
    const [
      bookCount,
      tutorialCount,
      categoryCount,
      booksStats,
      tutorialsStats,
      topBooks,
      topTutorials
    ] = await Promise.all([
      prisma.book.count(),
      prisma.tutorial.count(),
      prisma.category.count(),
      prisma.book.aggregate({
        _sum: {
          viewCount: true,
          downloadCount: true
        }
      }),
      prisma.tutorial.aggregate({
        _sum: {
          viewCount: true
        }
      }),
      prisma.book.findMany({
        take: 5,
        orderBy: { downloadCount: 'desc' },
        include: { category: true }
      }),
      prisma.tutorial.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        include: { category: true }
      })
    ])

    const totalViews = (booksStats._sum.viewCount || 0) + (tutorialsStats._sum.viewCount || 0)
    const totalDownloads = booksStats._sum.downloadCount || 0

    return NextResponse.json({
      summary: {
        books: bookCount,
        tutorials: tutorialCount,
        categories: categoryCount,
        views: totalViews,
        downloads: totalDownloads
      },
      topBooks,
      topTutorials
    })
  } catch (error) {
    console.error('Failed to compile analytics:', error)
    return NextResponse.json(
      { error: 'Failed to compile analytics' },
      { status: 500 }
    )
  }
}
