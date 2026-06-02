const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- DATABASE DIAGNOSTIC REPORT ---');
  
  const categories = await prisma.category.findMany();
  console.log(`Categories found: ${categories.length}`);
  categories.forEach(c => console.log(` - ID: ${c.id} | Name: ${c.name} | Slug: ${c.slug}`));

  const booksCount = await prisma.book.count();
  console.log(`Books count: ${booksCount}`);

  const tutorialsCount = await prisma.tutorial.count();
  console.log(`Tutorials count: ${tutorialsCount}`);

  console.log('----------------------------------');
  await pool.end();
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  pool.end();
  process.exit(1);
});
