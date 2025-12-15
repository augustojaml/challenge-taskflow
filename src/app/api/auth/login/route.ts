import { NextRequest, NextResponse } from 'next/server'

import { loginUserSchema } from '@/features/auth/schemas/login-user-schema'
import { authUserFactory } from '@/shared/databases/prisma/factories/auth-user-factory'
import { tokenJWT } from '@/shared/helpers'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuários
 *     description: Autentica um usuário e retorna um token JWT válido
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: senha123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Email ou senha inválidos
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

    const validationSchema = loginUserSchema.safeParse(data)

    if (!validationSchema.success) {
      return NextResponse.json(
        { errors: validationSchema.error.format(), data: null },
        { status: 400 },
      )
    }

    const { email, password } = validationSchema.data

    const factory = authUserFactory.loginUser()

    const result = await factory.execute({ email, password })

    // Gerar token JWT
    const token = tokenJWT.generateToken({
      userId: result.user.id,
      email: result.user.email,
    })

    return NextResponse.json({
      token,
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
