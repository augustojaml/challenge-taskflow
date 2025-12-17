import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import { PrismaClient } from '@/shared/databases/prisma/generated/client'

let testPrisma: PrismaClient | null = null

/**
 * Configura o banco de dados de teste
 * Cria uma conexão separada para testes
 */
export async function setupTestDatabase(): Promise<PrismaClient> {
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'hubfyai',
    password: process.env.DB_PASSWORD || 'hubfyai',
    database: process.env.DB_NAME || 'hubfyai_test_db',
    connectionLimit: 10,
  })

  testPrisma = new PrismaClient({ adapter })

  return testPrisma
}

/**
 * Limpa todos os dados de teste do banco
 * Remove todas as tarefas e usuários
 */
export async function cleanupTestData(): Promise<void> {
  if (testPrisma) {
    await testPrisma.task.deleteMany()
    await testPrisma.user.deleteMany()
  }
}

/**
 * Desconecta do banco de dados de teste
 */
export async function teardownTestDatabase(): Promise<void> {
  if (testPrisma) {
    await cleanupTestData()
    await testPrisma.$disconnect()
    testPrisma = null
  }
}

/**
 * Retorna a instância do Prisma de teste
 */
export function getTestPrisma(): PrismaClient {
  if (!testPrisma) {
    throw new Error(
      'Test database not initialized. Call setupTestDatabase() first.',
    )
  }
  return testPrisma
}

/**
 * Cria o banco de dados de teste se não existir
 * Requer conexão com privilégios de criação de banco
 */
export async function createTestDatabase(): Promise<void> {
  const mysql = await import('mysql2/promise')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  })

  const dbName = process.env.DB_NAME || 'hubfyai_test_db'

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
  await connection.end()

  console.log(`✅ Test database "${dbName}" created or already exists`)
}

/**
 * Remove o banco de dados de teste completamente
 * CUIDADO: Isso apaga todos os dados!
 */
export async function dropTestDatabase(): Promise<void> {
  const mysql = await import('mysql2/promise')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  })

  const dbName = process.env.DB_NAME || 'hubfyai_test_db'

  await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``)
  await connection.end()

  console.log(`✅ Test database "${dbName}" dropped`)
}
