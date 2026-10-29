import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const proxy = async (req: NextRequest) => {
    const refreshToken = req.cookies.get("refresh")?.value
    const key = process.env.JWT_SECRET;
    const protectedRoutes = ['/home', '/projects', '/dashboard', '/socials', '/chats'];

    const userAgent = req.headers.get('user-agent') || '';

    const isMobile = /mobile|android|iphone|ipod/i.test(userAgent);
    const { pathname } = req.nextUrl;

    if (isMobile && pathname !== '/smhome') {
        return NextResponse.redirect(new URL('/smhome', req.url))
    }

    const verifyAuthenticity = async () => {
        if (!refreshToken || !key) {
            return { success: false, userID: "" };
        }

        try {
            const secret = new TextEncoder().encode(key);
            const { payload } = await jwtVerify(refreshToken, secret);
            return { success: true, userID: payload?.userID };
        }
        catch (err) {
            return { success: false, userID: "" };
        }
    }

    const { success, userID } = await verifyAuthenticity();

    // User trying to visit the base route
    if (pathname == '/' || pathname == '/auth') {
        if (success) {
            return NextResponse.redirect(new URL('/home', req.url));
        }
        return NextResponse.next();
    }

    // User trying to visit any protected route
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (success) {
            //Projects Landing Page Can't be visited without the userID as a param, essential for UI
            if (pathname == '/projects' && !req.nextUrl.searchParams.has('userID')) {
                const urlClone = req.nextUrl.clone();
                urlClone.searchParams.set('userID', String(userID));
                return NextResponse.redirect(urlClone);
            }
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/auth', req.url))
    }

    return NextResponse.next();

}

export const config = {
    matcher: ['/', '/home', '/projects', '/dashboard', '/socials', '/chats', '/auth']
}