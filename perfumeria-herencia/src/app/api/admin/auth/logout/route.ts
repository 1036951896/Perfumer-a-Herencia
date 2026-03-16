import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/session'

export async function POST() {
  const response = NextResponse.json({ exito: true })
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}
