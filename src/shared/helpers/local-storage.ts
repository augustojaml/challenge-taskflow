const isBrowser = typeof window !== 'undefined'

export const LocalStorage = {
  get<T>(key: string): T | null {
    if (!isBrowser) {
      return null
    }

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
    if (!isBrowser) {
      return
    }

    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    if (!isBrowser) {
      return
    }

    localStorage.removeItem(key)
  },
}
