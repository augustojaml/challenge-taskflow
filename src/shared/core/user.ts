type User = {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  passwordHash: string | null
  createdAt: Date
  updatedAt: Date
}

export { type User }
