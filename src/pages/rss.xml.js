import { formatBlogPosts } from '@/utils/formatBlogPosts'
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const allPosts = await getCollection('posts')
  const formattedPosts = formatBlogPosts(allPosts)

  return rss({
    title: "Roland's Frontend Stories",
    description:" Explore CSS, JavaScript, and frontend insights. Tips, techniques, and ideas for building accessible, modern web experiences.",
    site: context.site,
    trailingSlash: false,
    stylesheet: '/rss/styles.xsl',
    items: formattedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/frontend-stories/${post.id}`,
    })),
    customData: `<language>en-us</language>`,
  })
}
