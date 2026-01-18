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

// Helper: Get tree_ids for a donation from junction table
function getTreeIdsForDonation(donationId: string): string[] {
    const rows = db.prepare(
        'SELECT tree_id FROM donation_trees WHERE donation_id = ?'
    ).all(donationId) as { tree_id: string }[];
    return rows.map(r => r.tree_id);
}

// Helper: Get tree codes for display
function getTreeCodesForDonation(donationId: string): string[] {
    const rows = db.prepare(`
        SELECT t.code FROM donation_trees dt
        JOIN trees t ON dt.tree_id = t.id
        WHERE dt.donation_id = ?
        ORDER BY t.code
    `).all(donationId) as { code: string }[];
    return rows.map(r => r.code);
}

// Helper: Update tree status based on donation count
function updateTreeStatus(treeId: string) {
    const count = db.prepare(`
        SELECT COUNT(*) as count FROM donation_trees dt
        JOIN donations d ON dt.donation_id = d.id
        WHERE dt.tree_id = ? AND d.status = 'approved'
    `).get(treeId) as { count: number };

    const newStatus = count.count > 0 ? 'sponsored' : 'available';
    db.prepare('UPDATE trees SET status = ? WHERE id = ?').run(newStatus, treeId);
}

// GET /api/admin/donations - Get all donations (for admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Validate status against whitelist to prevent SQL injection
        const validStatuses = ['pending', 'approved', 'rejected'];
        const params: string[] = [];

        let query = `
            SELECT d.*
            FROM donations d
        `;

        if (status && status !== 'all' && validStatuses.includes(status)) {
            query += ` WHERE d.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY d.created_at DESC`;

        const donations = db.prepare(query).all(...params) as Donation[];

        // Enrich with tree codes from junction table
        const enrichedDonations = donations.map(d => {
            const treeCodes = getTreeCodesForDonation(d.id);
            const treeIds = getTreeIdsForDonation(d.id);
            return {
                ...d,
                tree_codes: treeCodes,
                tree_code: treeCodes.join(', ') || null, // Backwards compatibility
                tree_ids: treeIds,
                tree_id: treeIds[0] || null, // Backwards compatibility
            };
        });

        return NextResponse.json({ success: true, data: enrichedDonations });
    } catch (error) {
        console.error('Error fetching donations:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST /api/admin/donations - Create new donation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, email, amount, message, logo_url, is_organization, status, tree_id, tree_ids, tier } = body;

        if (!name || amount === undefined) {
            return NextResponse.json({ error: 'Tên và số tiền là bắt buộc' }, { status: 400 });
        }

        // Generate unique ID
        const id = `d-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Insert donation (without tree_id - use junction table)
        db.prepare(`
            INSERT INTO donations (id, name, phone, email, amount, message, logo_url, is_organization, status, tier, created_at, approved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            tier || 'gieomam',
            new Date().toISOString(),
            status === 'approved' ? new Date().toISOString() : null
        );

        // Handle tree assignments (support both single tree_id and array tree_ids)
        const treesToAssign: string[] = tree_ids || (tree_id ? [tree_id] : []);

        if (treesToAssign.length > 0) {
            const insertRelation = db.prepare(
                'INSERT OR IGNORE INTO donation_trees (donation_id, tree_id) VALUES (?, ?)'
            );

            for (const tid of treesToAssign) {
                if (tid) {
                    insertRelation.run(id, tid);
                    // Update tree status if donation is approved
                    if (status === 'approved') {
                        updateTreeStatus(tid);
                    }
                }
            }
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
        const { id, name, phone, email, amount, message, logo_url, is_organization, status, tree_id, tree_ids, tier } = body;

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
        const values: unknown[] = [];

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

        // Handle tree assignment changes using junction table
        // Support both tree_id (single) and tree_ids (array)
        const newTreeIds: string[] | undefined = tree_ids !== undefined
            ? tree_ids
            : (tree_id !== undefined ? (tree_id ? [tree_id] : []) : undefined);

        if (newTreeIds !== undefined) {
            // Get current tree IDs
            const currentTreeIds = getTreeIdsForDonation(id);

            // Find trees to remove and add
            const toRemove = currentTreeIds.filter(t => !newTreeIds.includes(t));
            const toAdd = newTreeIds.filter(t => !currentTreeIds.includes(t));

            // Remove old assignments
            if (toRemove.length > 0) {
                const deleteStmt = db.prepare('DELETE FROM donation_trees WHERE donation_id = ? AND tree_id = ?');
                for (const tid of toRemove) {
                    deleteStmt.run(id, tid);
                    updateTreeStatus(tid); // Update removed tree's status
                }
            }

            // Add new assignments
            if (toAdd.length > 0) {
                const insertStmt = db.prepare('INSERT OR IGNORE INTO donation_trees (donation_id, tree_id) VALUES (?, ?)');
                for (const tid of toAdd) {
                    if (tid) {
                        insertStmt.run(id, tid);
                        updateTreeStatus(tid); // Update added tree's status
                    }
                }
            }
        }

        // Execute update if there are changes
        if (updates.length > 0) {
            values.push(id);
            db.prepare(`UPDATE donations SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        // If status changed, update all associated trees
        if (status !== undefined && status !== existing.status) {
            const associatedTrees = getTreeIdsForDonation(id);
            for (const tid of associatedTrees) {
                updateTreeStatus(tid);
            }
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

        // Get associated trees before deletion
        const associatedTrees = getTreeIdsForDonation(id);

        // Delete from junction table first (cascade should handle this, but be explicit)
        db.prepare('DELETE FROM donation_trees WHERE donation_id = ?').run(id);

        // Delete donation
        db.prepare('DELETE FROM donations WHERE id = ?').run(id);

        // Update status of previously associated trees
        for (const tid of associatedTrees) {
            updateTreeStatus(tid);
        }

        return NextResponse.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error('Error deleting donation:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
