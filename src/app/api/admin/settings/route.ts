import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

interface Setting {
    key: string;
    value: string;
    updated_at: string;
}

// GET /api/admin/settings - Get all settings
export async function GET() {
    // 🔐 Auth Check
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const settings = db.prepare('SELECT key, value FROM settings').all() as Setting[];

        // Convert array to object
        const settingsObj: Record<string, string> = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        return NextResponse.json({ success: true, data: settingsObj });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi lấy cài đặt' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: Request) {
    // 🔐 Auth Check
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { settings } = body;

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json(
                { success: false, error: 'Dữ liệu không hợp lệ' },
                { status: 400 }
            );
        }

        // Upsert each setting
        const upsertStmt = db.prepare(`
            INSERT INTO settings (key, value, updated_at) 
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(key) DO UPDATE SET 
                value = excluded.value,
                updated_at = datetime('now')
        `);

        for (const [key, value] of Object.entries(settings)) {
            upsertStmt.run(key, String(value));
        }

        return NextResponse.json({ success: true, message: 'Đã lưu cài đặt thành công' });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi lưu cài đặt' },
            { status: 500 }
        );
    }
}
