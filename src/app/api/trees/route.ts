import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Tree } from '@/types';

// GET /api/trees - Get all trees with donor info (grouped)
export async function GET() {
    try {
        // First get all trees
        const treesData = db.prepare(`
            SELECT id, code, zone, lat, lng, status, images
            FROM trees
            ORDER BY zone, code
        `).all() as Array<{
            id: string;
            code: string;
            zone: string;
            lat: number;
            lng: number;
            status: string;
            images: string;
        }>;

        // Then get all approved donations
        const donations = db.prepare(`
            SELECT tree_id, id, name, logo_url, amount, tier, message
            FROM donations 
            WHERE status = 'approved' AND tree_id IS NOT NULL
            ORDER BY amount DESC
        `).all() as Array<{
            tree_id: string;
            id: string;
            name: string;
            logo_url: string | null;
            amount: number;
            tier: string;
            message: string | null;
        }>;

        // Group donations by tree_id
        const donationsByTree = new Map<string, typeof donations>();
        for (const d of donations) {
            if (!donationsByTree.has(d.tree_id)) {
                donationsByTree.set(d.tree_id, []);
            }
            donationsByTree.get(d.tree_id)!.push(d);
        }

        // Format trees with donor info (use first/highest donation for display)
        const formattedTrees: Tree[] = treesData.map((t) => {
            const treeDonations = donationsByTree.get(t.id) || [];
            const primaryDonor = treeDonations[0]; // Highest amount

            return {
                id: t.id,
                code: t.code,
                zone: t.zone,
                lat: t.lat,
                lng: t.lng,
                status: t.status as Tree['status'],
                images: JSON.parse(t.images || '[]'),
                donorId: primaryDonor?.id,
                donorName: primaryDonor?.name,
                donorLogo: primaryDonor?.logo_url || undefined,
                donorAmount: primaryDonor?.amount,
                donorMessage: primaryDonor?.message || undefined,
                createdAt: '',
                updatedAt: '',
            };
        });

        return NextResponse.json({ success: true, data: formattedTrees });
    } catch (error) {
        console.error('Error fetching trees:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trees' },
            { status: 500 }
        );
    }
}
