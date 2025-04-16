// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rolandfranke.nl',
  integrations: [sitemap(), mdx()],
  markdown: {
    syntaxHighlight: false
  },

  redirects: {
    '/frontend-stories/exploring-the-new--search-element-in-html/': '/frontend-stories/exploring-the-new-search-element-in-html/',
  }
});