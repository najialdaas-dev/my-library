import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: Prisma.TutorialWhereInput = { active: true }
    if (categoryId) {
      // Find category by slug
      const category = await prisma.category.findUnique({
        where: { slug: categoryId }
      })
      if (category) {
        where.categoryId = category.id
      } else {
        where.categoryId = categoryId
      }
    }
    if (difficulty) where.difficulty = difficulty
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * limit

    const [tutorials, total] = await Promise.all([
      prisma.tutorial.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tutorial.count({ where }),
    ])

    return NextResponse.json({
      data: tutorials,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching tutorials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tutorials' },
      { status: 500 }
    )
  }
}

// POST - إضافة شرح جديد (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Auto-generate videoId from youtube URL if present
    let videoId = body.videoId || null
    if (body.videoUrl && !videoId) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = body.videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    }

    const tutorial = await prisma.tutorial.create({
      data: {
        title: body.title,
        slug: body.slug.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        content: body.content,
        thumbnail: body.thumbnail || null,
        videoUrl: body.videoUrl || null,
        videoId: videoId,
        categoryId: body.categoryId,
        author: body.author || 'المهندس ناجي الدّعاس',
        difficulty: body.difficulty || 'Intermediate',
        tags: body.tags || [],
        estimatedTime: parseInt(body.estimatedTime || '15'),
      },
      include: { category: true },
    })

    return NextResponse.json(tutorial, { status: 201 })
  } catch (error) {
    console.error('Error creating tutorial:', error)
    return NextResponse.json(
      { error: 'Failed to create tutorial' },
      { status: 500 }
    )
  }
}

// DELETE - حذف شرح (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'مُعرف الشرح مطلوب لإتمام العملية' }, { status: 400 })
    }

    await prisma.tutorial.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'تم حذف الشرح بنجاح' })
  } catch (error) {
    console.error('Error deleting tutorial:', error)
    return NextResponse.json({ error: 'فشل حذف الشرح من قاعدة البيانات' }, { status: 500 })
  }
}
