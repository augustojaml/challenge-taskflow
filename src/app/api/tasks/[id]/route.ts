import { NextRequest, NextResponse } from 'next/server'

import { taskFactory } from '@/shared/databases/prisma/factories/task-factory'

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Atualizar uma tarefa
 *     description: Atualiza os dados de uma tarefa existente do usuário autenticado
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título atualizado"
 *               description:
 *                 type: string
 *                 example: "Descrição atualizada"
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *                 example: "IN_PROGRESS"
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
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
 *                     userId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Tarefa não encontrada
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, status } = body

    const factory = taskFactory.updateTask()

    const result = await factory.execute({
      id,
      userId,
      title,
      description,
      status,
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
 * /api/tasks/{id}:
 *   delete:
 *     summary: Deletar uma tarefa
 *     description: Remove uma tarefa do usuário autenticado
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Tarefa não encontrada
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const factory = taskFactory.deleteTask()

    const result = await factory.execute({
      id,
      userId,
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
