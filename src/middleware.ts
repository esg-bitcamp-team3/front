import {NextRequest, NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('token', token)

  const response = NextResponse.next()

  const responseCookie = response.cookies.get('token')
  console.log('responseCookie', responseCookie)

  return response
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    // Match all paths except for specific ones
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
}
