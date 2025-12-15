import { NextRequest, NextResponse } from 'next/server'

import { registerUserSchema } from '@/features/auth/schemas/register-user-schema'
import { authUserFactory } from '@/shared/databases/prisma/factories/auth-user-factory'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de novos usuários
 *     description: Cria uma nova conta de usuário com validação de email único e senha forte
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: senha123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Usuário já cadastrado ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const validationSchema = registerUserSchema.safeParse(data)

    if (!validationSchema.success) {
      return NextResponse.json(
        { errors: validationSchema.error.format(), data: null },
        { status: 400 },
      )
    }

    const { name, email, password } = validationSchema.data

    const factory = authUserFactory.registerUser()

    const result = await factory.execute({ name, email, password })

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: result.user,
    })
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
