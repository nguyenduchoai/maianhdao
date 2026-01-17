import { NextResponse } from 'next/server';
import { getAllSettings } from '@/lib/db';

// GET /api/site-settings - Public API to get site settings
export async function GET() {
    try {
        const settings = getAllSettings();

        return NextResponse.json({
            success: true,
            data: {
                // Header/Logo
                siteName: settings.siteName || 'Ngàn Cây Anh Đào',
                siteLogo: settings.siteLogo || '',

                // Hero Section
                heroTitle: settings.heroTitle || 'Để Lại Dấu Ấn Tại Trái Tim Đà Lạt',
                heroSubtitle: settings.heroSubtitle || 'Xã hội hóa cảnh quan & Gây quỹ cộng đồng - Đảo Mai Anh Đào',
                heroButtonText: settings.heroButtonText || 'Đóng Góp Ngay',
                heroBackgroundImage: settings.heroBackgroundImage || '',

                // About Section
                aboutTitle: settings.aboutTitle || 'Về Chiến Dịch',
                aboutContent: settings.aboutContent || '',

                // Event Section
                eventTitle: settings.eventTitle || 'Sự Kiện',
                eventDate: settings.eventDate || '18/01/2026',
                eventLocation: settings.eventLocation || 'Đảo Mai Anh Đào, Hồ Xuân Hương, Đà Lạt',
                eventDescription: settings.eventDescription || '',

                // Donation Info
                donationTitle: settings.donationTitle || 'Đóng Góp Ngay',
                donationDescription: settings.donationDescription || 'Quét mã QR để đóng góp và được ghi danh trên bản đồ Mai Anh Đào',

                // Footer
                footerText: settings.footerText || '© 2026 Ngàn Cây Anh Đào. Vì một Đà Lạt xanh hơn.',
                footerAddress: settings.footerAddress || 'Đảo Mai Anh Đào, Hồ Xuân Hương, TP. Đà Lạt, Lâm Đồng',
                footerPhone: settings.footerPhone || '',
                footerEmail: settings.footerEmail || '',
                footerFacebook: settings.footerFacebook || '',

                // Bank Info
                bankName: settings.bankName || 'MSB',
                accountNumber: settings.accountNumber || '991977',
                accountHolder: settings.accountHolder || 'Hội Doanh nhân trẻ tỉnh Lâm Đồng',

                // Target
                targetAmount: settings.targetAmount || '500000000',
                campaignStart: settings.campaignStart || '2026-01-05',
                campaignEnd: settings.campaignEnd || '2026-01-18',
            },
        });
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi lấy cài đặt' },
            { status: 500 }
        );
    }
}
