import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const proxy = async (req: NextRequest) => {
    const refreshToken = req.cookies.get("refresh")?.value
    const key = process.env.JWT_SECRET;
    const protectedRoutes = ['/home', '/projects', '/dashboard', '/socials', '/chats'];

    const { pathname } = req.nextUrl;

    const verifyAuthenticity = async () => {
        if (!refreshToken || !key) {
            return false;
        }

        try {
            const secret = new TextEncoder().encode(key);
            const { payload } = await jwtVerify(refreshToken, secret);
            return true;
        }
        catch (err) {
            return false;
        }
    }

    const verified = await verifyAuthenticity();

    // User trying to visit the base route
    if (pathname == '/') {
        if (verified) {
            return NextResponse.redirect(new URL('/home', req.url));
        }
        return NextResponse.next();
    }

    // Trying to visit auth even when logged in
    if (pathname == '/auth') {
        if (verified) {
            return NextResponse.redirect(new URL('/home', req.url));
        }
        return NextResponse.next();
    }

    // User trying to visit any protected route
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (verified) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/auth', req.url))
    }

    return NextResponse.next();

}

export const config = {
    matcher: ['/', '/home', '/projects', '/dashboard', '/socials', '/chats', '/auth']
}