export default defineEventHandler((event) => {
  // Only protect non-docs endpoints
  const url = getRequestURL(event)
  if (url.pathname.startsWith('/_docs')) return

  const secret = process.env.JW_API_SECRET
  if (!secret) return // no secret set = dev mode, allow all

  const provided = getHeader(event, 'x-jw-api-secret')
  if (provided !== secret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
})