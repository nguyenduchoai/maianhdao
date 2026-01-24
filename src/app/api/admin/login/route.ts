import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logSecurityEvent } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('🚨 CRITICAL: JWT_SECRET environment variable is not set!');
}

// Account lockout configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// In-memory failed login tracking (per username)
const failedLogins = new Map<string, { count: number; lockedUntil: number }>();

// Get client IP from request
function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

// Check if account is locked
function isAccountLocked(username: string): boolean {
    const record = failedLogins.get(username);
    if (!record) return false;
    
    if (Date.now() > record.lockedUntil) {
        failedLogins.delete(username);
        return false;
    }
    
    return record.count >= MAX_FAILED_ATTEMPTS;
}

// Record failed login attempt
function recordFailedLogin(username: string) {
    const record = failedLogins.get(username) || { count: 0, lockedUntil: 0 };
    record.count++;
    record.lockedUntil = Date.now() + LOCKOUT_DURATION;
    failedLogins.set(username, record);
}

// Clear failed logins on success
function clearFailedLogins(username: string) {
    failedLogins.delete(username);
}

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
    const clientIP = getClientIP(request);
    
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Check account lockout
        if (isAccountLocked(username)) {
            logSecurityEvent('LOGIN_BLOCKED', {
                reason: 'Account locked due to too many failed attempts',
                username,
                ip: clientIP,
            });
            return NextResponse.json(
                { success: false, error: 'Tài khoản tạm khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' },
                { status: 429 }
            );
        }

        // Find admin user
        const user = db.prepare(
            'SELECT * FROM admin_users WHERE username = ?'
        ).get(username) as { id: string; username: string; password: string; role: string; is_active: number } | undefined;

        if (!user) {
            recordFailedLogin(username);
            logSecurityEvent('LOGIN_FAILED', {
                reason: 'User not found',
                username,
                ip: clientIP,
            });
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.is_active) {
            logSecurityEvent('LOGIN_FAILED', {
                reason: 'Account disabled',
                username,
                ip: clientIP,
            });
            return NextResponse.json(
                { success: false, error: 'Tài khoản đã bị vô hiệu hóa' },
                { status: 401 }
            );
        }

        // Check password
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            recordFailedLogin(username);
            logSecurityEvent('LOGIN_FAILED', {
                reason: 'Invalid password',
                username,
                ip: clientIP,
            });
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check that JWT_SECRET is configured
        if (!JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Clear failed login attempts on success
        clearFailedLogins(username);

        // Generate JWT token with shorter expiry for security
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' } // Reduced from 24h to 8h
        );

        // Log successful login
        logSecurityEvent('LOGIN_SUCCESS', {
            username,
            userId: user.id,
            role: user.role,
            ip: clientIP,
        });

        const response = NextResponse.json({
            success: true,
            data: {
                token,
                user: { id: user.id, username: user.username, role: user.role },
            },
        });

        // Set secure cookie with additional security flags
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: true, // Always secure (HTTPS only)
            sameSite: 'strict', // Stricter CSRF protection
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        logSecurityEvent('LOGIN_ERROR', {
            error: error instanceof Error ? error.message : 'Unknown error',
            ip: clientIP,
        });
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}

// GET /api/admin/login - Check current session
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, authenticated: false },
                { status: 401 }
            );
        }

        if (!JWT_SECRET) {
            return NextResponse.json(
                { success: false, authenticated: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string; username: string; role?: string };

        // Get fresh role and check if user is still active
        const user = db.prepare('SELECT role, is_active FROM admin_users WHERE id = ?').get(decoded.id) as { role: string; is_active: number } | undefined;

        if (!user || !user.is_active) {
            return NextResponse.json(
                { success: false, authenticated: false, error: 'Account disabled' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            authenticated: true,
            user: { id: decoded.id, username: decoded.username, role: user.role || decoded.role || 'editor' },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, authenticated: false },
            { status: 401 }
        );
    }
}

// DELETE /api/admin/login - Logout
export async function DELETE(request: NextRequest) {
    const clientIP = getClientIP(request);
    const token = request.cookies.get('admin_token')?.value;
    
    // Try to log who is logging out
    if (token && JWT_SECRET) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { username?: string };
            logSecurityEvent('LOGOUT', {
                username: decoded.username,
                ip: clientIP,
            });
        } catch {
            // Token invalid, still allow logout
        }
    }
    
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete('admin_token');
    return response;
}
