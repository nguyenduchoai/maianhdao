import { CherryBlossomPetals } from '@/components/landing/CherryBlossomPetals';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SponsorsSection } from '@/components/landing/SponsorsSection';
import { DonationForm } from '@/components/landing/DonationForm';
import { DonationWall } from '@/components/landing/DonationWall';
import { Footer } from '@/components/landing/Footer';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { getAllSettings } from '@/lib/db';

// This page uses dynamic data, so we need to opt out of static generation
export const dynamic = 'force-dynamic';

async function getPageData() {
  try {
    // Fetch stats
    const statsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stats`, {
      cache: 'no-store',
    });
    const statsData = statsRes.ok ? await statsRes.json() : { data: null };

    // Fetch trees
    const treesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trees`, {
      cache: 'no-store',
    });
    const treesData = treesRes.ok ? await treesRes.json() : { data: [] };

    // Fetch sponsors
    const sponsorsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sponsors`, {
      cache: 'no-store',
    });
    const sponsorsData = sponsorsRes.ok ? await sponsorsRes.json() : { data: [] };

    // Fetch donations
    const donationsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/donations`, {
      cache: 'no-store',
    });
    const donationsData = donationsRes.ok ? await donationsRes.json() : { data: [] };

    // Get settings
    const settings = getAllSettings();

    return {
      stats: statsData.data,
      trees: treesData.data || [],
      sponsors: sponsorsData.data || [],
      donations: donationsData.data || [],
      settings,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      stats: null,
      trees: [],
      sponsors: [],
      donations: [],
      settings: {
        bankName: 'Vietcombank',
        accountNumber: '0123456789',
        accountHolder: 'Quỹ Mai Anh Đào Đà Lạt',
      },
    };
  }
}

export default async function HomePage() {
  const { stats, trees, sponsors, donations, settings } = await getPageData();

  const bankInfo = {
    bankName: settings.bankName || 'Vietcombank',
    accountNumber: settings.accountNumber || '0123456789',
    accountHolder: settings.accountHolder || 'Quỹ Mai Anh Đào Đà Lạt',
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
                "Để Lại Di Sản"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Hiện Vật & Chất Lượng</h3>
                <p className="text-2xl font-bold text-pink-600 mb-2">200 Cây</p>
                <p className="text-gray-600 text-sm">
                  Mai Anh Đào trưởng thành<br />Cao &gt;3m, gốc &gt;10cm
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
