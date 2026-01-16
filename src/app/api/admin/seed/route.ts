import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sampleTrees, sampleSponsors, sampleDonations } from '@/data/seed';
import { generateId, getDonationTier } from '@/lib/utils';

// POST /api/admin/seed - Seed database with sample data
export async function POST() {
    try {
        // Seed trees
        const insertTree = db.prepare(`
      INSERT OR IGNORE INTO trees (id, code, zone, lat, lng, status, images)
      VALUES (?, ?, ?, ?, ?, 'available', '[]')
    `);

        for (const tree of sampleTrees) {
            insertTree.run(
                generateId(),
                tree.code,
                tree.zone,
                tree.lat,
                tree.lng
            );
        }

        // Seed sponsors
        const insertSponsor = db.prepare(`
      INSERT OR IGNORE INTO sponsors (id, name, logo_url, website, tier, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

        for (const sponsor of sampleSponsors) {
            insertSponsor.run(
                sponsor.id,
                sponsor.name,
                sponsor.logoUrl,
                sponsor.website,
                sponsor.tier,
                sponsor.displayOrder
            );
        }

        // Seed donations and update trees
        const insertDonation = db.prepare(`
      INSERT OR IGNORE INTO donations (id, name, phone, email, amount, is_organization, status, tier, tree_id)
      VALUES (?, ?, ?, ?, ?, ?, 'approved', ?, ?)
    `);

        const updateTree = db.prepare(`
      UPDATE trees SET status = 'sponsored' WHERE code = ?
    `);

        const getTreeByCode = db.prepare(`
      SELECT id FROM trees WHERE code = ?
    `);

        for (const donation of sampleDonations) {
            const tree = getTreeByCode.get(donation.treeCode) as { id: string } | undefined;
            if (tree) {
                insertDonation.run(
                    donation.id,
                    donation.name,
                    donation.phone,
                    donation.email,
                    donation.amount,
                    donation.isOrganization ? 1 : 0,
                    donation.tier,
                    tree.id
                );
                updateTree.run(donation.treeCode);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully!',
            data: {
                trees: sampleTrees.length,
                sponsors: sampleSponsors.length,
                donations: sampleDonations.length,
            },
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}

// GET /api/admin/seed - Check if database needs seeding
export async function GET() {
    try {
        const treeCount = db.prepare('SELECT COUNT(*) as count FROM trees').get() as { count: number };

        return NextResponse.json({
            success: true,
            data: {
                hasData: treeCount.count > 0,
                treeCount: treeCount.count,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to check database' },
            { status: 500 }
        );
    }
}
