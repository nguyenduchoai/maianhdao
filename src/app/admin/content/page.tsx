'use client';

import { useState, useEffect } from 'react';

export default function SiteContentPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'tiers' | 'event' | 'finance' | 'footer'>('hero');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings(data.data);
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

    const InputField = ({ label, settingKey, placeholder, type = 'text', rows }: { label: string; settingKey: string; placeholder?: string; type?: string; rows?: number }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {rows ? (
                <textarea
                    value={settings[settingKey] || ''}
                    onChange={e => updateSetting(settingKey, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder={placeholder || label}
                    rows={rows}
                />
            ) : (
                <input
                    type={type}
                    value={settings[settingKey] || ''}
                    onChange={e => updateSetting(settingKey, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder={placeholder || label}
                />
            )}
        </div>
    );

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
                    <p className="text-gray-600">Chỉnh sửa toàn bộ nội dung hiển thị trên trang chủ</p>
                </div>
                <button onClick={handleSave} disabled={isSaving} className="btn-primary py-2 px-6 disabled:opacity-50">
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
                    { id: 'tiers', label: '💎 Cấp Đóng Góp' },
                    { id: 'event', label: '🎉 Sự Kiện' },
                    { id: 'finance', label: '📊 Tài Chính' },
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

            {/* Hero Tab */}
            {activeTab === 'hero' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🏠 Banner Chính</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề lớn" settingKey="heroTitle" placeholder="NGÀN CÂY ANH ĐÀO" />
                            <InputField label="Phụ đề" settingKey="heroSubtitle" placeholder="Quanh Hồ Xuân Hương & Khu Vực Đà Lạt" />
                            <InputField label="Slogan" settingKey="heroTagline" placeholder="Để Lại Dấu Ấn Tại Trái Tim Thành Phố Ngàn Hoa" />
                            <InputField label="Mô tả" settingKey="heroDescription" rows={2} />
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Nút 1" settingKey="heroButtonText" placeholder="Đóng Góp Ngay" />
                                <InputField label="Nút 2" settingKey="heroButtonText2" placeholder="Xem Bản Đồ Cây" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📊 Thống Kê (4 ô)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-3">
                                <InputField label="Ô 1: Số" settingKey="statTarget" placeholder="500 triệu" />
                                <InputField label="Ô 1: Label" settingKey="statTargetLabel" placeholder="Mục tiêu" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <InputField label="Ô 2: Số" settingKey="statTrees" placeholder="200" />
                                <InputField label="Ô 2: Label" settingKey="statTreesLabel" placeholder="Cây Mai Anh Đào" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <InputField label="Ô 3: Số" settingKey="statDays" placeholder="10" />
                                <InputField label="Ô 3: Label" settingKey="statDaysLabel" placeholder="Ngày cao điểm" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <InputField label="Ô 4: Số" settingKey="statWaiting" placeholder="199" />
                                <InputField label="Ô 4: Label" settingKey="statWaitingLabel" placeholder="Cây chờ đóng góp" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📋 Tiêu đề Section</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="aboutTitle" placeholder="Về Chiến Dịch" />
                            <InputField label="Phụ đề" settingKey="aboutSubtitle" />
                            <InputField label="Tiêu đề box" settingKey="aboutBoxTitle" placeholder="Căn Cứ & Tính Cấp Thiết" />
                        </div>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">📌 Điểm {i}</h3>
                            <div className="grid gap-4">
                                <InputField label="Tiêu đề" settingKey={`aboutContent${i}Title`} />
                                <InputField label="Nội dung" settingKey={`aboutContent${i}`} rows={3} />
                            </div>
                        </div>
                    ))}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📣 Mục Tiêu Lan Tỏa</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="spreadTitle" placeholder="Mục Tiêu Lan Tỏa" />
                            <InputField label="Nội dung 1" settingKey="spreadContent1" rows={2} />
                            <InputField label="Nội dung 2" settingKey="spreadContent2" rows={2} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🎯 Mục Tiêu Đề Án</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề section" settingKey="goalsTitle" placeholder="Mục Tiêu Đề Án (10 Ngày Cao Điểm)" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div className="border rounded-lg p-3">
                                <p className="font-medium mb-2">💰 Tài Chính</p>
                                <InputField label="Tiêu đề" settingKey="goalFinanceTitle" />
                                <InputField label="Số tiền" settingKey="goalFinanceAmount" />
                                <InputField label="Ghi chú" settingKey="goalFinanceNote" />
                                <InputField label="Thời gian" settingKey="goalFinanceTime" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <p className="font-medium mb-2">🌸 Hiện Vật</p>
                                <InputField label="Tiêu đề" settingKey="goalTreeTitle" />
                                <InputField label="Số cây" settingKey="goalTreeAmount" />
                                <InputField label="Loại" settingKey="goalTreeNote" />
                                <InputField label="Label" settingKey="goalTreeLabel" placeholder="Tiêu chuẩn Cây Di sản:" />
                                <InputField label="Tiêu chuẩn 1" settingKey="goalTreeSpec1" />
                                <InputField label="Tiêu chuẩn 2" settingKey="goalTreeSpec2" />
                                <InputField label="Tiêu chuẩn 3" settingKey="goalTreeSpec3" />
                            </div>
                            <div className="border rounded-lg p-3">
                                <p className="font-medium mb-2">🛡️ Cam Kết</p>
                                <InputField label="Tiêu đề" settingKey="goalCommitTitle" />
                                <InputField label="Nội dung" settingKey="goalCommitContent" />
                                <InputField label="Ghi chú" settingKey="goalCommitNote" />
                                <InputField label="Highlight" settingKey="goalCommitHighlight" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tiers Tab */}
            {activeTab === 'tiers' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">💎 Tiêu đề Section</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="tiersTitle" placeholder='Chiến Lược Gây Quỹ: "Để Lại Di Sản"' />
                            <InputField label="Phụ đề" settingKey="tiersSubtitle" />
                            <InputField label="Label Mức" settingKey="tierLevelLabel" placeholder="Mức" />
                            <InputField label="Label Quyền lợi" settingKey="tierBenefitsLabel" placeholder="Quyền lợi" />
                            <InputField label="Nút CTA" settingKey="tierCTAButton" placeholder="Đóng Góp Ngay" />
                        </div>
                    </div>
                    {[
                        { num: 1, name: 'GIEO MẦM', color: 'green' },
                        { num: 2, name: 'GỬI TRAO', color: 'blue' },
                        { num: 3, name: 'DẤU ẤN', color: 'pink' },
                        { num: 4, name: 'KIẾN TẠO', color: 'yellow' },
                    ].map(tier => (
                        <div key={tier.num} className={`bg-white rounded-lg shadow-sm p-6 border-l-4 border-${tier.color}-400`}>
                            <h3 className="font-semibold text-gray-800 mb-4">Mức {tier.num}: {tier.name}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Tên" settingKey={`tier${tier.num}Name`} placeholder={tier.name} />
                                <InputField label="Mức giá" settingKey={`tier${tier.num}Range`} />
                                <InputField label="Đối tượng" settingKey={tier.num === 1 ? 'tierGieomamDesc' : tier.num === 2 ? 'tierGuitraoDesc' : tier.num === 3 ? 'tierDauunDesc' : 'tierKientaoDesc'} />
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">Quyền lợi:</p>
                                {[1, 2, 3, 4].map(b => (
                                    <InputField key={b} label={`Quyền lợi ${b}`} settingKey={`tier${tier.num}Benefit${b}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Event Tab */}
            {activeTab === 'event' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🎉 Thông Tin Sự Kiện</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="eventTitle" placeholder="Lễ Phát Động & Ra Quân" />
                            <InputField label="Label thời gian" settingKey="eventTimeLabel" placeholder="Thời gian" />
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Thời gian" settingKey="eventTime" placeholder="07:30 Sáng, Thứ Năm" />
                                <InputField label="Ngày" settingKey="eventDate" placeholder="Ngày 18 Tháng 01, 2026" />
                            </div>
                            <InputField label="Label địa điểm" settingKey="eventLocationLabel" placeholder="Địa điểm" />
                            <InputField label="Địa điểm" settingKey="eventLocation" />
                            <InputField label="Label thành phần" settingKey="eventParticipantsLabel" placeholder="Thành phần" />
                            <InputField label="Thành phần" settingKey="eventParticipants" />
                            <InputField label="Label chương trình" settingKey="eventProgramLabel" placeholder="Nội dung chương trình" />
                            <InputField label="Mục 1" settingKey="eventProgram1" />
                            <InputField label="Mục 2" settingKey="eventProgram2" />
                            <InputField label="Mục 3" settingKey="eventProgram3" />
                            <InputField label="Mục 4" settingKey="eventProgram4" />
                        </div>
                    </div>
                </div>
            )}

            {/* Finance Tab */}
            {activeTab === 'finance' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📊 Cơ Cấu Tài Chính</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="financeTitle" placeholder="Cơ Cấu Tài Chính" />
                            <InputField label="Phụ đề" settingKey="financeSubtitle" placeholder="MINH BẠCH TUYỆT ĐỐI" />
                            <InputField label="Label tổng" settingKey="financeTotalLabel" placeholder="Tổng thu dự kiến" />
                            <InputField label="Tổng số tiền" settingKey="financeTotalAmount" placeholder="500.000.000 VNĐ" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🌱 Chi Phí Cây Giống (60%)</h3>
                        <div className="grid gap-4">
                            <InputField label="%" settingKey="financeTreePercent" placeholder="60%" />
                            <InputField label="Tiêu đề" settingKey="financeTreeTitle" placeholder="Chi Phí Cây Giống" />
                            <InputField label="Số tiền" settingKey="financeTreeAmount" placeholder="300 Triệu" />
                            <InputField label="Mô tả" settingKey="financeTreeDesc" rows={2} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🛡️ Quỹ Chăm Sóc (30%)</h3>
                        <div className="grid gap-4">
                            <InputField label="%" settingKey="financeCarePercent" placeholder="30%" />
                            <InputField label="Tiêu đề" settingKey="financeCareTitle" placeholder="Quỹ Chăm Sóc Cây" />
                            <InputField label="Số tiền" settingKey="financeCareAmount" placeholder="150 Triệu" />
                            <InputField label="Mô tả" settingKey="financeCareDesc" rows={2} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🎨 Tổ Chức & Truyền Thông (10%)</h3>
                        <div className="grid gap-4">
                            <InputField label="%" settingKey="financeOrgPercent" placeholder="10%" />
                            <InputField label="Tiêu đề" settingKey="financeOrgTitle" placeholder="Tổ Chức & Truyền Thông" />
                            <InputField label="Số tiền" settingKey="financeOrgAmount" placeholder="50 Triệu" />
                            <InputField label="Mô tả" settingKey="financeOrgDesc" rows={2} />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🌸 Cột 1: Giới thiệu</h3>
                        <div className="grid gap-4">
                            <InputField label="Tên website" settingKey="siteName" placeholder="NGÀN CÂY ANH ĐÀO" />
                            <InputField label="Mô tả footer" settingKey="footerAbout" rows={3} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📞 Cột 2: Liên hệ</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="footerContactTitle" placeholder="Liên Hệ" />
                            <InputField label="Địa chỉ" settingKey="footerAddress" />
                            <InputField label="Điện thoại" settingKey="footerPhone" />
                            <InputField label="Email" settingKey="footerEmail" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">🔗 Cột 3: Liên kết</h3>
                        <div className="grid gap-4">
                            <InputField label="Tiêu đề" settingKey="footerLinksTitle" placeholder="Liên Kết" />
                            <InputField label="Link Bản đồ" settingKey="footerLinkMap" placeholder="Bản đồ cây" />
                            <InputField label="Link Đóng góp" settingKey="footerLinkDonate" placeholder="Đóng góp" />
                            <InputField label="Link Nhà tài trợ" settingKey="footerLinkSponsors" placeholder="Nhà tài trợ" />
                            <InputField label="Link Ghi danh" settingKey="footerLinkDonors" placeholder="Danh sách ghi danh" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">📋 Thông tin chiến dịch</h3>
                        <div className="grid gap-4">
                            <InputField label="Thời gian" settingKey="footerCampaignTime" placeholder="05/01/2026 - 15/01/2026 (10 ngày cao điểm)" />
                            <InputField label="Mục tiêu" settingKey="footerCampaignGoal" placeholder="500.000.000 VNĐ | Ngàn cây hoa Anh Đào cho Đà Lạt" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">© Copyright</h3>
                        <div className="grid gap-4">
                            <InputField label="Dòng copyright" settingKey="footerCopyright" placeholder="© 2026 Chiến dịch NGÀN CÂY ANH ĐÀO - Hội DNT tỉnh Lâm Đồng." />
                            <p className="text-sm text-gray-500">* Link Bizino.ai được giữ cố định</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-6">
                <button onClick={handleSave} disabled={isSaving} className="btn-primary py-3 px-6 shadow-lg disabled:opacity-50">
                    {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Tất Cả'}
                </button>
            </div>
        </div>
    );
}
