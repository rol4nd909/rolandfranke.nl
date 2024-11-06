import type { CollectionEntry } from 'astro:content'

type Props = {
  filterOutDrafts?: boolean
  filterOutFuturePosts?: boolean
  sortByDate?: boolean
  limit?: number
}

export const formatBlogPosts = (
  posts: CollectionEntry<'posts'>[],
  { filterOutDrafts = true, filterOutFuturePosts = true, sortByDate = true, limit }: Props = {}
): CollectionEntry<'posts'>[] => {
  const filteredPosts = posts.reduce<CollectionEntry<'posts'>[]>((acc, post) => {
    const { pubDate, isDraft } = post.data

    // filter out drafts if needed
    if (filterOutDrafts && isDraft) return acc

    // filter out future posts if needed
    if (filterOutFuturePosts && new Date(pubDate) > new Date()) return acc

    // add post to list
    acc.push(post)

    return acc
  }, [])

  // sort by date or randomize
  if (sortByDate) {
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.data.pubDate)
      const dateB = new Date(b.data.pubDate)

      return dateA > dateB ? -1 : 1
    })
  } else {
    filteredPosts.sort(() => Math.random() - 0.5)
  }

  // limit if number is provided
  if (typeof limit === 'number') {
    return filteredPosts.slice(0, limit)
  }

  return filteredPosts
}
