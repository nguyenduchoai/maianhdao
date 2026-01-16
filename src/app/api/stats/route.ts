import { NextResponse } from 'next/server';
import db, { getSetting } from '@/lib/db';
import { CampaignStats } from '@/types';

// GET /api/stats - Get campaign statistics
export async function GET() {
    try {
        // Get total raised from approved donations
        const totalRaisedResult = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM donations 
      WHERE status = 'approved'
    `).get() as { total: number };

        // Get total donors
        const totalDonorsResult = db.prepare(`
      SELECT COUNT(*) as count 
      FROM donations 
      WHERE status = 'approved'
    `).get() as { count: number };

        // Get trees sponsored
        const treesSponsoredResult = db.prepare(`
      SELECT COUNT(*) as count 
      FROM trees 
      WHERE status = 'sponsored'
    `).get() as { count: number };

        // Get trees available
        const treesAvailableResult = db.prepare(`
      SELECT COUNT(*) as count 
      FROM trees 
      WHERE status = 'available'
    `).get() as { count: number };

        // Get target amount from settings
        const targetAmount = parseInt(getSetting('targetAmount') || '500000000', 10);

        const totalRaised = totalRaisedResult.total || 0;
        const percentComplete = targetAmount > 0
            ? Math.round((totalRaised / targetAmount) * 100)
            : 0;

        const stats: CampaignStats = {
            totalRaised,
            targetAmount,
            totalDonors: totalDonorsResult.count,
            treesSponsored: treesSponsoredResult.count,
            treesAvailable: treesAvailableResult.count,
            percentComplete: Math.min(percentComplete, 100),
        };

        return NextResponse.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
