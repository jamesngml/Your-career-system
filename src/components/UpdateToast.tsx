import { useEffect, useState } from 'react';
import { applyUpdate, dismissStatus, onPWAStatus, type PWAStatus } from '../pwa/registerSW';

/**
 * Shows a "New version available — Refresh" toast when the service worker has
 * a waiting update, and a brief "Ready to work offline" confirmation on first
 * install.
 */
export function UpdateToast() {
  const [status, setStatus] = useState<PWAStatus>('idle');

  useEffect(() => onPWAStatus(setStatus), []);

  useEffect(() => {
    if (status === 'offline-ready') {
      const t = setTimeout(() => dismissStatus(), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  if (status === 'idle') return null;

  return (
    <div className="toast" role="alert">
      {status === 'update-available' ? (
        <>
          <span>A new version is available.</span>
          <button type="button" className="btn btn--primary btn--sm" onClick={applyUpdate}>
            Refresh
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={dismissStatus}
            aria-label="Dismiss"
          >
            Later
          </button>
        </>
      ) : (
        <span>Ready to work offline.</span>
      )}
    </div>
  );
}
