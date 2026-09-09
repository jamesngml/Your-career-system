import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// The PWA register virtual module only exists when vite-plugin-pwa is active.
vi.mock('virtual:pwa-register', () => ({
  registerSW: () => async () => {},
}));

// jsdom has no matchMedia.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom scrollTo is a no-op stub that logs "Not implemented" without this.
window.scrollTo = () => {};
