import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    order: z.number(),
    lang: z.enum(['zh', 'en']).default('zh'),
  }),
})

export const collections = { docs }
