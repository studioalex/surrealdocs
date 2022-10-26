import { defineConfig } from 'vitepress'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'
import { version } from '../../package.json'

const links = []

export default defineConfig({
  lang: 'en-US',
  title: 'SurrealDB Cookbook',
  description: 'SurrealDB Cookbook.',
  appearance: true,
  lastUpdated: true,
  base: '/',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting_started' },
      { text: 'Elements', link: '/elements/' },
      { text: 'Demo App', link: 'https://hora.studioalex.tech/demo/' },
      { text: 'Changelog', link: 'https://github.com/studioalex/hora/blob/main/README.md' },
      { text: 'GitHub', link: 'https://github.com/studioalex/hora' },
      { text: version }
    ],
    sidebar: {
      '/guide/': [{
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting_started' },
          { text: 'Items and Fields', link: '/guide/data_fields' },
          { text: 'Static header and fields', link: '/guide/static' },
          { text: 'Custom Data Rendering', link: '/guide/custom_data_rendering' },
          { text: 'Sorting', link: '/guide/sorting' },
          { text: 'Field Settings', link: '/guide/settings' },
          { text: 'Selection support', link: '/guide/selection_support' },
          { text: 'Details support', link: '/guide/details_support' },
          { text: 'Headline', link: '/guide/headline' },
          { text: 'Loading State', link: '/guide/loading_state' },
          { text: 'No Data State', link: '/guide/no_data_state' },
          { text: 'Styling options', link: '/guide/styling' },
          { text: 'Component reference', link: '/guide/definition_reference' },
        ]
      }]
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
    const sitemap = new SitemapStream({ hostname: 'https://hora.studioalex.tech/' })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
  }
})
