export const LocalStorage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    if (!item) {
      return null
    }

    try {
      return JSON.parse(item) as T
    } catch {
      return item as unknown as T
    }
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
}
