import type { APIRoute } from 'astro';

/**
 * Generates dynamic robots.txt file during static build.
 * Includes sitemap reference only when a real production site URL is configured.
 *
 * @param context - Astro API route context
 * @param context.site - Configured site URL from astro.config.mjs
 * @returns HTTP response with plain text robots.txt
 */
export const GET: APIRoute = ({ site }) => {
  const hasSite = Boolean(site && !site.href.includes('example.com'));
  const sitemapEntry = hasSite
    ? `\nSitemap: ${new URL('sitemap-index.xml', site).href}`
    : '';

  const robotsContent = `User-agent: *
Allow: /${sitemapEntry}
`;

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
