import { useEffect, useState } from 'react';

/** Reactive `window.matchMedia`. SSR/test-safe (defaults to `false`). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** True for tablet-and-up (>= 601px). */
export const useIsTabletUp = () => useMediaQuery('(min-width: 601px)');
/** True for desktop (>= 1025px). */
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
