// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rolandfranke.nl',

  fonts: [
    {
      name: 'Instrument Sans',
      cssVariable: '--ff-sans',
      provider: fontProviders.local(),
      options: {
        variants: [
          { src: ['./src/assets/fonts/InstrumentSans-Regular.woff2'] },
          { src: ['./src/assets/fonts/InstrumentSans-SemiBold.woff2'] }
        ]
      },
    },
    {
      name: 'Hedvig Letters Serif',
      cssVariable: '--ff-serif',
      provider: fontProviders.local(),
      options: {
        variants: [{
          src: ['./src/assets/fonts/HedvigLettersSerif-Regular.woff2'],
          weight: '400',
          style: 'normal',
        }]
      }
    }
  ],

  // Markdown configuration
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { directive: true }
    })
  },

  integrations: [
    sitemap({
      filter: (page) =>
        page !== 'https://rolandfranke.nl/frontend-stories/wcag-22/' &&
        page !== 'https://rolandfranke.nl/frontend-stories/toc-test/' &&
        page !== 'https://rolandfranke.nl/frontend-stories/the-problem-with-sticky-menus/',
    }),
    mdx()
  ],

  redirects: {
    '/frontend-stories/exploring-the-new--search-element-in-html/': '/frontend-stories/exploring-the-new-search-element-in-html/',
  }
});
