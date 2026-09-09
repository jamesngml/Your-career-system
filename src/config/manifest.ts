/**
 * Web App Manifest definition.
 *
 * Kept in its own module so that both `vite.config.ts` (which feeds it to
 * vite-plugin-pwa) and the automated tests can import the exact same object.
 */
import type { ManifestOptions } from 'vite-plugin-pwa';

export const THEME_COLOR = '#1B3A5C';
export const BACKGROUND_COLOR = '#FFFFFF';

// `& Record<string, unknown>` relaxes excess-property checks so we can include
// every manifest member regardless of the plugin's typings version.
export const manifest: Partial<ManifestOptions> & Record<string, unknown> = {
  name: 'Your Career System',
  short_name: 'Career System',
  description:
    'A companion to the High Performer Blueprint. Look up your career situation, find the right HPB tool, and open the module reference.',
  categories: ['productivity', 'education', 'business'],
  lang: 'en',
  dir: 'ltr',
  start_url: '/?source=pwa',
  scope: '/',
  id: '/',
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui'],
  orientation: 'portrait-primary',
  theme_color: THEME_COLOR,
  background_color: BACKGROUND_COLOR,
  icons: [
    { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: 'Search situations', short_name: 'Search', url: '/?source=pwa-shortcut#search' },
    { name: 'Tools directory', short_name: 'Tools', url: '/tools?source=pwa-shortcut' },
  ],
};
