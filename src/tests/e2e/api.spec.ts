import { createServer } from 'node:http'
import { parse } from 'node:url'

import bcrypt from 'bcryptjs'
import next from 'next'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '@/shared/databases/prisma'

const dev = false
const hostname = 'localhost'
const port = 3001

const testUser = {
  email: 'test@e2e.com',
  password: 'Test123!@#',
  name: 'Test User E2E',
}

describe('API Auth E2E', () => {
  let app: Awaited<ReturnType<typeof next>>
  let server: ReturnType<typeof createServer>
  let agent: ReturnType<typeof request>

  beforeAll(async () => {
    process.env.DB_HOST = 'localhost'
    process.env.DB_PORT = '3306'
    process.env.DB_USER = 'root'
    process.env.DB_PASSWORD = 'root'
    process.env.DB_NAME = 'hubfyai_shadow'
    process.env.DATABASE_URL = 'mysql://root:root@localhost:3306/hubfyai_shadow'
    process.env.JWT_SECRET = 'test-secret-key'
    process.env.JWT_EXPIRES_IN = '7d'

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
  })

  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          endsWith: '@e2e.com',
        },
      },
    })
    await prisma.task.deleteMany({
      where: {
        title: {
          endsWith: 'Test Task',
        },
      },
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()

    await new Promise<void>((resolve) => {
      server.close(() => resolve())
    })

    await app.close()
  })

  it('should be able to register successfully', async () => {
    const response = await agent.post('/api/auth/register').send(testUser)

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      message: expect.any(String),
      user: {
        id: expect.any(String),
        email: testUser.email,
        name: testUser.name,
      },
    })
  })

  it('should be able to login successfully', async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
      },
    })

    const response = await agent.post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        email: testUser.email,
        name: testUser.name,
      },
    })
  })

  it('should return 401 when invalid token is used to fetch profile', async () => {
    const response = await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({
      error: expect.any(String),
    })
  })

  it('should be able to create a task successfully', async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
      },
    })

    const signInResponse = await agent.post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    const response = await agent
      .post('/api/tasks')
      .set('Authorization', `Bearer ${signInResponse.body.token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
      })
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      task: {
        id: expect.any(String),
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })

  it('should be able to list all tasks successfully', async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
      },
    })

    const signInResponse = await agent.post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    const response = await agent
      .get('/api/tasks')
      .set('Authorization', `Bearer ${signInResponse.body.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      result: {
        items: expect.any(Array),
        total: expect.any(Number),
        page: expect.any(Number),
        size: expect.any(Number),
      },
    })
  })
  it('should be able to update a task successfully', async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
      },
    })
    const signInResponse = await agent.post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    const responseTask = await agent
      .post('/api/tasks')
      .set('Authorization', `Bearer ${signInResponse.body.token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
      })

    const response = await agent
      .put(`/api/tasks/${responseTask.body.task.id}`)
      .set('Authorization', `Bearer ${signInResponse.body.token}`)
      .send({
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'COMPLETED',
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      task: {
        id: expect.any(String),
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'COMPLETED',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })

  it('should be able to delete a task successfully', async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
      },
    })
    const signInResponse = await agent.post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    const responseTask = await agent
      .post('/api/tasks')
      .set('Authorization', `Bearer ${signInResponse.body.token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
      })

    const response = await agent
      .delete(`/api/tasks/${responseTask.body.task.id}`)
      .set('Authorization', `Bearer ${signInResponse.body.token}`)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      message: 'Task deleted successfully',
    })
  })
})
