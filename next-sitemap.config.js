/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://localhost:3000',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/auth/*',
    '/messages/*',
    '/profile/*'
  ],
  additionalPaths: async (config) => [
    {
      loc: '/listings',
      changefreq: 'daily',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/about',
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/contact',
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/messages/', '/profile/']
      }
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://localhost:3000'}/listings-sitemap.xml`,
    ]
  }
}