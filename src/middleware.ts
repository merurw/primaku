import { NextRequest, NextResponse } from 'next/server'
import { token } from './constants/constants'

export default function middleware(req: NextRequest) {
  const cookieAuth = req.cookies.get(token)
  if (req.nextUrl.pathname.startsWith('/data-pasien')) {
    if (!cookieAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
}

// export const config = {
//   matcher: ['/dashboard/:paths']
// }
