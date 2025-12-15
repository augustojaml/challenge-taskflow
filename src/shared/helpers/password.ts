import bcrypt from 'bcryptjs'

const passwordCrypto = {
  hash(password: string, saltRounds = 10) {
    return bcrypt.hash(password, saltRounds)
  },
  verify(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  },
}

export { passwordCrypto }
