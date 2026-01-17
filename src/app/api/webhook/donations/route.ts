import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Auto-assign tier based on amount
function getTierByAmount(amount: number): string {
    if (amount >= 5000000) return 'kientao';
    if (amount >= 1000000) return 'dauun';
    if (amount >= 200000) return 'guitrao';
    return 'gieomam';
}

// Generate unique ID
function generateId(): string {
    return `d-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// POST /api/webhook/donations - Receive donation from Google Sheets
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Support both single and batch imports
        const donations = Array.isArray(body) ? body : [body];

        const results: { success: number; failed: number; errors: string[] } = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const donation of donations) {
            try {
                // Map fields from Google Sheets format
                const name = donation['Người gửi'] || donation.name || donation.sender || '';
                const message = donation['Nội dung ghi chú'] || donation.message || donation.note || '';
                const rawAmount = donation['Số tiền (VND)'] || donation.amount || donation['Số tiền'] || 0;

                // Parse amount (remove commas, dots for thousands separator)
                const amount = typeof rawAmount === 'string'
                    ? parseFloat(rawAmount.replace(/[,\.]/g, '').replace(/\D/g, ''))
                    : Number(rawAmount);

                if (!name) {
                    results.failed++;
                    results.errors.push(`Missing name for donation`);
                    continue;
                }

                const id = generateId();
                const tier = getTierByAmount(amount);
                const isOrganization = name.toLowerCase().includes('công ty') ||
                    name.toLowerCase().includes('cty') ||
                    name.toLowerCase().includes('gia đình') ||
                    name.toLowerCase().includes('nhà hàng') ||
                    name.toLowerCase().includes('khách sạn') ? 1 : 0;

                // Insert into database
                db.prepare(`
                    INSERT INTO donations (id, name, amount, message, tier, is_organization, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'approved', datetime('now'))
                `).run(id, name, amount, message, tier, isOrganization);

                results.success++;
            } catch (err: any) {
                results.failed++;
                results.errors.push(err.message || 'Unknown error');
            }
        }

        return NextResponse.json({
            ok: true,
            message: `Imported ${results.success} donations, ${results.failed} failed`,
            imported: results.success,
            failed: results.failed,
            errors: results.errors
        });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}

// GET - Return webhook info
export async function GET() {
    return NextResponse.json({
        success: true,
        webhook: '/api/webhook/donations',
        method: 'POST',
        fields: {
            'Người gửi': 'Tên người đóng góp (bắt buộc)',
            'Nội dung ghi chú': 'Ghi chú / Lời nhắn',
            'Số tiền (VND)': 'Số tiền đóng góp'
        },
        tiers: {
            'kientao': '≥ 5,000,000 VND',
            'dauun': '≥ 1,000,000 VND',
            'guitrao': '≥ 200,000 VND',
            'gieomam': '< 200,000 VND'
        }
    });
}
