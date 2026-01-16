import { CherryBlossomPetals } from '@/components/landing/CherryBlossomPetals';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
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
    // Get trees with donor info
    const treesRows = db.prepare(`
      SELECT 
        t.id, t.code, t.zone, t.lat, t.lng, t.status, t.images,
        d.id as donorId, d.name as donorName, d.amount as donorAmount, d.logo_url as donorLogo
      FROM trees t
      LEFT JOIN donations d ON t.donor_id = d.id
      ORDER BY t.code
    `).all() as any[];

    const trees: Tree[] = treesRows.map(row => ({
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

    // Get approved donations
    const donationsRows = db.prepare(`
      SELECT d.id, d.name, d.phone, d.email, d.amount, d.logo_url, d.message, 
             d.is_organization, d.status, d.tier, d.created_at,
             t.code as tree_code
      FROM donations d
      LEFT JOIN trees t ON d.tree_id = t.id
      WHERE d.status = 'approved'
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
      treeCode: row.tree_code,
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
    const treesAvailable = trees.filter(t => t.status === 'available').length;
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
      <Navbar />

      {/* Hero Section with Stats */}
      <HeroSection stats={stats} />

      {/* About Campaign Section */}
      <section id="about" className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Về Chiến Dịch
              </h2>
              <p className="font-accent text-2xl text-pink-500">
                "NGÀN CÂY ANH ĐÀO"
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="glass-card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Mục Tiêu Tài Chính</h3>
                <p className="text-2xl font-bold text-pink-600 mb-2">500 Triệu VNĐ</p>
                <p className="text-gray-600 text-sm">
                  Từ 05/01 đến 15/01/2026<br />(10 ngày cao điểm)
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌸</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ngàn Cây Anh Đào</h3>
                <p className="text-2xl font-bold text-pink-600 mb-2">200+ Cây</p>
                <p className="text-gray-600 text-sm">
                  Quanh Hồ Xuân Hương<br />và khu vực Đà Lạt
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💚</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cam Kết Bền Vững</h3>
                <p className="text-2xl font-bold text-green-600 mb-2">100%</p>
                <p className="text-gray-600 text-sm">
                  Ngân sách dư vào "Quỹ Bảo Dưỡng Xanh"<br />chăm sóc 2 năm
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 glass-card p-6">
              <h4 className="font-semibold text-gray-800 mb-3">📍 Vị Thế Địa Lý</h4>
              <p className="text-gray-600 mb-4">
                Hồ Xuân Hương là <strong>"trái tim"</strong> của Đà Lạt. Cảnh quan quanh hồ quyết định
                trực tiếp đến ấn tượng của du khách và niềm tự hào của người dân địa phương.
              </p>

              <h4 className="font-semibold text-gray-800 mb-3">🎋 Thực Trạng</h4>
              <p className="text-gray-600 mb-4">
                Mật độ Mai Anh Đào quanh hồ hiện nay chưa đồng bộ, một số cây già cỗi hoặc bị sâu bệnh.
                Việc bổ sung những cây Mai Anh Đào trưởng thành, tán đẹp là nhu cầu cấp thiết.
              </p>

              <h4 className="font-semibold text-gray-800 mb-3">✨ Cơ Hội</h4>
              <p className="text-gray-600">
                Người dân và doanh nghiệp sẵn lòng đóng góp nếu họ được <strong className="text-pink-600">"ghi danh"</strong> tại
                địa điểm đánh giá nhất thành phố này. Đây là cơ sở để thực hiện chiến dịch xã hội hóa 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <InteractiveMap trees={trees} />

      {/* Donation Form with QR */}
      <DonationForm bankInfo={bankInfo} />

      {/* Sponsors Section */}
      <SponsorsSection sponsors={sponsors} />

      {/* Donation Wall */}
      <DonationWall donations={donations} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
