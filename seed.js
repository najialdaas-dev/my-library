const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Clean existing data
  await prisma.download.deleteMany({});
  await prisma.view.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.tutorial.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Cleaned old database records.');

  // Create Categories
  const webDev = await prisma.category.create({
    data: {
      name: 'تطوير الويب',
      slug: 'web-development',
      description: 'كتب وشروحات حول HTML, CSS, JavaScript, React و Next.js',
      color: '#3B82F6',
      icon: '💻',
    },
  });

  const ai = await prisma.category.create({
    data: {
      name: 'الذكاء الاصطناعي',
      slug: 'artificial-intelligence',
      description: 'تعلم تعلم الآلة، علم البيانات، والشبكات العصبية',
      color: '#8B5CF6',
      icon: '🤖',
    },
  });

  const security = await prisma.category.create({
    data: {
      name: 'الأمن السيبراني',
      slug: 'cybersecurity',
      description: 'حماية الشبكات، اختبار الاختراق، والتشفير',
      color: '#EF4444',
      icon: '🛡️',
    },
  });

  console.log('Seeded 3 categories.');

  // Create Books
  await prisma.book.createMany({
    data: [
      {
        title: 'دليل Next.js الشامل',
        slug: 'nextjs-comprehensive-guide',
        description: 'احترف بناء تطبيقات الويب الحديثة باستخدام Next.js 14 و React',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
        fileUrl: 'https://example.com/books/nextjs-guide.pdf',
        fileName: 'nextjs-guide.pdf',
        fileSize: 10485760, // 10MB
        categoryId: webDev.id,
        author: 'المهندس ناجي الدّعاس',
        difficulty: 'Intermediate',
        language: 'Arabic',
        tags: ['nextjs', 'react', 'programming'],
        featured: true,
        active: true,
        downloadCount: 154,
        viewCount: 432,
      },
      {
        title: 'أساسيات الذكاء الاصطناعي والتعلم الآلي',
        slug: 'ai-ml-fundamentals',
        description: 'مدخل مبسط ومفصل للمبتدئين لفهم تقنيات تعلم الآلة والشبكات العصبية',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80',
        fileUrl: 'https://example.com/books/ai-fundamentals.pdf',
        fileName: 'ai-fundamentals.pdf',
        fileSize: 15728640, // 15MB
        categoryId: ai.id,
        author: 'د. أحمد علي',
        difficulty: 'Beginner',
        language: 'Arabic',
        tags: ['ai', 'machine-learning', 'python'],
        featured: true,
        active: true,
        downloadCount: 89,
        viewCount: 245,
      },
      {
        title: 'اختبار الاختراق الأخلاقي المتقدم',
        slug: 'advanced-ethical-hacking',
        description: 'تعلم أساليب الهجوم والدفاع المتقدمة لحماية البنية التحتية للمؤسسات',
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
        fileUrl: 'https://example.com/books/ethical-hacking.pdf',
        fileName: 'ethical-hacking.pdf',
        fileSize: 25165824, // 24MB
        categoryId: security.id,
        author: 'م. خالد عمر',
        difficulty: 'Advanced',
        language: 'Arabic',
        tags: ['security', 'hacking', 'linux'],
        featured: false,
        active: true,
        downloadCount: 201,
        viewCount: 612,
      },
    ],
  });

  console.log('Seeded 3 books.');

  // Create Tutorials
  await prisma.tutorial.createMany({
    data: [
      {
        title: 'بناء نظام تعليقات فوري باستخدام Next.js و Supabase',
        slug: 'build-realtime-comments-nextjs-supabase',
        description: 'في هذا الشرح سنقوم ببناء نظام تعليقات فوري يستخدم ميزة Realtime في Supabase مع Next.js App Router',
        content: 'ابدأ بتهيئة قاعدة البيانات في Supabase وقم بإنشاء جدول التعليقات. بعد ذلك، استخدم مكتبة Supabase client للاتصال بالقناة والاستماع لحدث INSERT الجديد لتحديث واجهة المستخدم فورياً...',
        thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
        categoryId: webDev.id,
        author: 'م. ناجي الدعاس',
        difficulty: 'Intermediate',
        estimatedTime: 25,
        tags: ['nextjs', 'supabase', 'realtime'],
        featured: true,
        active: true,
        viewCount: 840,
      },
      {
        title: 'مقدمة في حماية تطبيقات React من هجمات XSS',
        slug: 'react-xss-protection-intro',
        description: 'تعرف على ثغرة Cross-Site Scripting وكيف تضمن ألا تقع تطبيقات React فريسة لها',
        content: 'تقوم React بشكل افتراضي بالهروب التلقائي للقيم المعروضة لمنع XSS، ولكن استخدام dangerouslySetInnerHTML يفتح الباب مجدداً. سنتعلم كيف نستخدم DOMPurify لتعقيم المحتوى المدخل...',
        thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
        categoryId: security.id,
        author: 'م. خالد عمر',
        difficulty: 'Beginner',
        estimatedTime: 15,
        tags: ['react', 'security', 'xss'],
        featured: false,
        active: true,
        viewCount: 310,
      },
    ],
  });

  console.log('Seeded 2 tutorials.');
  console.log('Seed database completed successfully! 🎉');
  
  await pool.end();
}

main().catch((err) => {
  console.error('Error during seed:', err);
  pool.end();
  process.exit(1);
});
