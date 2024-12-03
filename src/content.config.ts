import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

// Define a `loader` and `schema` for each collection
const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().max(65, { message: 'Title cannot be longer than 65 characters' }),
    pubDate: z.date(),
    description: z
      .string()
      .max(165, { message: 'Description cannot be longer than 165 characters' }),
    author: z.string().optional(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    isDraft: z.boolean().optional(),
    tags: z.array(z.string()),
  }),
})

// Export a single `collections` object to register your collection(s)
export const collections = { posts }
