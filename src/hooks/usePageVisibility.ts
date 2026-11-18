import { useSyncExternalStore } from 'react';

function subscribe(notify: () => void) {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
}

export function usePageVisibility() {
  return useSyncExternalStore(subscribe, () => !document.hidden, () => true);
}
