import { timingSafeEqual, createHash } from 'node:crypto'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (url.pathname.startsWith('/_docs')) return

  const secret = process.env.JW_API_SECRET
  if (!secret) return

  const provided = getHeader(event, 'x-jw-api-secret') ?? ''

  const secretBuf = createHash('sha256').update(secret).digest()
  const providedBuf = createHash('sha256').update(provided).digest()

  if (!timingSafeEqual(secretBuf, providedBuf)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
