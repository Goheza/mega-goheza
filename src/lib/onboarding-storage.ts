export function loadOnboarding<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (!v) return fallback;
    return { ...fallback, ...JSON.parse(v) } as T;
  } catch {
    return fallback;
  }
}

export function saveOnboarding<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
