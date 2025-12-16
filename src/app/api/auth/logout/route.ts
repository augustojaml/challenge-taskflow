import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout de usuários
 *     description: Realiza o logout do usuário removendo o token de autenticação
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout realizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Logout realizado com sucesso',
  })
}
