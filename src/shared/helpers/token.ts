import jwt, { SignOptions } from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const tokenJWT = {
  generateToken: (payload: JWTPayload): string => {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    }
    return jwt.sign(payload, JWT_SECRET, options)
  },

  verifyToken: (token: string) => {
    return jwt.verify(token, JWT_SECRET)
  },
}

export { type JWTPayload, tokenJWT }
