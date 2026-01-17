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

// Parse donation data
function parseDonation(donation: any) {
    const name = donation['Người gửi'] || donation.name || donation.sender || '';
    const message = donation['Nội dung ghi chú'] || donation.message || donation.note || '';
    const rawAmount = donation['Số tiền (VND)'] || donation.amount || donation['Số tiền'] || 0;

    const amount = typeof rawAmount === 'string'
        ? parseFloat(rawAmount.replace(/[,\.]/g, '').replace(/\D/g, '')) || 0
        : Number(rawAmount) || 0;

    const tier = getTierByAmount(amount);
    const isOrganization = name.toLowerCase().includes('công ty') ||
        name.toLowerCase().includes('cty') ||
        name.toLowerCase().includes('gia đình') ||
        name.toLowerCase().includes('nhà hàng') ||
        name.toLowerCase().includes('khách sạn') ? 1 : 0;

    return { name, message, amount, tier, isOrganization };
}

// POST /api/webhook/donations - Receive donation from Google Sheets
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check action type
        const action = body.action || 'sync'; // sync | update | new
        const data = body.data || body;

        const results = { inserted: 0, updated: 0, failed: 0, errors: [] as string[] };

        if (action === 'sync') {
            // SYNC: Replace all data with new data
            const donations = Array.isArray(data) ? data : [data];

            // Clear existing donations from webhook (keep manual ones)
            // For now, just insert new ones (avoid duplicates by name)
            for (const donation of donations) {
                try {
                    const parsed = parseDonation(donation);
                    if (!parsed.name) continue;

                    // Check if exists by name
                    const existing = db.prepare('SELECT id FROM donations WHERE name = ?').get(parsed.name) as any;

                    if (existing) {
                        // Update existing
                        db.prepare(`
                            UPDATE donations SET amount = ?, message = ?, tier = ?, is_organization = ?
                            WHERE id = ?
                        `).run(parsed.amount, parsed.message, parsed.tier, parsed.isOrganization, existing.id);
                        results.updated++;
                    } else {
                        // Insert new
                        db.prepare(`
                            INSERT INTO donations (id, name, amount, message, tier, is_organization, status, created_at)
                            VALUES (?, ?, ?, ?, ?, ?, 'approved', datetime('now'))
                        `).run(generateId(), parsed.name, parsed.amount, parsed.message, parsed.tier, parsed.isOrganization);
                        results.inserted++;
                    }
                } catch (err: any) {
                    results.failed++;
                    results.errors.push(err.message);
                }
            }
        } else if (action === 'update') {
            // UPDATE: Update specific row
            const parsed = parseDonation(data);
            if (!parsed.name) {
                return NextResponse.json({ ok: false, error: 'Missing name' }, { status: 400 });
            }

            const existing = db.prepare('SELECT id FROM donations WHERE name = ?').get(parsed.name) as any;
            if (existing) {
                db.prepare(`
                    UPDATE donations SET amount = ?, message = ?, tier = ?, is_organization = ?
                    WHERE id = ?
                `).run(parsed.amount, parsed.message, parsed.tier, parsed.isOrganization, existing.id);
                results.updated = 1;
            } else {
                return NextResponse.json({ ok: false, error: 'Donation not found' }, { status: 404 });
            }
        } else if (action === 'new') {
            // NEW: Insert new row
            const parsed = parseDonation(data);
            if (!parsed.name) {
                return NextResponse.json({ ok: false, error: 'Missing name' }, { status: 400 });
            }

            db.prepare(`
                INSERT INTO donations (id, name, amount, message, tier, is_organization, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 'approved', datetime('now'))
            `).run(generateId(), parsed.name, parsed.amount, parsed.message, parsed.tier, parsed.isOrganization);
            results.inserted = 1;
        }

        return NextResponse.json({
            ok: true,
            action,
            inserted: results.inserted,
            updated: results.updated,
            failed: results.failed,
            errors: results.errors
        });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { ok: false, error: error.message || 'Server error' },
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
        actions: {
            'sync': 'Đồng bộ toàn bộ dữ liệu (update existing, insert new)',
            'update': 'Cập nhật 1 dòng',
            'new': 'Thêm 1 dòng mới'
        },
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
