'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        bankName: 'MSB',
        accountNumber: '991977',
        accountHolder: 'Hội DNT tỉnh Lâm Đồng',
        targetAmount: '500000000',
        campaignStart: '2026-01-05',
        campaignEnd: '2026-01-15',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Implement save API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('✅ Đã lưu cài đặt thành công!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Có lỗi xảy ra!');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cài Đặt</h2>

            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {message}
                </div>
            )}

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
                <h3 className="font-semibold text-gray-800 mb-4">💝 Cấp Độ Vinh Danh (Đóng góp)</h3>
                <p className="text-sm text-gray-500 mb-4">Các cấp độ này dùng để phân loại và vinh danh người đóng góp trên Bảng Vinh Danh</p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <div className="font-bold text-amber-700">KIẾN TẠO</div>
                                <div className="text-sm text-amber-600">5.000.000đ - 10.000.000đ</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Dành cho: Doanh nghiệp, Khách sạn, Nhà hàng</p>
                    </div>

                    <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🌸</span>
                            <div>
                                <div className="font-bold text-pink-700">DẤU ẤN</div>
                                <div className="text-sm text-pink-600">1.000.000đ - 2.000.000đ</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Dành cho: Hộ gia đình, Nhóm bạn bè</p>
                    </div>

                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">💝</span>
                            <div>
                                <div className="font-bold text-blue-700">GỬI TRAO</div>
                                <div className="text-sm text-blue-600">200.000đ - 500.000đ</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Dành cho: Nhân viên văn phòng, Du khách</p>
                    </div>

                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🌱</span>
                            <div>
                                <div className="font-bold text-green-700">GIEO MẦM</div>
                                <div className="text-sm text-green-600">50.000đ - 100.000đ</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Dành cho: Mọi người dân</p>
                    </div>
                </div>
            </div>

            {/* Sponsor Tiers */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">🏢 Cấp Độ Nhà Tài Trợ</h3>
                <p className="text-sm text-gray-500 mb-4">Các cấp độ này dùng để phân loại nhà tài trợ/đối tác hỗ trợ chiến dịch</p>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                        <span className="text-2xl">🏆</span>
                        <div className="flex-1">
                            <div className="font-bold text-pink-700">Đơn vị tổ chức</div>
                            <div className="text-sm text-gray-600">Ban tổ chức chính của chiến dịch</div>
                        </div>
                        <span className="tier-badge tier-organizer">organizer</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-2xl">💎</span>
                        <div className="flex-1">
                            <div className="font-bold text-blue-700">Kim Cương</div>
                            <div className="text-sm text-gray-600">Nhà tài trợ cao nhất</div>
                        </div>
                        <span className="tier-badge tier-diamond">diamond</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-2xl">🥇</span>
                        <div className="flex-1">
                            <div className="font-bold text-amber-700">Vàng</div>
                            <div className="text-sm text-gray-600">Nhà tài trợ vàng</div>
                        </div>
                        <span className="tier-badge tier-gold">gold</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-2xl">🥈</span>
                        <div className="flex-1">
                            <div className="font-bold text-gray-700">Bạc</div>
                            <div className="text-sm text-gray-600">Nhà tài trợ bạc</div>
                        </div>
                        <span className="tier-badge tier-silver">silver</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary py-3 px-6 disabled:opacity-50"
            >
                {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Cài Đặt'}
            </button>
        </div>
    );
}
