import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'maianhdao-secret-2026';

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Find admin user
        const user = db.prepare(
            'SELECT * FROM admin_users WHERE username = ?'
        ).get(username) as { id: string; username: string; password: string } | undefined;

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const response = NextResponse.json({
            success: true,
            data: {
                token,
                user: { id: user.id, username: user.username },
            },
        });

        // Set cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
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

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };

        return NextResponse.json({
            success: true,
            authenticated: true,
            user: { id: decoded.id, username: decoded.username },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, authenticated: false },
            { status: 401 }
        );
    }
}

// DELETE /api/admin/login - Logout
export async function DELETE() {
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete('admin_token');
    return response;
}
