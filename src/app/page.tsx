import { CherryBlossomPetals } from '@/components/landing/CherryBlossomPetals';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { DonationTiersSection } from '@/components/landing/DonationTiersSection';
import { EventSection } from '@/components/landing/EventSection';
import { SponsorsSection } from '@/components/landing/SponsorsSection';
import { DonationForm } from '@/components/landing/DonationForm';
import { DonationWall } from '@/components/landing/DonationWall';
import { Footer } from '@/components/landing/Footer';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import db, { getAllSettings } from '@/lib/db';
import { CampaignStats, Tree, Sponsor, Donation } from '@/types';

// This page uses dynamic data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPageData() {
  try {
    // Get trees with donor info via junction table (get highest amount donor per tree)
    const treesRows = db.prepare(`
      SELECT 
        t.id, t.code, t.zone, t.lat, t.lng, t.status, t.images,
        d.id as donorId, d.name as donorName, d.amount as donorAmount, 
        d.logo_url as donorLogo, d.message as donorMessage
      FROM trees t
      LEFT JOIN donation_trees dt ON dt.tree_id = t.id
      LEFT JOIN donations d ON d.id = dt.donation_id AND d.status = 'approved'
      ORDER BY t.zone, t.code
    `).all() as any[];

    // Group by tree to avoid duplicates (take first/highest donation)
    const treeMap = new Map<string, any>();
    for (const row of treesRows) {
      if (!treeMap.has(row.id) || (row.donorAmount && row.donorAmount > (treeMap.get(row.id).donorAmount || 0))) {
        treeMap.set(row.id, row);
      }
    }

    const trees: Tree[] = Array.from(treeMap.values()).map(row => ({
      id: row.id,
      code: row.code,
      zone: row.zone,
      lat: row.lat,
      lng: row.lng,
      status: row.status,
      images: row.images ? JSON.parse(row.images) : [],
      donorId: row.donorId,
      donorName: row.donorName,
      donorAmount: row.donorAmount,
      donorLogo: row.donorLogo,
      donorMessage: row.donorMessage,
    }));

    // Get sponsors
    const sponsorsRows = db.prepare(`
      SELECT id, name, logo_url, website, tier, display_order, is_active
      FROM sponsors
      WHERE is_active = 1
      ORDER BY 
        CASE tier WHEN 'organizer' THEN 1 WHEN 'diamond' THEN 2 WHEN 'gold' THEN 3 WHEN 'silver' THEN 4 ELSE 5 END,
        display_order
    `).all() as any[];

    const sponsors: Sponsor[] = sponsorsRows.map(row => ({
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url,
      website: row.website,
      tier: row.tier,
      displayOrder: row.display_order,
      isActive: row.is_active === 1,
    }));

    // Get approved donations with tree codes from junction table
    const donationsRows = db.prepare(`
      SELECT d.id, d.name, d.phone, d.email, d.amount, d.logo_url, d.message, 
             d.is_organization, d.status, d.tier, d.created_at,
             GROUP_CONCAT(t.code, ', ') as tree_codes
      FROM donations d
      LEFT JOIN donation_trees dt ON dt.donation_id = d.id
      LEFT JOIN trees t ON t.id = dt.tree_id
      WHERE d.status = 'approved'
      GROUP BY d.id
      ORDER BY d.amount DESC, d.created_at DESC
    `).all() as any[];

    const donations: Donation[] = donationsRows.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      amount: row.amount,
      logoUrl: row.logo_url,
      message: row.message,
      isOrganization: row.is_organization === 1,
      status: row.status,
      tier: row.tier,
      treeCode: row.tree_codes, // Now contains comma-separated tree codes
      createdAt: row.created_at,
    }));

    // Calculate stats
    const totalRaised = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE status = 'approved'
    `).get() as { total: number };

    const totalDonors = db.prepare(`
      SELECT COUNT(*) as count FROM donations WHERE status = 'approved'
    `).get() as { count: number };

    const treesSponsored = trees.filter(t => t.status === 'sponsored').length;
    const targetTrees = 200; // Mục tiêu 200 cây
    const treesAvailable = targetTrees - treesSponsored; // Cây chờ đóng góp = Mục tiêu - Đã sponsor
    const targetAmount = 500000000;

    const stats: CampaignStats = {
      totalRaised: totalRaised.total,
      targetAmount,
      totalDonors: totalDonors.count,
      treesSponsored,
      treesAvailable,
      percentComplete: Math.round((totalRaised.total / targetAmount) * 100),
    };

    // Get settings
    const settings = getAllSettings();

    return {
      stats,
      trees,
      sponsors,
      donations,
      settings,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      stats: {
        totalRaised: 0,
        targetAmount: 500000000,
        totalDonors: 0,
        treesSponsored: 0,
        treesAvailable: 200,
        percentComplete: 0,
      } as CampaignStats,
      trees: [],
      sponsors: [],
      donations: [],
      settings: {
        bankName: 'MSB',
        accountNumber: '991977',
        accountHolder: 'Hội DNT tỉnh Lâm Đồng',
      },
    };
  }
}

export default async function HomePage() {
  const { stats, trees, sponsors, donations, settings } = await getPageData();

  const bankInfo = {
    bankName: settings.bankName || 'MSB',
    accountNumber: settings.accountNumber || '991977',
    accountHolder: settings.accountHolder || 'Hội DNT tỉnh Lâm Đồng',
  };

  return (
    <main className="min-h-screen">
      {/* Floating Cherry Blossom Petals */}
      <CherryBlossomPetals />

      {/* Navigation */}
      <Navbar settings={settings} />

      {/* Hero Section with Stats */}
      <HeroSection stats={stats} settings={settings} />

      {/* About Campaign Section */}
      <AboutSection settings={settings} />

      {/* Donation Tiers */}
      <DonationTiersSection settings={settings} />

      {/* Event & Financial Transparency */}
      <EventSection settings={settings} />

      {/* Interactive Map */}
      <InteractiveMap trees={trees} />

      {/* Donation Form with QR */}
      <DonationForm bankInfo={bankInfo} />

      {/* Sponsors Section */}
      <SponsorsSection sponsors={sponsors} settings={settings} />

      {/* Donation Wall */}
      <DonationWall donations={donations} settings={settings} />

      {/* Footer */}
      <Footer settings={settings} />
    </main>
  );
}
