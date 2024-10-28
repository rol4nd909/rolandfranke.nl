import { defineCollection, reference, z } from 'astro:content'

const tags = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    icon: z.string().refine((icon) => icon.startsWith('icon')),
  }),
})

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().max(65, { message: 'Title cannot be longer than 65 characters' }),
      description: z
        .string()
        .max(165, { message: 'Description cannot be longer than 165 characters' }),
      image: image().optional(),
      pubDate: z.date(),
      tags: z.array(reference('tags')),
      isDraft: z.boolean().optional(),
    }),
})

export const collections = { tags, posts }
