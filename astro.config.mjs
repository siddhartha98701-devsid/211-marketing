import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://211marketing.in',
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough'
  }),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
      changefreq: 'weekly',
      priority: 0.7
    })
  ],
  vite: {
    build: {
      sourcemap: false
    }
  }
});
