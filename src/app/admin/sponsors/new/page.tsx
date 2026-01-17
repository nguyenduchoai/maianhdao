'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSponsorPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        website: '',
        displayOrder: 0,
        isActive: true,
    });

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('type', 'sponsors');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, logoUrl: data.url }));
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert('Vui lòng nhập tên đơn vị');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/sponsors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    logo_url: formData.logoUrl,
                    website: formData.website,
                    tier: 'organizer', // Always organizer
                    display_order: formData.displayOrder,
                    is_active: formData.isActive,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã thêm thành công!');
                router.push('/admin/sponsors');
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🏛️ Thêm Đơn Vị Ban Tổ Chức</h2>
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-800"
                >
                    ← Quay lại
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đơn vị *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            placeholder="VD: Hội Doanh Nhân Trẻ Lâm Đồng"
                        />
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        <div className="flex items-center gap-4">
                            {formData.logoUrl && (
                                <img src={formData.logoUrl} alt="Logo" className="w-20 h-20 object-contain border rounded" />
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm">
                                {isUploading ? 'Đang tải...' : '📤 Tải logo lên'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                            {formData.logoUrl && (
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                    className="text-red-500 text-sm"
                                >
                                    🗑️ Xóa
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Type - Fixed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                        <div className="px-3 py-2 bg-pink-50 border border-pink-200 rounded-lg text-pink-700 font-medium">
                            🏛️ Đơn vị Ban Tổ Chức
                        </div>
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                        <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-pink-600"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">Hiển thị trên trang chủ</label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-lg font-medium"
                        >
                            {isSaving ? 'Đang lưu...' : '✅ Thêm đơn vị'}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
