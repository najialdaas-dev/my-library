import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/login', '/api/'],
    },
    sitemap: 'https://library.najialdaas.com/sitemap.xml',
  }
}
