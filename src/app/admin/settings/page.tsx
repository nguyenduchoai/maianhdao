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
