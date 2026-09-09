import { usePWAInstall } from '../hooks/usePWAInstall';

/** Subtle, dismissible "Install app" affordance. Never nags. */
export function InstallPrompt() {
  const { canInstall, promptInstall, dismiss } = usePWAInstall();
  if (!canInstall) return null;
  return (
    <div className="install" role="region" aria-label="Install this app">
      <div className="install__text">
        <strong>Install Your Career System</strong>
        <span>Add it to your home screen for offline access.</span>
      </div>
      <div className="install__actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={promptInstall}>
          Install app
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={dismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}
