// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';

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
    icon(),
    sitemap({
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
