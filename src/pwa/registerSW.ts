/**
 * Service-worker registration + update wiring.
 *
 * `registerType: 'prompt'` (see vite.config.ts) means a new service worker
 * waits until the user chooses to reload. We expose that via a small event so
 * <UpdateToast> can show a "Refresh" affordance instead of silently swapping
 * the app out from under the user.
 */
import { registerSW } from 'virtual:pwa-register';

export type PWAStatus = 'idle' | 'update-available' | 'offline-ready';

type Listener = (status: PWAStatus) => void;
const listeners = new Set<Listener>();
let current: PWAStatus = 'idle';

export function onPWAStatus(listener: Listener): () => void {
  listeners.add(listener);
  listener(current);
  return () => listeners.delete(listener);
}

function emit(status: PWAStatus) {
  current = status;
  listeners.forEach((l) => l(status));
}

let updateSW: ((reload?: boolean) => Promise<void>) | undefined;

export function initPWA() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      emit('update-available');
    },
    onOfflineReady() {
      emit('offline-ready');
    },
  });
}

/** Called by <UpdateToast> when the user accepts the update. */
export function applyUpdate() {
  void updateSW?.(true);
}

export function dismissStatus() {
  emit('idle');
}
