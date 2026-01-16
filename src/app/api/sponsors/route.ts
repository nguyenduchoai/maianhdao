import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Sponsor } from '@/types';

// GET /api/sponsors - Get all active sponsors
export async function GET() {
    try {
        const sponsors = db.prepare(`
      SELECT * FROM sponsors 
      WHERE is_active = 1 
      ORDER BY 
        CASE tier 
          WHEN 'organizer' THEN 1 
          WHEN 'diamond' THEN 2 
          WHEN 'gold' THEN 3 
          WHEN 'silver' THEN 4 
        END,
        display_order
    `).all() as Array<{
            id: string;
            name: string;
            logo_url: string;
            website: string;
            tier: string;
            display_order: number;
            is_active: number;
            created_at: string;
        }>;

        const formattedSponsors: Sponsor[] = sponsors.map((s) => ({
            id: s.id,
            name: s.name,
            logoUrl: s.logo_url,
            website: s.website,
            tier: s.tier as Sponsor['tier'],
            displayOrder: s.display_order,
            isActive: s.is_active === 1,
            createdAt: s.created_at,
        }));

        return NextResponse.json({ success: true, data: formattedSponsors });
    } catch (error) {
        console.error('Error fetching sponsors:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch sponsors' },
            { status: 500 }
        );
    }
}
