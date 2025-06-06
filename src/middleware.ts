import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../lib/session";
import { decryptAdminSession } from "../lib/adminSession";

// Update protected and public routes
const protectedRoutes = ["/user/mybookings", "/my-bookings"];
const publicRoutes = ["/login", "/",];
const adminProtectedRoutes = ["/admin/dashboard"];
const adminPublicRoutes = ["/admin/login"];


export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
console.log('my path is this ',path)
  const isAdminRoute = path.startsWith("/admin");
  if (isAdminRoute) {
    return handleAdminRoutes(req, path);
  } else {
    return handleUserRoutes(req, path);
  }

  
}

async function handleUserRoutes(req: NextRequest, path: string) {

const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path === route);
  // @ts-ignore
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);
  
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/user/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/user/mybookings", req.nextUrl));
  }
  
  return NextResponse.next();

}
async function handleAdminRoutes(req: NextRequest, path: string) {
  const isAdminProtected = adminProtectedRoutes.some(route => path.startsWith(route));
  const isAdminPublic = adminPublicRoutes.some(route => path === route);
  const cookieStore = await cookies();
  const adminSessionCookie = cookieStore.get("adminSession")?.value;
  const adminSession = await decryptAdminSession(adminSessionCookie);
    console.log({isAdminProtected , isAdminPublic , adminSession })

  if (isAdminProtected && (!adminSession || adminSession.role !== 'admin')) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isAdminPublic && adminSession?.role === 'admin') {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }
  
  return NextResponse.next();
}

// specifies which routes the middleware should run on.
export const config = {
  matcher: [
    // Match all user routes
    '/login', 
    '/register',
    '/user/mybookings', 
    '/create-account',
    '/mybookings/:path*',
    '/my-bookings/:path*',
    // Match all admin routes
    '/admin/:path*'
  ],
};