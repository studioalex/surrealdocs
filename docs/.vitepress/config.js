import { defineConfig } from 'vitepress'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

const links = []

export default defineConfig({
  lang: 'en-US',
  title: 'SurrealDB Tutorials',
  description: 'SurrealDB Tutorials.',
  appearance: true,
  lastUpdated: true,
  base: '/surrealdocs/',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Tutorials', link: '/tutorials/getting_started' },
      { text: 'GitHub', link: 'https://github.com/studioalex/surrealdocs' }
    ],
    sidebar: {
      '/tutorials/': sidebarTutorials()
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Alexander Sedeke'
    },
  },
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        // you might need to change this if not using clean urls mode
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
      })
  },
  buildEnd: ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: 'https://studioalex.github.io/surrealdocs/' })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
  }
})

function sidebarTutorials() {
  return [
    {
      text: 'Tutorials',
      items: [
        { text: 'Welcome', link: '/tutorials/getting_started' },
        { text: 'How to use signin and signup', link: '/tutorials/signin_and_signup' },
        { text: 'How Scopes works', link: '/tutorials/scopes' },
        { text: 'Storage', link: '/tutorials/storage' },
      ]
    }
  ]
}
