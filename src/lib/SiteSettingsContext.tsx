'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
    // Header
    siteName: string;
    siteLogo: string;

    // Hero
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    heroDescription: string;
    heroButtonText: string;
    heroButtonText2: string;

    // Stats
    statTarget: string;
    statTargetLabel: string;
    statTrees: string;
    statTreesLabel: string;
    statDays: string;
    statDaysLabel: string;
    statWaiting: string;
    statWaitingLabel: string;

    // About
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent1Title: string;
    aboutContent1: string;
    aboutContent2Title: string;
    aboutContent2: string;
    aboutContent3Title: string;
    aboutContent3: string;

    // Goals
    goalsTitle: string;
    goalFinanceTitle: string;
    goalFinanceAmount: string;
    goalFinanceNote: string;
    goalFinanceTime: string;
    goalTreeTitle: string;
    goalTreeAmount: string;
    goalTreeNote: string;
    goalTreeSpec1: string;
    goalTreeSpec2: string;
    goalTreeSpec3: string;
    goalCommitTitle: string;
    goalCommitContent: string;
    goalCommitNote: string;
    goalCommitHighlight: string;

    // Tiers
    tierGieomamDesc: string;
    tierGuitraoDesc: string;
    tierDauunDesc: string;
    tierKientaoDesc: string;

    // Event
    eventTitle: string;
    eventTime: string;
    eventDate: string;
    eventLocation: string;
    eventParticipants: string;
    eventProgram1: string;
    eventProgram2: string;
    eventProgram3: string;
    eventProgram4: string;

    // Footer
    footerText: string;
    footerAddress: string;
    footerPhone: string;
    footerEmail: string;
    footerFacebook: string;

    // Bank
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    targetAmount: string;
}

const defaultSettings: SiteSettings = {
    siteName: 'Ngàn Cây Anh Đào',
    siteLogo: '',
    heroTitle: 'NGÀN CÂY ANH ĐÀO',
    heroSubtitle: 'Quanh Hồ Xuân Hương & Khu Vực Đà Lạt',
    heroTagline: 'Để Lại Dấu Ấn Tại Trái Tim Thành Phố Ngàn Hoa',
    heroDescription: 'Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào tại Hồ Xuân Hương và các khu vực trọng điểm của Đà Lạt',
    heroButtonText: 'Đóng Góp Ngay',
    heroButtonText2: 'Xem Bản Đồ Cây',
    statTarget: '500 triệu',
    statTargetLabel: 'Mục tiêu',
    statTrees: '200',
    statTreesLabel: 'Cây Mai Anh Đào',
    statDays: '10',
    statDaysLabel: 'Ngày cao điểm',
    statWaiting: '199',
    statWaitingLabel: 'Cây chờ đóng góp',
    aboutTitle: 'Về Chiến Dịch',
    aboutSubtitle: 'Xã hội hóa cảnh quan & Gây quỹ cộng đồng – Ngàn Cây Anh Đào quanh Hồ Xuân Hương',
    aboutContent1Title: 'Vị thế địa lý',
    aboutContent1: 'Hồ Xuân Hương là "trái tim" của Đà Lạt. Cảnh quan quanh hồ quyết định trực tiếp đến ấn tượng của du khách và niềm tự hào của người dân địa phương.',
    aboutContent2Title: 'Thực trạng',
    aboutContent2: 'Mật độ Mai Anh Đào quanh hồ hiện nay chưa đồng bộ, một số cây già cỗi hoặc bị sâu bệnh. Việc bổ sung những cây Mai Anh Đào trưởng thành, tán đẹp là nhu cầu cấp thiết để chỉnh trang đô thị đón Tết.',
    aboutContent3Title: 'Cơ hội',
    aboutContent3: 'Với tâm lý hướng về nguồn cội dịp Tết, người dân và doanh nghiệp rất sẵn lòng đóng góp nếu họ được "ghi danh" tại địa điểm danh giá nhất thành phố. Đây là cơ sở để thực hiện chiến dịch xã hội hóa 100%.',
    goalsTitle: 'Mục Tiêu Đề Án (10 Ngày Cao Điểm)',
    goalFinanceTitle: 'Mục Tiêu Tài Chính',
    goalFinanceAmount: '500.000.000 VNĐ',
    goalFinanceNote: '(Năm trăm triệu đồng)',
    goalFinanceTime: 'Thời gian: 05/01 - 15/01/2026',
    goalTreeTitle: 'Mục Tiêu Hiện Vật',
    goalTreeAmount: '200 Cây',
    goalTreeNote: 'Mai Anh Đào',
    goalTreeSpec1: 'Cao >3m',
    goalTreeSpec2: 'Đường kính gốc >10cm',
    goalTreeSpec3: 'Dáng đẹp, tán đều',
    goalCommitTitle: 'Cam Kết Đặc Biệt',
    goalCommitContent: '100% ngân sách dư được đưa vào "Quỹ Bảo Dưỡng Xanh"',
    goalCommitNote: 'Thuê nhân sự chuyên nghiệp chăm sóc trong 24 tháng',
    goalCommitHighlight: 'Đảm bảo cây sống và ra hoa!',
    tierGieomamDesc: 'Mọi người dân',
    tierGuitraoDesc: 'Nhân viên văn phòng, Du khách yêu Đà Lạt',
    tierDauunDesc: 'Hộ gia đình, Nhóm bạn bè',
    tierKientaoDesc: 'Doanh nghiệp, Khách sạn, Nhà hàng',
    eventTitle: 'Lễ Phát Động & Ra Quân',
    eventTime: '07:30 Sáng, Thứ Năm',
    eventDate: 'Ngày 18 Tháng 01, 2026',
    eventLocation: 'Khu vực bãi cỏ/công viên ven Hồ Xuân Hương thuộc địa bàn Phường',
    eventParticipants: 'Lãnh đạo Tỉnh, Lãnh đạo Phường, Doanh nghiệp, Đại diện nhân dân',
    eventProgram1: 'Báo cáo nhanh kết quả 10 ngày thần tốc',
    eventProgram2: 'Trao Giấy khen/Thư cảm ơn cho Doanh nghiệp "Kiến Tạo"',
    eventProgram3: 'Nghi thức trồng cây: Đại diện vun đất và treo biển tên',
    eventProgram4: 'Check-in quảng bá cùng cây của mình',
    footerText: '© 2026 Ngàn Cây Anh Đào. Vì một Đà Lạt xanh hơn.',
    footerAddress: 'Đảo Mai Anh Đào, Hồ Xuân Hương, TP. Đà Lạt, Lâm Đồng',
    footerPhone: '',
    footerEmail: '',
    footerFacebook: '',
    bankName: 'MSB',
    accountNumber: '991977',
    accountHolder: 'Hội Doanh nhân trẻ tỉnh Lâm Đồng',
    targetAmount: '500000000',
};

interface SiteSettingsContextType {
    settings: SiteSettings;
    isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    settings: defaultSettings,
    isLoading: true,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/site-settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings(prev => ({ ...prev, ...data.data }));
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, isLoading }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}

export type { SiteSettings };
