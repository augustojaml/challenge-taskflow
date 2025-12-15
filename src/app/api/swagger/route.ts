import { resolve } from 'node:path'

import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Flow API',
      version: '1.0.0',
      description:
        'API completa para gerenciamento de tarefas com autenticação JWT',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    resolve(process.cwd(), 'src/app/api/**/*.ts'), // Caminho absoluto para os arquivos com anotações Swagger
  ],
}

const swaggerSpec = swaggerJsdoc(options)

export async function GET() {
  return NextResponse.json(swaggerSpec)
}
