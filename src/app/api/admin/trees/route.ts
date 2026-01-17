import { NextResponse } from 'next/server';
import db from '@/lib/db';

// POST /api/admin/trees - Create new tree
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, zone, lat, lng } = body;

        if (!code || !zone) {
            return NextResponse.json(
                { success: false, error: 'Mã cây và khu vực là bắt buộc' },
                { status: 400 }
            );
        }

        // Check if code already exists
        const existing = db.prepare('SELECT id FROM trees WHERE code = ?').get(code.toUpperCase());
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Mã cây đã tồn tại' },
                { status: 400 }
            );
        }

        // Generate unique ID
        const id = `tree-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Insert new tree
        db.prepare(`
            INSERT INTO trees (id, code, zone, lat, lng, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            id,
            code.toUpperCase(),
            zone,
            lat || 11.948307,
            lng || 108.450188,
            'available'
        );

        return NextResponse.json({ success: true, message: 'Đã thêm cây thành công', id });
    } catch (error) {
        console.error('Error creating tree:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi tạo cây mới' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/trees - Update tree
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, code, zone, lat, lng, images } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Tree ID is required' },
                { status: 400 }
            );
        }

        // Update tree
        db.prepare(`
            UPDATE trees SET 
                code = COALESCE(?, code),
                zone = COALESCE(?, zone),
                lat = COALESCE(?, lat),
                lng = COALESCE(?, lng),
                images = COALESCE(?, images)
            WHERE id = ?
        `).run(
            code || null,
            zone || null,
            lat || null,
            lng || null,
            images ? JSON.stringify(images) : null,
            id
        );

        return NextResponse.json({ success: true, message: 'Tree updated successfully' });
    } catch (error) {
        console.error('Error updating tree:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update tree' },
            { status: 500 }
        );
    }
}

// GET /api/admin/trees - Get all trees with admin details
export async function GET() {
    try {
        const trees = db.prepare(`
            SELECT t.*, 
                   d.name as donor_name, 
                   d.amount as donor_amount
            FROM trees t
            LEFT JOIN donations d ON t.id = d.tree_id AND d.status = 'approved'
            ORDER BY t.zone, t.code
        `).all();

        return NextResponse.json({ success: true, data: trees });
    } catch (error) {
        console.error('Error fetching trees:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trees' },
            { status: 500 }
        );
    }
}
