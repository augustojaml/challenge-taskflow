import { NextRequest, NextResponse } from 'next/server'

import { taskFactory } from '@/shared/databases/prisma/factories/task-factory'

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Criar uma nova tarefa
 *     description: Cria uma nova tarefa para o usuário autenticado
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Implementar feature X"
 *               description:
 *                 type: string
 *                 example: "Descrição detalhada da tarefa"
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *                 example: "PENDING"
 *     responses:
 *       200:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     userId:
 *                       type: string
 *                       example: "1"
 *                     title:
 *                       type: string
 *                       example: "Implementar feature X"
 *                     description:
 *                       type: string
 *                       example: "Descrição detalhada da tarefa"
 *                     status:
 *                       type: string
 *                       enum: [PENDING, IN_PROGRESS, COMPLETED]
 *                       example: "PENDING"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       400:
 *         description: Requisição inválida - Dados faltando ou inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Title is required"
 */
export async function POST(request: NextRequest) {
  try {
    // Obter userId do header adicionado pelo proxy
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const factory = taskFactory.createTask()

    const result = await factory.execute({
      userId,
      title,
      description,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status:
          error instanceof Error && 'statusCode' in error
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as any).statusCode
            : 500,
      },
    )
  }
}

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Listar todas as tarefas do usuário
 *     description: Retorna todas as tarefas do usuário autenticado
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [PENDING, IN_PROGRESS, COMPLETED]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 */
export async function GET(request: NextRequest) {
  try {
    // Obter userId do header adicionado pelo proxy
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const factory = taskFactory.findTasks()

    const result = await factory.execute({ userId })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status:
          error instanceof Error && 'statusCode' in error
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as any).statusCode
            : 500,
      },
    )
  }
}
