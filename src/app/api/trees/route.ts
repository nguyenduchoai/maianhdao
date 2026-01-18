import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Tree } from '@/types';

interface DonorInfo {
    id: string;
    name: string;
    logo_url: string | null;
    amount: number;
    tier: string;
    message: string | null;
}

// GET /api/trees - Get all trees with donor info (supports multiple donors per tree)
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

        // Then get all approved donations with their tree assignments via junction table
        const donations = db.prepare(`
            SELECT 
                dt.tree_id,
                d.id,
                d.name,
                d.logo_url,
                d.amount,
                d.tier,
                d.message
            FROM donation_trees dt
            JOIN donations d ON dt.donation_id = d.id
            WHERE d.status = 'approved'
            ORDER BY d.amount DESC
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
        const donationsByTree = new Map<string, DonorInfo[]>();
        for (const d of donations) {
            if (!donationsByTree.has(d.tree_id)) {
                donationsByTree.set(d.tree_id, []);
            }
            donationsByTree.get(d.tree_id)!.push({
                id: d.id,
                name: d.name,
                logo_url: d.logo_url,
                amount: d.amount,
                tier: d.tier,
                message: d.message,
            });
        }

        // Format trees with donor info
        // Primary donor = highest amount (for backwards compatibility)
        // Also include all donors array for multi-donor display
        const formattedTrees: (Tree & { donors?: DonorInfo[] })[] = treesData.map((t) => {
            const treeDonors = donationsByTree.get(t.id) || [];
            const primaryDonor = treeDonors[0]; // Highest amount (already sorted)

            return {
                id: t.id,
                code: t.code,
                zone: t.zone,
                lat: t.lat,
                lng: t.lng,
                status: t.status as Tree['status'],
                images: JSON.parse(t.images || '[]'),
                // Primary donor (backwards compatible)
                donorId: primaryDonor?.id,
                donorName: primaryDonor?.name,
                donorLogo: primaryDonor?.logo_url || undefined,
                donorAmount: primaryDonor?.amount,
                donorMessage: primaryDonor?.message || undefined,
                // All donors for multi-donor trees
                donors: treeDonors.length > 0 ? treeDonors : undefined,
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
