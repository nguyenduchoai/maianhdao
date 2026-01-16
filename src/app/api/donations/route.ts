import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId, getDonationTier } from '@/lib/utils';

// GET /api/donations - Get approved donations for wall
export async function GET() {
    try {
        const donations = db.prepare(`
      SELECT 
        d.*, t.code as tree_code
      FROM donations d
      LEFT JOIN trees t ON d.tree_id = t.id
      WHERE d.status = 'approved'
      ORDER BY 
        CASE d.tier 
          WHEN 'diamond' THEN 1 
          WHEN 'gold' THEN 2 
          WHEN 'silver' THEN 3 
          WHEN 'green' THEN 4 
        END,
        d.display_order,
        d.amount DESC
    `).all();

        return NextResponse.json({ success: true, data: donations });
    } catch (error) {
        console.error('Error fetching donations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch donations' },
            { status: 500 }
        );
    }
}

// POST /api/donations - Submit new donation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, email, amount, message, isOrganization } = body;

        // Validate required fields
        if (!name || !amount) {
            return NextResponse.json(
                { success: false, error: 'Tên và số tiền đóng góp là bắt buộc' },
                { status: 400 }
            );
        }

        const id = generateId();
        const tier = getDonationTier(amount);

        db.prepare(`
      INSERT INTO donations (id, name, phone, email, amount, message, is_organization, tier, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(id, name, phone || '', email || '', amount, message || '', isOrganization ? 1 : 0, tier);

        return NextResponse.json({
            success: true,
            message: 'Cảm ơn bạn đã đóng góp! Chúng tôi sẽ xác nhận sau khi nhận được thanh toán.',
            data: { id, tier },
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        return NextResponse.json(
            { success: false, error: 'Không thể tạo đóng góp. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}
