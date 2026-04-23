import type { SitemapNode } from '@/types/sitemap'
import { formatLabelFromUrl, getLabel } from './sitemap'

type InputPage = {
  url: string
  label: string
}

const ROOT_ORDER = ['/', '/frontend-stories/', '/about/']

export const buildSitemapTree = (pages: InputPage[]): SitemapNode[] => {
  const root: SitemapNode[] = []

  const findByPath = (list: SitemapNode[], path: string) => list.find((n) => n.path === path)

  const insertRoot = (node: SitemapNode) => {
    const index = ROOT_ORDER.findIndex((r) =>
      r === '/' ? node.path === '/' : node.path.startsWith(r)
    )

    if (index === -1) {
      root.push(node)
      return
    }

    root.splice(index, 0, node)
  }

  const insertChild = (list: SitemapNode[], node: SitemapNode) => {
    list.push(node)

    list.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0

      return dateB - dateA // newest first
    })
  }

  for (const page of pages) {
    const segments = page.url.split('/').filter(Boolean)

    let currentLevel = root

    if (segments.length === 0) {
      let node = findByPath(root, '/')

      if (!node) {
        node = {
          label: formatLabelFromUrl('/'),
          url: '/',
          path: '/',
          children: [],
        }

        insertRoot(node)
      }

      continue
    }

    for (let i = 0; i < segments.length; i++) {
      const isLast = i === segments.length - 1

      const subPath = '/' + segments.slice(0, i + 1).join('/') + '/'

      const nodePath = subPath

      let node = findByPath(currentLevel, nodePath)

      if (!node) {
        node = {
          url: isLast ? page.url : nodePath,
          label: isLast ? page.label : getLabel(segments[i]),
          path: nodePath,
          children: [],
        }

        if (currentLevel === root) {
          insertRoot(node)
        } else {
          insertChild(currentLevel, node)
        }
      }

      if (isLast) {
        node.url = page.url
        node.label = page.label
        node.pubDate = (page as any).pubDate
      }

      currentLevel = node.children!
    }
  }

  root.sort((a, b) => {
    const order = ROOT_ORDER

    return order.indexOf(a.path) - order.indexOf(b.path)
  })

  return root
}
