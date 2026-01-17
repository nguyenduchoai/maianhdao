'use client';

import { useState, useEffect } from 'react';

export default function SiteContentPage() {
    const [settings, setSettings] = useState({
        siteName: 'Ngàn Cây Anh Đào',
        siteLogo: '',
        heroTitle: 'Để Lại Dấu Ấn Tại Trái Tim Đà Lạt',
        heroSubtitle: 'Xã hội hóa cảnh quan & Gây quỹ cộng đồng - Đảo Mai Anh Đào',
        heroButtonText: 'Đóng Góp Ngay',
        eventDate: '18/01/2026',
        eventLocation: 'Đảo Mai Anh Đào, Hồ Xuân Hương, Đà Lạt',
        footerText: '© 2026 Ngàn Cây Anh Đào. Vì một Đà Lạt xanh hơn.',
        footerAddress: 'Đảo Mai Anh Đào, Hồ Xuân Hương, TP. Đà Lạt, Lâm Đồng',
        footerPhone: '',
        footerEmail: '',
        footerFacebook: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings(prev => ({
                        ...prev,
                        siteName: data.data.siteName || prev.siteName,
                        siteLogo: data.data.siteLogo || '',
                        heroTitle: data.data.heroTitle || prev.heroTitle,
                        heroSubtitle: data.data.heroSubtitle || prev.heroSubtitle,
                        heroButtonText: data.data.heroButtonText || prev.heroButtonText,
                        eventDate: data.data.eventDate || prev.eventDate,
                        eventLocation: data.data.eventLocation || prev.eventLocation,
                        footerText: data.data.footerText || prev.footerText,
                        footerAddress: data.data.footerAddress || prev.footerAddress,
                        footerPhone: data.data.footerPhone || '',
                        footerEmail: data.data.footerEmail || '',
                        footerFacebook: data.data.footerFacebook || '',
                    }));
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
                setMessage('✅ Đã lưu thành công! Trang chủ sẽ cập nhật khi refresh.');
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Nội Dung Website</h2>
            <p className="text-gray-600 mb-6">Chỉnh sửa nội dung hiển thị trên trang chủ mà không cần build lại.</p>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Header & Logo */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">🌸 Header & Logo</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (để trống = dùng emoji 🌸)</label>
                        <input
                            type="text"
                            value={settings.siteLogo}
                            onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            placeholder="/uploads/logo.png"
                        />
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">🏠 Banner Chính (Hero)</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề chính</label>
                        <input
                            type="text"
                            value={settings.heroTitle}
                            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                        <input
                            type="text"
                            value={settings.heroSubtitle}
                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text nút CTA</label>
                        <input
                            type="text"
                            value={settings.heroButtonText}
                            onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">📅 Thông Tin Sự Kiện</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sự kiện</label>
                        <input
                            type="text"
                            value={settings.eventDate}
                            onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            placeholder="18/01/2026"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                        <input
                            type="text"
                            value={settings.eventLocation}
                            onChange={(e) => setSettings({ ...settings, eventLocation: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">📋 Footer</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text copyright</label>
                        <input
                            type="text"
                            value={settings.footerText}
                            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                value={settings.footerAddress}
                                onChange={(e) => setSettings({ ...settings, footerAddress: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                value={settings.footerPhone}
                                onChange={(e) => setSettings({ ...settings, footerPhone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={settings.footerEmail}
                                onChange={(e) => setSettings({ ...settings, footerEmail: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <input
                                type="url"
                                value={settings.footerFacebook}
                                onChange={(e) => setSettings({ ...settings, footerFacebook: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary py-3 px-6 disabled:opacity-50"
            >
                {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Nội Dung'}
            </button>
        </div>
    );
}
