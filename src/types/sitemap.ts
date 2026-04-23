export type SitemapNode = {
  label: string
  url: string
  children?: SitemapNode[]
  path: string
  pubDate?: Date
}
