'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Donation {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    amount: number;
    logo_url?: string;
    message?: string;
    is_organization?: number;
    status: string;
    tier?: string;
    tree_id?: string;
    tree_ids?: string[];
    tree_code?: string;
    tree_codes?: string[];
    created_at?: string;
}

interface Tree {
    id: string;
    code: string;
    zone: string;
    status: string;
}

export default function DonationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const donationId = params.id as string;

    const [donation, setDonation] = useState<Donation | null>(null);
    const [allTrees, setAllTrees] = useState<Tree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTreeIds, setSelectedTreeIds] = useState<string[]>([]);
    const [treeSearch, setTreeSearch] = useState('');
    const [editForm, setEditForm] = useState<Partial<Donation>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchDonation();
        fetchAllTrees();
    }, [donationId]);

    const fetchDonation = async () => {
        try {
            const res = await fetch('/api/admin/donations');
            const data = await res.json();
            const found = data.data?.find((d: Donation) => d.id === donationId);
            if (found) {
                setDonation(found);
                setEditForm(found);
                setSelectedTreeIds(found.tree_ids || []);
            }
        } catch (error) {
            console.error('Error fetching donation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            setAllTrees(data.data || []);
        } catch (error) {
            console.error('Error fetching trees:', error);
        }
    };

    const handleApprove = async () => {
        if (!confirm('Duyệt đóng góp này?')) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: donationId, status: 'approved' }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã duyệt thành công!');
                fetchDonation();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Từ chối đóng góp này?')) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: donationId, status: 'rejected' }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã từ chối!');
                fetchDonation();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAssignTrees = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: donationId, tree_ids: selectedTreeIds }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã gán cây thành công!');
                setShowAssignModal(false);
                fetchDonation();
                fetchAllTrees();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTreeSelection = (treeId: string) => {
        setSelectedTreeIds(prev =>
            prev.includes(treeId)
                ? prev.filter(id => id !== treeId)
                : [...prev, treeId]
        );
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: donationId,
                    name: editForm.name,
                    phone: editForm.phone,
                    email: editForm.email,
                    amount: editForm.amount,
                    message: editForm.message,
                    tier: editForm.tier,
                    logo_url: editForm.logo_url || '',
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã cập nhật thành công!');
                setShowEditModal(false);
                fetchDonation();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc muốn xóa đóng góp này? Hành động này không thể hoàn tác!')) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/donations?id=${donationId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã xóa thành công!');
                router.push('/admin/donations');
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const getTierLabel = (tier?: string) => {
        switch (tier) {
            case 'kientao': return '🏆 KIẾN TẠO';
            case 'dauun': return '🌸 DẤU ẤN';
            case 'guitrao': return '💝 GỬI TRAO';
            case 'gieomam': return '🌱 GIEO MẦM';
            default: return '🌸 Ghi danh';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return { text: 'Đã duyệt', class: 'bg-green-100 text-green-700' };
            case 'pending': return { text: 'Chờ duyệt', class: 'bg-yellow-100 text-yellow-700' };
            case 'rejected': return { text: 'Từ chối', class: 'bg-red-100 text-red-700' };
            default: return { text: status, class: 'bg-gray-100 text-gray-700' };
        }
    };

    // Get trees this donation currently owns
    const currentTreeCodes = donation?.tree_codes || [];
    const currentTreeIds = donation?.tree_ids || [];

    // Filter trees for selection - show available OR already assigned to this donation
    const selectableTrees = allTrees.filter(t =>
        t.status === 'available' || currentTreeIds.includes(t.id)
    );

    const filteredTrees = selectableTrees.filter(tree =>
        treeSearch === '' ||
        tree.code.toLowerCase().includes(treeSearch.toLowerCase()) ||
        tree.zone.toLowerCase().includes(treeSearch.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-600 mb-4">Không tìm thấy đóng góp!</p>
                <Link href="/admin/donations" className="text-pink-600 hover:underline">
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }

    const statusInfo = getStatusLabel(donation.status);

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/admin/donations" className="text-pink-600 hover:underline">
                    ← Quay lại danh sách đóng góp
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">💝 Chi tiết đóng góp</h2>
                    <p className="text-gray-500">ID: {donation.id}</p>
                </div>
                <div className="flex gap-2">
                    {donation.status === 'pending' && (
                        <>
                            <button
                                onClick={handleApprove}
                                disabled={isSaving}
                                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                                ✅ Duyệt
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isSaving}
                                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                                ❌ Từ chối
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Donor Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Thông tin người đóng góp</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl overflow-hidden">
                                {donation.logo_url ? (
                                    <img src={donation.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    donation.is_organization ? '🏢' : '👤'
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{donation.name}</p>
                                <p className="text-sm text-gray-500">
                                    {donation.is_organization ? 'Tổ chức/Doanh nghiệp' : 'Cá nhân'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500">Số điện thoại</label>
                                <p className="font-medium">{donation.phone || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Email</label>
                                <p className="font-medium">{donation.email || '-'}</p>
                            </div>
                        </div>

                        {donation.message && (
                            <div>
                                <label className="block text-sm text-gray-500">Lời nhắn</label>
                                <p className="font-medium italic">"{donation.message}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Donation Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Thông tin đóng góp</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <span className="text-gray-600">
                                {donation.amount > 0 ? 'Số tiền' : '🎁 Loại đóng góp'}
                            </span>
                            {donation.amount > 0 ? (
                                <span className="text-2xl font-bold text-green-600">{formatCurrency(donation.amount)}</span>
                            ) : (
                                <span className="text-lg font-bold text-purple-600">Tài trợ hiện vật</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500">Trạng thái</label>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.class}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Cấp độ</label>
                                <p className="font-medium">{getTierLabel(donation.tier)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500">Cây được gán ({currentTreeCodes.length})</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {currentTreeCodes.length > 0 ? (
                                        currentTreeIds.map((treeId, index) => (
                                            <a
                                                key={treeId}
                                                href={`/map/${treeId}?donor=${donation.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded text-sm font-medium hover:bg-pink-200 transition-colors"
                                                title="Xem trên bản đồ (cá nhân hóa)"
                                            >
                                                🗺️ {currentTreeCodes[index]}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Chưa gán</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Ngày tạo</label>
                                <p className="font-medium">
                                    {donation.created_at ? new Date(donation.created_at).toLocaleDateString('vi-VN') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-4">Hành động</h3>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => {
                                setSelectedTreeIds(currentTreeIds);
                                setShowAssignModal(true);
                            }}
                            className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        >
                            🌸 Gán cây ({currentTreeCodes.length})
                        </button>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            ✏️ Chỉnh sửa
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSaving}
                            className="py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
                        >
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            </div>

            {/* Assign Trees Modal - MULTI-SELECT */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">🌸 Gán cây (Chọn nhiều)</h3>
                            <button onClick={() => { setShowAssignModal(false); setTreeSearch(''); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">✕</button>
                        </div>
                        <div className="p-6 flex-1 overflow-auto">
                            <p className="mb-4 text-gray-600">
                                Chọn các cây để gán cho <strong>{donation.name}</strong>:
                            </p>

                            {/* Selected count */}
                            <div className="mb-3 p-3 bg-pink-50 rounded-lg">
                                <span className="font-medium text-pink-700">
                                    Đã chọn: {selectedTreeIds.length} cây
                                </span>
                                {selectedTreeIds.length > 0 && (
                                    <button
                                        onClick={() => setSelectedTreeIds([])}
                                        className="ml-3 text-sm text-pink-600 hover:underline"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                )}
                            </div>

                            {/* Search input */}
                            <input
                                type="text"
                                value={treeSearch}
                                onChange={(e) => setTreeSearch(e.target.value)}
                                placeholder="🔍 Tìm kiếm theo mã cây hoặc khu..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 mb-3"
                            />

                            {/* Tree list with checkboxes */}
                            <div className="max-h-64 overflow-y-auto border rounded-lg">
                                {filteredTrees.length > 0 ? (
                                    filteredTrees.map(tree => (
                                        <label
                                            key={tree.id}
                                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0
                                                ${selectedTreeIds.includes(tree.id) ? 'bg-pink-50' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTreeIds.includes(tree.id)}
                                                onChange={() => toggleTreeSelection(tree.id)}
                                                className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                                            />
                                            <div className="flex-1">
                                                <span className="font-medium">{tree.code}</span>
                                                <span className="text-gray-500 ml-2">Khu {tree.zone}</span>
                                            </div>
                                            {tree.status === 'sponsored' && !currentTreeIds.includes(tree.id) && (
                                                <span className="text-xs text-orange-500">Đã có người khác</span>
                                            )}
                                            {currentTreeIds.includes(tree.id) && (
                                                <span className="text-xs text-green-500">Đang gán</span>
                                            )}
                                        </label>
                                    ))
                                ) : (
                                    <p className="p-4 text-gray-500 text-center">Không tìm thấy cây phù hợp</p>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Hiển thị {filteredTrees.length} / {selectableTrees.length} cây (trống hoặc đang gán cho đóng góp này)
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button onClick={() => { setShowAssignModal(false); setTreeSearch(''); }} className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Hủy</button>
                            <button onClick={handleAssignTrees} disabled={isSaving} className="py-2 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50">
                                {isSaving ? 'Đang lưu...' : `✅ Gán ${selectedTreeIds.length} cây`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">✏️ Chỉnh sửa đóng góp</h3>
                            <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo / Ảnh đại diện</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                        {editForm.logo_url ? (
                                            <img src={editForm.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl text-gray-400">🖼️</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setIsUploading(true);
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                formData.append('type', 'donors');
                                                try {
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        setEditForm({ ...editForm, logo_url: data.url });
                                                    } else {
                                                        alert(data.error || 'Lỗi upload');
                                                    }
                                                } catch (err) {
                                                    alert('Lỗi upload file');
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors
                                                ${isUploading ? 'bg-gray-300 text-gray-500' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                                        >
                                            {isUploading ? 'Đang tải lên...' : '📷 Chọn ảnh'}
                                        </label>
                                        {editForm.logo_url && (
                                            <button
                                                onClick={() => setEditForm({ ...editForm, logo_url: '' })}
                                                className="ml-2 text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">Tối đa 5MB - JPG, PNG, WebP</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người đóng góp</label>
                                <input
                                    type="text"
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={editForm.phone || ''}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email || ''}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
                                <input
                                    type="number"
                                    value={editForm.amount || 0}
                                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ vinh danh</label>
                                <select
                                    value={editForm.tier || 'gieomam'}
                                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="kientao">🏆 KIẾN TẠO (5tr+)</option>
                                    <option value="dauun">🌸 DẤU ẤN (1-2tr)</option>
                                    <option value="guitrao">💝 GỬI TRAO (200k-500k)</option>
                                    <option value="gieomam">🌱 GIEO MẦM (50k-100k)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lời nhắn</label>
                                <textarea
                                    value={editForm.message || ''}
                                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Nhập lời nhắn..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button onClick={() => setShowEditModal(false)} className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Hủy</button>
                            <button onClick={handleSaveEdit} disabled={isSaving} className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                                {isSaving ? 'Đang lưu...' : '✅ Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
