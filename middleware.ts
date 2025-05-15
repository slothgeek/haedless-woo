import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Verificar si el usuario está autenticado
  const sessionToken = request.cookies.get('session')?.value;
  const isAuthenticated = !!sessionToken;
  
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/account', '/profile'];
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Si es una ruta protegida y el usuario no está autenticado, redirigir a login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // Si el usuario está autenticado y trata de acceder a login/registro, redirigir a dashboard
  if (isAuthenticated && (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/account', request.url));
  }
  
  return NextResponse.next();
}

// Configurar las rutas que deben pasar por el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/profile/:path*',
    '/signin',
    '/signup'
  ]
}; 