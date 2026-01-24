import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

interface SponsorRow {
    id: string;
    name: string;
    logo_url: string;
    website: string;
    tier: string;
    display_order: number;
    is_active: number;
}

// GET /api/admin/sponsors - Get all sponsors (including inactive)
export async function GET() {
    // 🔐 Auth Check
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const sponsors = db.prepare(`
            SELECT * FROM sponsors 
            ORDER BY 
                CASE tier 
                    WHEN 'organizer' THEN 1 
                    WHEN 'diamond' THEN 2 
                    WHEN 'gold' THEN 3 
                    WHEN 'silver' THEN 4 
                END,
                display_order
        `).all();

        return NextResponse.json({ success: true, data: sponsors });
    } catch (error) {
        console.error('Error fetching sponsors:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST /api/admin/sponsors - Create new sponsor
export async function POST(request: NextRequest) {
    // 🔐 Auth Check
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, logo_url, website, tier, display_order, is_active } = body;

        if (!name) {
            return NextResponse.json({ error: 'Tên là bắt buộc' }, { status: 400 });
        }

        const id = `sponsor-${Date.now()}`;

        db.prepare(`
            INSERT INTO sponsors (id, name, logo_url, website, tier, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, name, logo_url || '', website || '', tier || 'gold', display_order || 0, is_active !== false ? 1 : 0);

        return NextResponse.json({ success: true, message: 'Tạo thành công', data: { id } });
    } catch (error) {
        console.error('Error creating sponsor:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT /api/admin/sponsors - Update sponsor
export async function PUT(request: NextRequest) {
    // 🔐 Auth Check
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, logo_url, website, tier, display_order, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        // Check if sponsor exists
        const existing = db.prepare('SELECT * FROM sponsors WHERE id = ?').get(id) as SponsorRow | undefined;
        if (!existing) {
            return NextResponse.json({ error: 'Nhà tài trợ không tồn tại' }, { status: 404 });
        }

        // Update sponsor
        db.prepare(`
            UPDATE sponsors 
            SET name = ?, logo_url = ?, website = ?, tier = ?, display_order = ?, is_active = ?
            WHERE id = ?
        `).run(
            name || existing.name,
            logo_url !== undefined ? logo_url : existing.logo_url,
            website !== undefined ? website : existing.website,
            tier || existing.tier,
            display_order !== undefined ? display_order : existing.display_order,
            is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
            id
        );

        return NextResponse.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        console.error('Error updating sponsor:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE /api/admin/sponsors - Delete sponsor
export async function DELETE(request: NextRequest) {
    // 🔐 Auth Check
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        // Check if sponsor exists
        const existing = db.prepare('SELECT id FROM sponsors WHERE id = ?').get(id);
        if (!existing) {
            return NextResponse.json({ error: 'Nhà tài trợ không tồn tại' }, { status: 404 });
        }

        // Delete sponsor
        db.prepare('DELETE FROM sponsors WHERE id = ?').run(id);

        return NextResponse.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error('Error deleting sponsor:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
