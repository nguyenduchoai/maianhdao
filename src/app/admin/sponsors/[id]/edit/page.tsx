'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sponsor {
    id: string;
    name: string;
    logoUrl?: string;
    website?: string;
    tier: string;
    displayOrder: number;
    isActive: boolean;
}

export default function EditSponsorPage() {
    const params = useParams();
    const router = useRouter();
    const sponsorId = params.id as string;

    const [sponsor, setSponsor] = useState<Sponsor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        website: '',
        tier: 'silver',
        displayOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchSponsor();
    }, [sponsorId]);

    const fetchSponsor = async () => {
        try {
            const res = await fetch('/api/sponsors');
            const data = await res.json();
            const found = data.data?.find((s: Sponsor) => s.id === sponsorId);
            if (found) {
                setSponsor(found);
                setFormData({
                    name: found.name || '',
                    logoUrl: found.logoUrl || '',
                    website: found.website || '',
                    tier: found.tier || 'silver',
                    displayOrder: found.displayOrder || 0,
                    isActive: found.isActive ?? true,
                });
            }
        } catch (error) {
            console.error('Error fetching sponsor:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/sponsors', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: sponsorId,
                    name: formData.name,
                    logo_url: formData.logoUrl,
                    website: formData.website,
                    tier: formData.tier,
                    display_order: formData.displayOrder,
                    is_active: formData.isActive,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã lưu thành công!');
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

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!sponsor) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-600 mb-4">Không tìm thấy nhà tài trợ!</p>
                <Link href="/admin/sponsors" className="text-pink-600 hover:underline">
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/admin/sponsors" className="text-pink-600 hover:underline">
                    ← Quay lại danh sách nhà tài trợ
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">✏️ Chỉnh sửa: {sponsor.name}</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary py-2 px-6 disabled:opacity-50"
                >
                    {isSaving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà tài trợ</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ tài trợ</label>
                            <select
                                value={formData.tier}
                                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="organizer">🏆 Đơn vị tổ chức</option>
                                <option value="diamond">💎 Kim cương</option>
                                <option value="gold">🥇 Vàng</option>
                                <option value="silver">🥈 Bạc</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                            <input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-pink-500 focus:ring-pink-500 rounded"
                            />
                            <label htmlFor="isActive" className="text-sm text-gray-700">Đang hoạt động (hiển thị trên trang chủ)</label>
                        </div>
                    </div>
                </div>

                {/* Logo */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Logo</h3>

                    <div className="space-y-4">
                        {/* Logo Preview */}
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                            {formData.logoUrl ? (
                                <img
                                    src={formData.logoUrl}
                                    alt={formData.name}
                                    className="max-h-28 max-w-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <div className="text-4xl mb-2">🏢</div>
                                    <div className="text-sm">Chưa có logo</div>
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                id="logo-upload"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setIsUploading(true);
                                    const formDataUpload = new FormData();
                                    formDataUpload.append('file', file);
                                    formDataUpload.append('type', 'sponsors');
                                    try {
                                        const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                                        const data = await res.json();
                                        if (data.success) {
                                            setFormData({ ...formData, logoUrl: data.url });
                                        } else {
                                            alert(data.error || 'Lỗi upload');
                                        }
                                    } catch (err) {
                                        alert('Lỗi upload file');
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }}
                            />
                            <label
                                htmlFor="logo-upload"
                                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors
                                    ${isUploading ? 'bg-gray-300 text-gray-500' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                            >
                                {isUploading ? 'Đang tải lên...' : '📷 Tải ảnh lên'}
                            </label>
                            {formData.logoUrl && (
                                <button
                                    onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Xóa logo
                                </button>
                            )}
                        </div>

                        {/* Manual URL Input */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Hoặc nhập URL Logo</label>
                            <input
                                type="url"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                placeholder="https://... hoặc /images/..."
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            <p>💡 Khuyến nghị:</p>
                            <ul className="list-disc list-inside">
                                <li>Kích thước: 200x100 pixels</li>
                                <li>Định dạng: PNG, SVG (nền trong suốt)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
