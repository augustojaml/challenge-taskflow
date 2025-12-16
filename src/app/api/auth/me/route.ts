import { NextRequest, NextResponse } from 'next/server'

import { authUserFactory } from '@/shared/databases/prisma/factories/auth-user-factory'

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter informações do usuário autenticado
 *     description: Retorna as informações do usuário autenticado baseado no token JWT
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "João Silva"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "joao@example.com"
 *       401:
 *         description: Token inválido ou usuário não encontrado
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

    const factory = authUserFactory.getMe()

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
