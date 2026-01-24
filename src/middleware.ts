import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limit config
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute for general
const RATE_LIMIT_MAX_LOGIN = 5; // 5 login attempts per minute
const RATE_LIMIT_MAX_WEBHOOK = 30; // 30 webhook calls per minute

// Blocked paths for security (common attack vectors)
const BLOCKED_PATHS = [
    '/.env',
    '/.git',
    '/wp-admin',
    '/wp-login',
    '/phpmyadmin',
    '/admin.php',
    '/.htaccess',
    '/config.php',
    '/xmlrpc.php',
    '/wp-config.php',
    '/shell',
    '/cmd',
    '/eval',
];

// Get client IP
function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

// Check rate limit
function checkRateLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: maxRequests - record.count };
}

// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60 * 1000); // Clean every minute

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const clientIP = getClientIP(request);

    // Block known attack paths
    const lowerPath = pathname.toLowerCase();
    for (const blocked of BLOCKED_PATHS) {
        if (lowerPath.startsWith(blocked)) {
            console.warn(`🚫 Blocked attack attempt: ${clientIP} -> ${pathname}`);
            return new NextResponse('Forbidden', { status: 403 });
        }
    }

    // Rate limiting for login endpoint
    if (pathname === '/api/admin/login' && request.method === 'POST') {
        const { allowed, remaining } = checkRateLimit(`login:${clientIP}`, RATE_LIMIT_MAX_LOGIN);
        if (!allowed) {
            console.warn(`🚫 Rate limited login: ${clientIP}`);
            return new NextResponse(
                JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60',
                        ...securityHeaders,
                    },
                }
            );
        }
    }

    // Rate limiting for webhook
    if (pathname.startsWith('/api/webhook')) {
        const { allowed } = checkRateLimit(`webhook:${clientIP}`, RATE_LIMIT_MAX_WEBHOOK);
        if (!allowed) {
            console.warn(`🚫 Rate limited webhook: ${clientIP}`);
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests' }),
                { status: 429, headers: { 'Content-Type': 'application/json', ...securityHeaders } }
            );
        }
    }

    // General rate limiting for admin APIs
    if (pathname.startsWith('/api/admin')) {
        const { allowed } = checkRateLimit(`admin:${clientIP}`, RATE_LIMIT_MAX_REQUESTS);
        if (!allowed) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests' }),
                { status: 429, headers: { 'Content-Type': 'application/json', ...securityHeaders } }
            );
        }
    }

    // Add security headers to response
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        // Match all API routes
        '/api/:path*',
        // Match common attack paths
        '/.env',
        '/.git/:path*',
        '/wp-:path*',
        '/phpmyadmin/:path*',
    ],
};
