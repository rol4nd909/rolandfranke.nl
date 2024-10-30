// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
// import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://rolandfranke.nl',
  integrations: [icon(), sitemap(), mdx()],
  
  prefetch: {
    prefetchAll: true,
  },

  markdown: {
    syntaxHighlight: false
  },

  // output: 'static',
  // adapter: vercel()
});