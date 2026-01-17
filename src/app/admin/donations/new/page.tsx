'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Tree {
    id: string;
    code: string;
    zone: string;
    status: string;
}

export default function NewDonationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [trees, setTrees] = useState<Tree[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        amount: '',
        tier: 'kientao',
        message: '',
        tree_id: '',
        is_organization: false,
        logo_url: '',
    });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Fetch available trees
        fetch('/api/admin/trees')
            .then(res => res.json())
            .then(data => {
                // Filter available trees only
                const availableTrees = (data.data || []).filter((t: Tree) => t.status === 'available');
                setTrees(availableTrees);
            });
    }, []);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('type', 'donors');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, logo_url: data.url }));
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.amount) {
            alert('Vui lòng nhập tên và số tiền');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseInt(formData.amount),
                    status: 'approved', // Auto approve
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert('Đã thêm đóng góp thành công!');
                router.push('/admin/donations');
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Lỗi kết nối server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const tierOptions = [
        { value: 'kientao', label: '🏆 KIẾN TẠO (≥5.000.000đ)' },
        { value: 'dauun', label: '🌸 DẤU ẤN (1.000.000 - 5.000.000đ)' },
        { value: 'guitrao', label: '💝 GỬI TRAO (200.000 - 1.000.000đ)' },
        { value: 'gieomam', label: '🌱 GIEO MẦM (<200.000đ)' },
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">➕ Thêm Đóng Góp Mới</h2>
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-800"
                >
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên người/đơn vị đóng góp *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="VD: Công ty ABC, Nguyễn Văn A..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="0912345678"
                        />
                    </div>
                </div>

                {/* Amount & Tier */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số tiền đóng góp (VNĐ) *
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="10000000"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hạng đóng góp</label>
                        <select
                            value={formData.tier}
                            onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            {tierOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tree Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gán cây (nếu có)
                    </label>
                    <select
                        value={formData.tree_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, tree_id: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="">-- Chưa gán cây --</option>
                        {trees.map(tree => (
                            <option key={tree.id} value={tree.id}>
                                {tree.code} - Khu {tree.zone}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Chỉ hiển thị cây còn trống</p>
                </div>

                {/* Is Organization */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_organization"
                        checked={formData.is_organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_organization: e.target.checked }))}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label htmlFor="is_organization" className="text-sm text-gray-700">
                        Đây là doanh nghiệp/tổ chức
                    </label>
                </div>

                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo (nếu có)</label>
                    <div className="flex items-center gap-4">
                        {formData.logo_url && (
                            <img src={formData.logo_url} alt="Logo" className="w-16 h-16 object-contain border rounded" />
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
                        {formData.logo_url && (
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                                className="text-red-500 text-sm"
                            >
                                🗑️ Xóa
                            </button>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú / Lời nhắn</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        rows={3}
                        placeholder="Lời nhắn của người đóng góp..."
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-lg font-medium"
                    >
                        {isSubmitting ? 'Đang lưu...' : '✅ Thêm đóng góp'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
