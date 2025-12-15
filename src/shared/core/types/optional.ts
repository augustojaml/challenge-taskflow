type OptionalType<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export { type OptionalType }
