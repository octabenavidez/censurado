import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/**
 * Read the production site URL from environment variables.
 * If not provided, Astro defaults to local build and sitemap generation can be customized.
 */
const siteUrl = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;

export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: [
    {
      name: 'isolated-vite-cache',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          // Builds/checks must not overwrite the running dev server's React runtime.
          updateConfig({ vite: { cacheDir: `node_modules/.vite-${command}` } });
        },
      },
    },
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
