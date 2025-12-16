type Params = {
  name?: string | null
  email?: string | null
}

export const getInitialsLetterName = ({ name, email }: Params) => {
  if (name?.trim()) {
    const [first = '', second = ''] = name.trim().split(' ')
    return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase()
  }

  if (email) {
    const firstChar = email.trim()[0]
    return (firstChar ?? 'U').toUpperCase()
  }

  return 'U'
}
