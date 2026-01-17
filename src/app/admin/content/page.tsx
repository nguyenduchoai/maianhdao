'use client';

import { useState, useEffect } from 'react';

export default function SiteContentPage() {
    const [settings, setSettings] = useState({
        // Header
        siteName: 'Ngàn Cây Anh Đào',
        siteLogo: '',

        // Hero Section
        heroTitle: 'NGÀN CÂY ANH ĐÀO',
        heroSubtitle: 'Quanh Hồ Xuân Hương & Khu Vực Đà Lạt',
        heroTagline: 'Để Lại Dấu Ấn Tại Trái Tim Thành Phố Ngàn Hoa',
        heroDescription: 'Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào tại Hồ Xuân Hương và các khu vực trọng điểm của Đà Lạt',
        heroButtonText: 'Đóng Góp Ngay',
        heroButtonText2: 'Xem Bản Đồ Cây',

        // Stats
        statTarget: '500 triệu',
        statTargetLabel: 'Mục tiêu',
        statTrees: '200',
        statTreesLabel: 'Cây Mai Anh Đào',
        statDays: '10',
        statDaysLabel: 'Ngày cao điểm',
        statWaiting: '199',
        statWaitingLabel: 'Cây chờ đóng góp',

        // About Section
        aboutTitle: 'Về Chiến Dịch',
        aboutSubtitle: 'Xã hội hóa cảnh quan & Gây quỹ cộng đồng – Ngàn Cây Anh Đào quanh Hồ Xuân Hương',
        aboutContent1Title: 'Vị thế địa lý',
        aboutContent1: 'Hồ Xuân Hương là "trái tim" của Đà Lạt. Cảnh quan quanh hồ quyết định trực tiếp đến ấn tượng của du khách và niềm tự hào của người dân địa phương.',
        aboutContent2Title: 'Thực trạng',
        aboutContent2: 'Mật độ Mai Anh Đào quanh hồ hiện nay chưa đồng bộ, một số cây già cỗi hoặc bị sâu bệnh. Việc bổ sung những cây Mai Anh Đào trưởng thành, tán đẹp là nhu cầu cấp thiết để chỉnh trang đô thị đón Tết.',
        aboutContent3Title: 'Cơ hội',
        aboutContent3: 'Với tâm lý hướng về nguồn cội dịp Tết, người dân và doanh nghiệp rất sẵn lòng đóng góp nếu họ được "ghi danh" tại địa điểm danh giá nhất thành phố. Đây là cơ sở để thực hiện chiến dịch xã hội hóa 100%.',

        // Goals Section
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

        // Tier descriptions
        tierGieomamDesc: 'Mọi người dân',
        tierGuitraoDesc: 'Nhân viên văn phòng, Du khách yêu Đà Lạt',
        tierDauunDesc: 'Hộ gia đình, Nhóm bạn bè',
        tierKientaoDesc: 'Doanh nghiệp, Khách sạn, Nhà hàng',

        // Event Section
        eventTitle: 'Lễ Phát Động & Ra Quân',
        eventTime: '07:30 Sáng, Thứ Năm',
        eventDate: 'Ngày 18 Tháng 01, 2026',
        eventLocation: 'Khu vực bãi cỏ/công viên ven Hồ Xuân Hương thuộc địa bàn Phường',
        eventParticipants: 'Lãnh đạo Tỉnh, Lãnh đạo Phường, Doanh nghiệp, Đại diện nhân dân',
        eventProgram1: 'Báo cáo nhanh kết quả 10 ngày thần tốc',
        eventProgram2: 'Trao Giấy khen/Thư cảm ơn cho Doanh nghiệp "Kiến Tạo"',
        eventProgram3: 'Nghi thức trồng cây: Đại diện vun đất và treo biển tên',
        eventProgram4: 'Check-in quảng bá cùng cây của mình',

        // Footer
        footerText: '© 2026 Ngàn Cây Anh Đào. Vì một Đà Lạt xanh hơn.',
        footerAddress: 'Đảo Mai Anh Đào, Hồ Xuân Hương, TP. Đà Lạt, Lâm Đồng',
        footerPhone: '',
        footerEmail: '',
        footerFacebook: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'goals' | 'event' | 'footer'>('hero');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings(prev => ({ ...prev, ...data.data }));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('✅ Đã lưu thành công!');
            } else {
                setMessage('❌ ' + (data.error || 'Có lỗi xảy ra!'));
            }
            setTimeout(() => setMessage(''), 5000);
        } catch {
            setMessage('❌ Lỗi kết nối server!');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">📝 Nội Dung Website</h2>
                    <p className="text-gray-600">Chỉnh sửa nội dung hiển thị trên trang chủ</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary py-2 px-6 disabled:opacity-50"
                >
                    {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Tất Cả'}
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
                {[
                    { id: 'hero', label: '🏠 Hero & Stats' },
                    { id: 'about', label: '📋 Về Chiến Dịch' },
                    { id: 'goals', label: '🎯 Mục Tiêu' },
                    { id: 'event', label: '🎉 Sự Kiện' },
                    { id: 'footer', label: '📌 Footer' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === tab.id ? 'bg-pink-100 text-pink-700 border-b-2 border-pink-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Hero & Stats Tab */}
            {activeTab === 'hero' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🏠 Banner Chính</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề lớn</label>
                                <input type="text" value={settings.heroTitle} onChange={e => updateSetting('heroTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                                <input type="text" value={settings.heroSubtitle} onChange={e => updateSetting('heroSubtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                                <input type="text" value={settings.heroTagline} onChange={e => updateSetting('heroTagline', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea value={settings.heroDescription} onChange={e => updateSetting('heroDescription', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nút 1</label>
                                    <input type="text" value={settings.heroButtonText} onChange={e => updateSetting('heroButtonText', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nút 2</label>
                                    <input type="text" value={settings.heroButtonText2} onChange={e => updateSetting('heroButtonText2', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📊 Thống Kê (4 ô)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-3">
                                <label className="block text-xs text-gray-500">Ô 1: Số</label>
                                <input type="text" value={settings.statTarget} onChange={e => updateSetting('statTarget', e.target.value)} className="w-full px-2 py-1 border rounded mb-2" />
                                <label className="block text-xs text-gray-500">Ô 1: Label</label>
                                <input type="text" value={settings.statTargetLabel} onChange={e => updateSetting('statTargetLabel', e.target.value)} className="w-full px-2 py-1 border rounded" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <label className="block text-xs text-gray-500">Ô 2: Số</label>
                                <input type="text" value={settings.statTrees} onChange={e => updateSetting('statTrees', e.target.value)} className="w-full px-2 py-1 border rounded mb-2" />
                                <label className="block text-xs text-gray-500">Ô 2: Label</label>
                                <input type="text" value={settings.statTreesLabel} onChange={e => updateSetting('statTreesLabel', e.target.value)} className="w-full px-2 py-1 border rounded" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <label className="block text-xs text-gray-500">Ô 3: Số</label>
                                <input type="text" value={settings.statDays} onChange={e => updateSetting('statDays', e.target.value)} className="w-full px-2 py-1 border rounded mb-2" />
                                <label className="block text-xs text-gray-500">Ô 3: Label</label>
                                <input type="text" value={settings.statDaysLabel} onChange={e => updateSetting('statDaysLabel', e.target.value)} className="w-full px-2 py-1 border rounded" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <label className="block text-xs text-gray-500">Ô 4: Số</label>
                                <input type="text" value={settings.statWaiting} onChange={e => updateSetting('statWaiting', e.target.value)} className="w-full px-2 py-1 border rounded mb-2" />
                                <label className="block text-xs text-gray-500">Ô 4: Label</label>
                                <input type="text" value={settings.statWaitingLabel} onChange={e => updateSetting('statWaitingLabel', e.target.value)} className="w-full px-2 py-1 border rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📋 Section "Về Chiến Dịch"</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                <input type="text" value={settings.aboutTitle} onChange={e => updateSetting('aboutTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                                <input type="text" value={settings.aboutSubtitle} onChange={e => updateSetting('aboutSubtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">📌 Điểm {i}</h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                    <input type="text" value={(settings as Record<string, string>)[`aboutContent${i}Title`]} onChange={e => updateSetting(`aboutContent${i}Title`, e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                    <textarea value={(settings as Record<string, string>)[`aboutContent${i}`]} onChange={e => updateSetting(`aboutContent${i}`, e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🎯 Tiêu đề Section</h3>
                        <input type="text" value={settings.goalsTitle} onChange={e => updateSetting('goalsTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">💰 Mục Tiêu Tài Chính</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" value={settings.goalFinanceTitle} onChange={e => updateSetting('goalFinanceTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu đề" />
                            <input type="text" value={settings.goalFinanceAmount} onChange={e => updateSetting('goalFinanceAmount', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Số tiền" />
                            <input type="text" value={settings.goalFinanceNote} onChange={e => updateSetting('goalFinanceNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Ghi chú" />
                            <input type="text" value={settings.goalFinanceTime} onChange={e => updateSetting('goalFinanceTime', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Thời gian" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🌸 Mục Tiêu Hiện Vật</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" value={settings.goalTreeTitle} onChange={e => updateSetting('goalTreeTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu đề" />
                            <input type="text" value={settings.goalTreeAmount} onChange={e => updateSetting('goalTreeAmount', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Số cây" />
                            <input type="text" value={settings.goalTreeNote} onChange={e => updateSetting('goalTreeNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Loại cây" />
                            <input type="text" value={settings.goalTreeSpec1} onChange={e => updateSetting('goalTreeSpec1', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu chuẩn 1" />
                            <input type="text" value={settings.goalTreeSpec2} onChange={e => updateSetting('goalTreeSpec2', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu chuẩn 2" />
                            <input type="text" value={settings.goalTreeSpec3} onChange={e => updateSetting('goalTreeSpec3', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu chuẩn 3" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🛡️ Cam Kết Đặc Biệt</h3>
                        <div className="grid gap-4">
                            <input type="text" value={settings.goalCommitTitle} onChange={e => updateSetting('goalCommitTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu đề" />
                            <input type="text" value={settings.goalCommitContent} onChange={e => updateSetting('goalCommitContent', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Nội dung" />
                            <input type="text" value={settings.goalCommitNote} onChange={e => updateSetting('goalCommitNote', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Ghi chú" />
                            <input type="text" value={settings.goalCommitHighlight} onChange={e => updateSetting('goalCommitHighlight', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Highlight" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🏆 Mô tả Cấp Độ</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">🌱 GIEO MẦM</label>
                                <input type="text" value={settings.tierGieomamDesc} onChange={e => updateSetting('tierGieomamDesc', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">💝 GỬI TRAO</label>
                                <input type="text" value={settings.tierGuitraoDesc} onChange={e => updateSetting('tierGuitraoDesc', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">🌸 DẤU ẤN</label>
                                <input type="text" value={settings.tierDauunDesc} onChange={e => updateSetting('tierDauunDesc', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">🏆 KIẾN TẠO</label>
                                <input type="text" value={settings.tierKientaoDesc} onChange={e => updateSetting('tierKientaoDesc', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Tab */}
            {activeTab === 'event' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🎉 Thông Tin Sự Kiện</h3>
                        <div className="grid gap-4">
                            <input type="text" value={settings.eventTitle} onChange={e => updateSetting('eventTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Tiêu đề" />
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" value={settings.eventTime} onChange={e => updateSetting('eventTime', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Thời gian" />
                                <input type="text" value={settings.eventDate} onChange={e => updateSetting('eventDate', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Ngày" />
                            </div>
                            <input type="text" value={settings.eventLocation} onChange={e => updateSetting('eventLocation', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Địa điểm" />
                            <input type="text" value={settings.eventParticipants} onChange={e => updateSetting('eventParticipants', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Thành phần" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📋 Nội Dung Chương Trình (4 mục)</h3>
                        <div className="grid gap-4">
                            <input type="text" value={settings.eventProgram1} onChange={e => updateSetting('eventProgram1', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Mục 1" />
                            <input type="text" value={settings.eventProgram2} onChange={e => updateSetting('eventProgram2', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Mục 2" />
                            <input type="text" value={settings.eventProgram3} onChange={e => updateSetting('eventProgram3', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Mục 3" />
                            <input type="text" value={settings.eventProgram4} onChange={e => updateSetting('eventProgram4', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Mục 4" />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">📌 Footer</h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
                            <input type="text" value={settings.siteName} onChange={e => updateSetting('siteName', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Text copyright</label>
                            <input type="text" value={settings.footerText} onChange={e => updateSetting('footerText', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input type="text" value={settings.footerAddress} onChange={e => updateSetting('footerAddress', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                                <input type="text" value={settings.footerPhone} onChange={e => updateSetting('footerPhone', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={settings.footerEmail} onChange={e => updateSetting('footerEmail', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <input type="url" value={settings.footerFacebook} onChange={e => updateSetting('footerFacebook', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-6">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary py-3 px-6 shadow-lg disabled:opacity-50"
                >
                    {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Tất Cả'}
                </button>
            </div>
        </div>
    );
}
