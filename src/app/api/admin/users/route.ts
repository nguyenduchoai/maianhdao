import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'maianhdao-secret-2026';

interface AdminUser {
    id: string;
    username: string;
    password: string;
    role: string;
    is_active: number;
    created_at: string;
}

// Check if requester is admin
async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = db.prepare('SELECT role FROM admin_users WHERE id = ?').get(decoded.id) as { role: string } | undefined;
        return user?.role === 'admin';
    } catch {
        return false;
    }
}

// GET - List all users (admin only)
export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    try {
        const users = db.prepare(`
            SELECT id, username, role, is_active, created_at 
            FROM admin_users 
            ORDER BY created_at DESC
        `).all();

        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { username, password, role = 'editor' } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Username và password là bắt buộc' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password phải ít nhất 6 ký tự' }, { status: 400 });
        }

        // Check if username exists
        const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
        if (existing) {
            return NextResponse.json({ error: 'Username đã tồn tại' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = `user-${Date.now()}`;

        db.prepare(`
            INSERT INTO admin_users (id, username, password, role, is_active) 
            VALUES (?, ?, ?, ?, 1)
        `).run(id, username, hashedPassword, role);

        return NextResponse.json({
            success: true,
            message: 'Tạo user thành công',
            data: { id, username, role }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT - Update user (admin only)
export async function PUT(request: NextRequest) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, username, password, role, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        // Check if user exists
        const existing = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id) as AdminUser | undefined;
        if (!existing) {
            return NextResponse.json({ error: 'User không tồn tại' }, { status: 404 });
        }

        // Update fields
        if (password && password.length >= 6) {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.prepare('UPDATE admin_users SET password = ? WHERE id = ?').run(hashedPassword, id);
        }

        if (role) {
            db.prepare('UPDATE admin_users SET role = ? WHERE id = ?').run(role, id);
        }

        if (typeof is_active === 'number') {
            db.prepare('UPDATE admin_users SET is_active = ? WHERE id = ?').run(is_active, id);
        }

        return NextResponse.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE - Delete user (admin only)
export async function DELETE(request: NextRequest) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        // Prevent deleting the last admin
        const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users WHERE role = ?').get('admin') as { count: number };
        const userToDelete = db.prepare('SELECT role FROM admin_users WHERE id = ?').get(id) as { role: string } | undefined;

        if (userToDelete?.role === 'admin' && adminCount.count <= 1) {
            return NextResponse.json({ error: 'Không thể xóa admin cuối cùng' }, { status: 400 });
        }

        db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);

        return NextResponse.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
