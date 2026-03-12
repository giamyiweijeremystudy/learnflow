// ============================================================
// functions/_middleware.js — Cloudflare Pages Middleware
// Runs on every request. Ready for auth token validation.
// ============================================================

export async function onRequest(context) {
  const { request, next, env } = context

  // Add security headers to all responses
  const response = await next()
  const newResponse = new Response(response.body, response)

  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return newResponse
}
