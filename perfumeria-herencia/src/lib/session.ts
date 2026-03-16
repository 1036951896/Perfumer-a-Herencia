export const COOKIE_NAME = 'admin_session'
const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 horas

function getSecret(): ArrayBuffer {
  const s = process.env.JWT_SECRET || 'herencia-secret-change-me'
  // slice(0) garantiza un ArrayBuffer propio (no SharedArrayBuffer)
  return new TextEncoder().encode(s).buffer.slice(0) as ArrayBuffer
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function createSessionToken(): Promise<string> {
  const payload = { exp: Date.now() + MAX_AGE_SECONDS * 1000 }
  const dataStr = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const key = await globalThis.crypto.subtle.importKey(
    'raw', getSecret(), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sigBuffer = await globalThis.crypto.subtle.sign(
    'HMAC', key, new TextEncoder().encode(dataStr)
  )
  const sig = toBase64Url(new Uint8Array(sigBuffer))
  return `${dataStr}.${sig}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false
  const dotIdx = token.lastIndexOf('.')
  if (dotIdx < 1) return false
  const dataStr = token.slice(0, dotIdx)
  const sigStr = token.slice(dotIdx + 1)
  const key = await globalThis.crypto.subtle.importKey(
    'raw', getSecret(), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const expectedBuffer = await globalThis.crypto.subtle.sign(
    'HMAC', key, new TextEncoder().encode(dataStr)
  )
  const expectedSig = toBase64Url(new Uint8Array(expectedBuffer))
  if (sigStr !== expectedSig) return false
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(dataStr)))
    return !payload.exp || Date.now() <= payload.exp
  } catch {
    return false
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: MAX_AGE_SECONDS,
  path: '/',
}
