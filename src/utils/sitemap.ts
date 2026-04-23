export const getLabel = (url: string) => (url === '/' ? 'Home' : formatLabelFromUrl(url))

export const formatLabelFromUrl = (url: string): string => {
  if (url === '/' || url === '') return 'Home'

  return url
    .replace(/^\/|\/$/g, '') // remove leading/trailing slash
    .split('/')
    .pop()! // only last segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
