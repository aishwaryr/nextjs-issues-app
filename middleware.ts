import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = (await headers()).get('Authorization');
    // just checking if Authorization header exists or not for now
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 },
      );
    }

    return NextResponse.next();
  }
};

export const config = {
  matcher: '/api/:path*',
};

// if multiple matches needed: matcher: ['/api/:path*', '/dashboard/:path*']
