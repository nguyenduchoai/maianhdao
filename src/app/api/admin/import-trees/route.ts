import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/utils';
import { additionalTrees } from '@/data/additional-trees';

// POST /api/admin/import-trees - Import additional trees
export async function POST() {
    try {
        const insertTree = db.prepare(`
      INSERT OR IGNORE INTO trees (id, code, zone, lat, lng, status, images)
      VALUES (?, ?, ?, ?, ?, 'available', '[]')
    `);

        let imported = 0;
        for (const tree of additionalTrees) {
            const result = insertTree.run(
                generateId(),
                tree.code,
                tree.zone,
                tree.lat,
                tree.lng
            );
            if (result.changes > 0) imported++;
        }

        const totalCount = db.prepare('SELECT COUNT(*) as count FROM trees').get() as { count: number };

        return NextResponse.json({
            success: true,
            message: `Imported ${imported} new trees`,
            data: {
                imported,
                total: totalCount.count,
            },
        });
    } catch (error) {
        console.error('Error importing trees:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to import trees' },
            { status: 500 }
        );
    }
}

// GET - Check import status
export async function GET() {
    try {
        const treeCount = db.prepare('SELECT COUNT(*) as count FROM trees').get() as { count: number };
        const byZone = db.prepare('SELECT zone, COUNT(*) as count FROM trees GROUP BY zone ORDER BY zone').all();

        return NextResponse.json({
            success: true,
            data: {
                total: treeCount.count,
                byZone,
                additionalAvailable: additionalTrees.length,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to check trees' },
            { status: 500 }
        );
    }
}
