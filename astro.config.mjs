// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import { readFileSync } from 'node:fs';

// 数据新鲜度：沿用抓取时间戳作为 sitemap 的 lastmod（本站在意「版本/下载数据更新时间」）
const { updatedAt } = JSON.parse(readFileSync(new URL('./src/data/last-fetch.json', import.meta.url), 'utf8'))

function remarkAdmonition() {
  return (tree) => {
    const out = []
    for (const node of tree.children) {
      if (node.type === 'paragraph' && node.children?.[0]?.value?.startsWith(':::')) {
        const text = node.children[0].value
        const m = text.match(/^::: ?(\w+)\n([\s\S]*?)\n:::$/)
        if (m) {
          out.push({
            type: 'containerDirective',
            name: m[1],
            children: [{ type: 'paragraph', children: [{ type: 'text', value: m[2].trim() }] }],
            data: { hName: 'div', hProperties: { class: `admonition ${m[1]}` } }
          })
          continue
        }
      }
      out.push(node)
    }
    tree.children = out
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.qomicex.top',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkAdmonition],
      rehypePlugins: [rehypeHeadingIds],
    }),
  },
  integrations: [
    react(),
    icon(),
    sitemap({
      // 仅保留真实内容页：docs/tutorial 下的页面是 meta-refresh 跳转桩（已加 noindex），
      // 收录它们会浪费抓取预算并稀释站点质量信号。
      filter: (page) => {
        const path = new URL(page).pathname
        return !/^\/(en\/)?(docs|tutorial)(\/|$)/.test(path)
      },
      serialize(item) {
        item.lastmod = new Date(updatedAt).toISOString()
        item.changefreq = 'weekly'
        // 首页优先级最高，其余内容页等同
        item.priority = new URL(item.url).pathname === '/' || new URL(item.url).pathname === '/en/'
          ? 1.0
          : 0.8
        return item
      },
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en',
        },
      },
    }),
  ],
});
