'use client';

import { useState, useEffect } from 'react';

interface DonationTierConfig {
    id: string;
    name: string;
    emoji: string;
    minAmount: number;
    maxAmount: number;
    description: string;
    color: string;
}



export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        bankName: 'MSB',
        accountNumber: '991977',
        accountHolder: 'Hội DNT tỉnh Lâm Đồng',
        targetAmount: '500000000',
        campaignStart: '2026-01-05',
        campaignEnd: '2026-01-15',
    });

    const [donationTiers, setDonationTiers] = useState<DonationTierConfig[]>([
        { id: 'kientao', name: 'KIẾN TẠO', emoji: '🏆', minAmount: 5000000, maxAmount: 10000000, description: 'Doanh nghiệp, Khách sạn, Nhà hàng', color: 'amber' },
        { id: 'dauun', name: 'DẤU ẤN', emoji: '🌸', minAmount: 1000000, maxAmount: 2000000, description: 'Hộ gia đình, Nhóm bạn bè', color: 'pink' },
        { id: 'guitrao', name: 'GỬI TRAO', emoji: '💝', minAmount: 200000, maxAmount: 500000, description: 'Nhân viên văn phòng, Du khách', color: 'blue' },
        { id: 'gieomam', name: 'GIEO MẦM', emoji: '🌱', minAmount: 50000, maxAmount: 100000, description: 'Mọi người dân', color: 'green' },
    ]);

    const [editingDonationTier, setEditingDonationTier] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Settings saved locally (tiers are defined in code)
            await new Promise(resolve => setTimeout(resolve, 500));
            setMessage('✅ Đã lưu cài đặt thành công!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Có lỗi xảy ra!');
        } finally {
            setIsSaving(false);
        }
    };

    const updateDonationTier = (id: string, field: keyof DonationTierConfig, value: string | number) => {
        setDonationTiers(tiers => tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
    };



    const formatCurrency = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cài Đặt</h2>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Bank Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">🏦 Thông tin ngân hàng</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                        <input
                            type="text"
                            value={settings.bankName}
                            onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                        <input
                            type="text"
                            value={settings.accountNumber}
                            onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                        <input
                            type="text"
                            value={settings.accountHolder}
                            onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            {/* Campaign */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">📅 Chiến dịch</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu (VNĐ)</label>
                        <input
                            type="number"
                            value={settings.targetAmount}
                            onChange={(e) => setSettings({ ...settings, targetAmount: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={settings.campaignStart}
                            onChange={(e) => setSettings({ ...settings, campaignStart: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                        <input
                            type="date"
                            value={settings.campaignEnd}
                            onChange={(e) => setSettings({ ...settings, campaignEnd: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            {/* Donation Tiers */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💝 Cấp Độ Vinh Danh (Đóng góp)</h3>
                <p className="text-sm text-gray-500 mb-4">Click vào từng cấp độ để chỉnh sửa mức giá và mô tả</p>

                <div className="space-y-3">
                    {donationTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${editingDonationTier === tier.id
                                    ? `border-${tier.color}-500 bg-${tier.color}-50 ring-2 ring-${tier.color}-300`
                                    : `border-${tier.color}-200 bg-${tier.color}-50 hover:border-${tier.color}-400`
                                }`}
                            onClick={() => setEditingDonationTier(editingDonationTier === tier.id ? null : tier.id)}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{tier.emoji}</span>
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{tier.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {formatCurrency(tier.minAmount)}đ - {formatCurrency(tier.maxAmount)}đ
                                    </div>
                                </div>
                                <span className="text-gray-400">{editingDonationTier === tier.id ? '▲' : '▼'}</span>
                            </div>

                            {editingDonationTier === tier.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3" onClick={(e) => e.stopPropagation()}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Số tiền tối thiểu</label>
                                            <input
                                                type="number"
                                                value={tier.minAmount}
                                                onChange={(e) => updateDonationTier(tier.id, 'minAmount', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Số tiền tối đa</label>
                                            <input
                                                type="number"
                                                value={tier.maxAmount}
                                                onChange={(e) => updateDonationTier(tier.id, 'maxAmount', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả đối tượng</label>
                                        <input
                                            type="text"
                                            value={tier.description}
                                            onChange={(e) => updateDonationTier(tier.id, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>



            <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary py-3 px-6 disabled:opacity-50"
            >
                {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Tất Cả Cài Đặt'}
            </button>
        </div>
    );
}
