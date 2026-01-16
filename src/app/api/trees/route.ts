import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Tree } from '@/types';

// GET /api/trees - Get all trees with donor info
export async function GET() {
    try {
        const trees = db.prepare(`
      SELECT 
        t.id, t.code, t.zone, t.lat, t.lng, t.status, t.images,
        d.id as donor_id, d.name as donor_name, d.logo_url as donor_logo, 
        d.amount as donor_amount, d.tier as donor_tier, d.message as donor_message
      FROM trees t
      LEFT JOIN donations d ON t.id = d.tree_id AND d.status = 'approved'
      ORDER BY t.zone, t.code
    `).all() as Array<{
            id: string;
            code: string;
            zone: string;
            lat: number;
            lng: number;
            status: string;
            images: string;
            donor_id: string | null;
            donor_name: string | null;
            donor_logo: string | null;
            donor_amount: number | null;
            donor_tier: string | null;
            donor_message: string | null;
        }>;

        const formattedTrees: Tree[] = trees.map((t) => ({
            id: t.id,
            code: t.code,
            zone: t.zone,
            lat: t.lat,
            lng: t.lng,
            status: t.status as Tree['status'],
            images: JSON.parse(t.images || '[]'),
            donorId: t.donor_id || undefined,
            donorName: t.donor_name || undefined,
            donorLogo: t.donor_logo || undefined,
            donorAmount: t.donor_amount || undefined,
            donorMessage: t.donor_message || undefined,
            createdAt: '',
            updatedAt: '',
        }));

        return NextResponse.json({ success: true, data: formattedTrees });
    } catch (error) {
        console.error('Error fetching trees:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trees' },
            { status: 500 }
        );
    }
}
