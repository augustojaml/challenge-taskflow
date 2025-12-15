import { NextRequest, NextResponse } from 'next/server'

import { registerUserSchema } from '@/features/auth/schemas/register-user-schema'
import { authUserFactory } from '@/shared/databases/prisma/factories/auth-user-factory'

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
      { error: error instanceof Error ? error.message : 'Erro interno' },
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
