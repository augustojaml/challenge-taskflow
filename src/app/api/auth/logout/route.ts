import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    message: 'Logout realizado com sucesso',
  })

  // Remove o cookie de autenticação (se existir)
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })

  return response
}
