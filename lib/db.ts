import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  var prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | undefined

function getPrismaClient(): PrismaClient {
  if (global.prisma) {
    return global.prisma
  }
  if (prismaInstance) {
    return prismaInstance
  }

  const connectionString = process.env.DATABASE_URL

  // During Next.js build / prerendering on platforms like Netlify, DATABASE_URL might not be set.
  // We postpone throwing the error until an actual query is executed.
  if (!connectionString) {
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        throw new Error(
          `DATABASE_URL environment variable is not set. Cannot access prisma.${String(prop)}`
        )
      },
    })
  }

  const pool = new Pool({
    connectionString,
    max: 2, // limit connection pool size in serverless environments to prevent EMAXCONNSESSION
    idleTimeoutMillis: 15000, // automatically close idle connections after 15 seconds to free up resources
    connectionTimeoutMillis: 5000,
    ssl: { rejectUnauthorized: false },
  })

  const adapter = new PrismaPg(pool)
  prismaInstance = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaInstance
  }

  return prismaInstance
}

// Export a Proxy that lazily delegates all properties to the actual client instance
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop)
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
