import { createServer } from 'node:http'
import { parse } from 'node:url'

import bcrypt from 'bcryptjs'
import next from 'next'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/shared/databases/prisma'

const dev = false
const hostname = 'localhost'
const port = 3001

// Inicializar Prisma

describe('API E2E Tests', () => {
  let app: Awaited<ReturnType<typeof next>>
  let server: ReturnType<typeof createServer>
  let agent: ReturnType<typeof request>

  const testUser = {
    email: 'test@e2e.com',
    password: 'Test123!@#',
    name: 'Test User E2E',
  }

  beforeAll(async () => {
    // Configurar variáveis de ambiente de teste
    // process.env.NODE_ENV = 'test'
    process.env.DB_HOST = 'localhost'
    process.env.DB_PORT = '3306'
    process.env.DB_USER = 'test-user'
    process.env.DB_PASSWORD = 'test-password'
    process.env.DB_NAME = 'test-database'
    process.env.DATABASE_URL =
      'mysql://test-user:test-password@localhost:3306/rest-api?schema=public'
    process.env.JWT_SECRET = 'test-secret-key'
    process.env.JWT_EXPIRES_IN = '7d'

    // Limpar usuário de teste se existir
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    })

    // Criar usuário de teste no banco
    const hashedPassword = await bcrypt.hash(testUser.password, 10)
    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
      },
    })

    // Inicializar Next.js
    app = next({ dev, hostname, port })
    await app.prepare()

    const handler = app.getRequestHandler()

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true)
      handler(req, res, parsedUrl)
    })

    await new Promise<void>((resolve) => {
      server.listen(port, resolve)
    })

    agent = request(server)
  }, 60000)

  afterAll(async () => {
    // Limpar usuário de teste
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    })

    await prisma.$disconnect()

    await new Promise<void>((resolve) => {
      server.close(() => resolve())
    })

    await app.close()
  })

  it('should login and show response', async () => {
    const response = await agent.post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        name: testUser.name,
        email: testUser.email,
      },
    })
  })
})
