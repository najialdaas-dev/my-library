import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // بناء الـ where clause
    const where: Prisma.BookWhereInput = { active: true }
    
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
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    // Pagination
    const skip = (page - 1) * limit

    // جلب البيانات
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
    ])

    return NextResponse.json({
      data: books,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST - إضافة كتاب جديد (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const book = await prisma.book.create({
      data: {
        title: body.title,
        slug: body.slug.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileSize: parseInt(body.fileSize || '10485760'), // default 10MB
        categoryId: body.categoryId,
        coverImage: body.coverImage || null,
        author: body.author || 'المهندس ناجي الدّعاس',
        difficulty: body.difficulty || 'Intermediate',
        tags: body.tags || [],
      },
      include: { category: true },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}

// DELETE - حذف كتاب (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'مُعرف الكتاب مطلوب لإتمام العملية' }, { status: 400 })
    }

    await prisma.book.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'تم حذف الكتاب بنجاح' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ error: 'فشل حذف الكتاب من قاعدة البيانات' }, { status: 500 })
  }
}
