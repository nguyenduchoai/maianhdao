import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

interface Donation {
    id: string;
    name: string;
    phone: string;
    email: string;
    amount: number;
    message: string;
    logo_url: string | null;
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

// POST /api/admin/donations - Create new donation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, email, amount, message, logo_url, is_organization, status, tree_id, tier } = body;

        if (!name || !amount) {
            return NextResponse.json({ error: 'Tên và số tiền là bắt buộc' }, { status: 400 });
        }

        // Generate unique ID
        const id = `d-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Insert donation
        db.prepare(`
            INSERT INTO donations (id, name, phone, email, amount, message, logo_url, is_organization, status, tree_id, tier, created_at, approved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            name,
            phone || null,
            email || null,
            amount,
            message || null,
            logo_url || null,
            is_organization ? 1 : 0,
            status || 'pending',
            tree_id || null,
            tier || 'gieomam',
            new Date().toISOString(),
            status === 'approved' ? new Date().toISOString() : null
        );

        // If tree_id is provided, update tree status (multiple donors allowed)
        if (tree_id) {
            db.prepare('UPDATE trees SET status = ? WHERE id = ?')
                .run('sponsored', tree_id);
        }

        return NextResponse.json({ success: true, message: 'Tạo đóng góp thành công', id });
    } catch (error) {
        console.error('Error creating donation:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT /api/admin/donations - Update donation
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, phone, email, amount, message, logo_url, is_organization, status, tree_id, tier } = body;

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
        if (logo_url !== undefined) { updates.push('logo_url = ?'); values.push(logo_url); }
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
                // If changing from one tree to another, check if old tree has other donors
                if (existing.tree_id && existing.tree_id !== tree_id) {
                    const otherDonors = db.prepare(
                        'SELECT COUNT(*) as count FROM donations WHERE tree_id = ? AND id != ? AND status = ?'
                    ).get(existing.tree_id, id, 'approved') as { count: number };

                    // Only set to available if no other donors
                    if (otherDonors.count === 0) {
                        db.prepare('UPDATE trees SET status = ? WHERE id = ?')
                            .run('available', existing.tree_id);
                    }
                }

                // Mark new tree as sponsored (don't overwrite donor_id - multiple donors allowed)
                db.prepare('UPDATE trees SET status = ? WHERE id = ?')
                    .run('sponsored', tree_id);

                updates.push('tree_id = ?');
                values.push(tree_id);
            } else {
                // Unassigning from tree - check if tree has other donors
                if (existing.tree_id) {
                    const otherDonors = db.prepare(
                        'SELECT COUNT(*) as count FROM donations WHERE tree_id = ? AND id != ? AND status = ?'
                    ).get(existing.tree_id, id, 'approved') as { count: number };

                    // Only set to available if no other donors
                    if (otherDonors.count === 0) {
                        db.prepare('UPDATE trees SET status = ? WHERE id = ?')
                            .run('available', existing.tree_id);
                    }
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

        // Unassign tree if any - but only set to available if no other donors
        if (existing.tree_id) {
            const otherDonors = db.prepare(
                'SELECT COUNT(*) as count FROM donations WHERE tree_id = ? AND id != ? AND status = ?'
            ).get(existing.tree_id, id, 'approved') as { count: number };

            if (otherDonors.count === 0) {
                db.prepare('UPDATE trees SET status = ? WHERE id = ?')
                    .run('available', existing.tree_id);
            }
        }

        // Delete donation
        db.prepare('DELETE FROM donations WHERE id = ?').run(id);

        return NextResponse.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error('Error deleting donation:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
