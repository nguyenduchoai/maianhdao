import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

interface Donation {
    id: string;
    name: string;
    phone: string;
    email: string;
    amount: number;
    message: string;
    is_organization: number;
    status: string;
    tree_id: string | null;
    tier: string;
}

// GET /api/admin/donations - Get all donations (for admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query = `
            SELECT d.*, t.code as tree_code
            FROM donations d
            LEFT JOIN trees t ON d.tree_id = t.id
        `;

        if (status && status !== 'all') {
            query += ` WHERE d.status = '${status}'`;
        }

        query += ` ORDER BY d.created_at DESC`;

        const donations = db.prepare(query).all();
        return NextResponse.json({ success: true, data: donations });
    } catch (error) {
        console.error('Error fetching donations:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT /api/admin/donations - Update donation
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, phone, email, amount, message, is_organization, status, tree_id, tier } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        // Check if donation exists
        const existing = db.prepare('SELECT * FROM donations WHERE id = ?').get(id) as Donation | undefined;
        if (!existing) {
            return NextResponse.json({ error: 'Đóng góp không tồn tại' }, { status: 404 });
        }

        // Build update query
        const updates: string[] = [];
        const values: any[] = [];

        if (name !== undefined) { updates.push('name = ?'); values.push(name); }
        if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
        if (email !== undefined) { updates.push('email = ?'); values.push(email); }
        if (amount !== undefined) { updates.push('amount = ?'); values.push(amount); }
        if (message !== undefined) { updates.push('message = ?'); values.push(message); }
        if (is_organization !== undefined) { updates.push('is_organization = ?'); values.push(is_organization); }
        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
            if (status === 'approved') {
                updates.push('approved_at = ?');
                values.push(new Date().toISOString());
            }
        }
        if (tier !== undefined) { updates.push('tier = ?'); values.push(tier); }

        // Handle tree assignment
        if (tree_id !== undefined) {
            // If assigning to a tree
            if (tree_id) {
                // Unassign from old tree if any
                if (existing.tree_id) {
                    db.prepare('UPDATE trees SET status = ?, donor_id = NULL WHERE id = ?')
                        .run('available', existing.tree_id);
                }

                // Assign to new tree
                db.prepare('UPDATE trees SET status = ?, donor_id = ? WHERE id = ?')
                    .run('sponsored', id, tree_id);

                updates.push('tree_id = ?');
                values.push(tree_id);
            } else {
                // Unassign tree
                if (existing.tree_id) {
                    db.prepare('UPDATE trees SET status = ?, donor_id = NULL WHERE id = ?')
                        .run('available', existing.tree_id);
                }
                updates.push('tree_id = NULL');
            }
        }

        if (updates.length > 0) {
            values.push(id);
            db.prepare(`UPDATE donations SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        return NextResponse.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        console.error('Error updating donation:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE /api/admin/donations - Delete donation
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        // Check if donation exists and get tree_id
        const existing = db.prepare('SELECT tree_id FROM donations WHERE id = ?').get(id) as { tree_id: string | null } | undefined;
        if (!existing) {
            return NextResponse.json({ error: 'Đóng góp không tồn tại' }, { status: 404 });
        }

        // Unassign tree if any
        if (existing.tree_id) {
            db.prepare('UPDATE trees SET status = ?, donor_id = NULL WHERE id = ?')
                .run('available', existing.tree_id);
        }

        // Delete donation
        db.prepare('DELETE FROM donations WHERE id = ?').run(id);

        return NextResponse.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error('Error deleting donation:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
