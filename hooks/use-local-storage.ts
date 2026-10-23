import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const storageEvent = "portfolio-storage-change";
const getServerSnapshot = () => null;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(storageEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(storageEvent, onChange);
  };
}

export function useLocalStorage<T>(key: string) {
  const [fallback, setFallback] = useState<{ key: string; raw: string | null } | null>(null);
  const getSnapshot = useCallback(() => {
    if (fallback?.key === key) return fallback.raw;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key, fallback]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo<T | null>(() => {
    try {
      return raw === null ? null : JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [raw]);
  const setValue = useCallback((next: T | null) => {
    const raw = next === null ? null : JSON.stringify(next);
    try {
      if (raw === null) localStorage.removeItem(key);
      else localStorage.setItem(key, raw);
      setFallback(null);
      window.dispatchEvent(new Event(storageEvent));
    } catch {
      // Keep the current session usable when browser storage is unavailable.
      setFallback({ key, raw });
    }
  }, [key]);

  return [value, setValue] as const;
}
