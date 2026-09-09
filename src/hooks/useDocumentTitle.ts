import { useEffect } from 'react';

const BASE = 'Your Career System';

/** Sets `document.title`, restoring the base title on unmount. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} — HPB Reference`;
    return () => {
      document.title = `${BASE} — HPB Reference`;
    };
  }, [title]);
}
