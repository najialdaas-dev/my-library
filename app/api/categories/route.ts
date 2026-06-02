import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST - إضافة قسم جديد (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, color, icon } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'اسم القسم والرابط الفريد مطلوبان' }, { status: 400 })
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, '-')

    const category = await prisma.category.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || null,
        color: color || '#8a1228', // default Burgundy!
        icon: icon || '📚',
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'فشل إضافة القسم الجديد. قد يكون الاسم أو الرابط الفريد مستخدم بالفعل.' },
      { status: 500 }
    )
  }
}

// DELETE - حذف قسم (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'مُعرف القسم مطلوب لإتمام العملية' }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'تم حذف القسم بنجاح' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'فشل حذف القسم. تأكد من عدم وجود كتب أو شروحات مرتبطة به.' }, { status: 500 })
  }
}
