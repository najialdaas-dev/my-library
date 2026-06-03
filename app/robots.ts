import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/api/'],
      },
      // Block all known AI training crawlers and content scrapers
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'Anthropic-AI',
          'Google-Extended',
          'PerplexityBot',
          'cohere-ai',
          'Omgilibot',
          'Omgili',
          'FacebookBot',
          'Diffbot',
          'Bytespider',
          'ImagesiftBot',
          'Amazonbot',
          'CCBot',
        ],
        disallow: '/',
      }
    ],
    sitemap: 'https://library.najialdaas.com/sitemap.xml',
  }
}
