/**
 * PWA configuration checks.
 *
 * These assert the *inputs* that make the app installable and offline-capable
 * (manifest fields, precache globs, icon assets). The generated service worker
 * itself is verified by `npm run preview` + Lighthouse / DevTools, per the
 * README testing section.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { manifest, THEME_COLOR, BACKGROUND_COLOR } from '../src/config/manifest';
import { onPWAStatus } from '../src/pwa/registerSW';

const root = resolve(__dirname, '..');

describe('web app manifest', () => {
  it('has the required identity fields', () => {
    expect(manifest.name).toBe('Your Career System');
    expect(manifest.short_name).toBe('Career System');
    expect(manifest.description && manifest.description.length).toBeGreaterThan(20);
  });

  it('is a standalone, installable configuration', () => {
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.scope).toBe('/');
    expect(manifest.theme_color).toBe(THEME_COLOR);
    expect(manifest.background_color).toBe(BACKGROUND_COLOR);
  });

  it('ships 192 and 512 icons plus a maskable icon', () => {
    const sizes = (manifest.icons ?? []).map((i) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect((manifest.icons ?? []).some((i) => i.purpose === 'maskable')).toBe(true);
  });

  it('every referenced icon file exists in /public', () => {
    for (const icon of manifest.icons ?? []) {
      expect(existsSync(resolve(root, 'public', icon.src)), icon.src).toBe(true);
    }
  });
});

describe('index.html', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  it('links the manifest and sets the theme colour', () => {
    expect(html).toMatch(/rel="manifest"/);
    expect(html).toMatch(/name="theme-color" content="#1B3A5C"/);
  });
  it('opts into full-viewport + safe-area on mobile', () => {
    expect(html).toMatch(/viewport-fit=cover/);
    expect(html).toMatch(/apple-mobile-web-app-capable/);
  });
});

describe('service worker precache (vite.config.ts)', () => {
  const cfg = readFileSync(resolve(root, 'vite.config.ts'), 'utf8');
  it('registers vite-plugin-pwa', () => {
    expect(cfg).toMatch(/VitePWA\(/);
  });
  it('precaches the app shell + json data and falls back to index.html offline', () => {
    expect(cfg).toMatch(/globPatterns:\s*\[[^\]]*json/);
    expect(cfg).toMatch(/navigateFallback:\s*'index\.html'/);
    expect(cfg).toMatch(/cleanupOutdatedCaches:\s*true/);
  });
  it('uses prompt-based updates (no silent swap)', () => {
    expect(cfg).toMatch(/registerType:\s*'prompt'/);
  });
});

describe('registration module', () => {
  it('exposes a status subscription that starts idle', () => {
    let status = 'unset';
    const off = onPWAStatus((s) => (status = s));
    expect(status).toBe('idle');
    off();
  });
});

describe('offline data', () => {
  it('career-system data is bundled as source (no network needed to search)', () => {
    expect(existsSync(resolve(root, 'src/data/situations.ts'))).toBe(true);
    expect(existsSync(resolve(root, 'src/data/tools.ts'))).toBe(true);
    expect(existsSync(resolve(root, 'src/data/synonyms.ts'))).toBe(true);
  });
  it('the source-of-truth document is kept in the repo for validation', () => {
    expect(existsSync(resolve(root, 'reference/HPB_YourCareerSystem_v4.html'))).toBe(true);
  });
});
