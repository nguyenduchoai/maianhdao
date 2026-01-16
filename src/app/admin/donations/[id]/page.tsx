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
    tree_code?: string;
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
    const [availableTrees, setAvailableTrees] = useState<Tree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTreeId, setSelectedTreeId] = useState('');
    const [editForm, setEditForm] = useState<Partial<Donation>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchDonation();
        fetchAvailableTrees();
    }, [donationId]);

    const fetchDonation = async () => {
        try {
            const res = await fetch('/api/admin/donations');
            const data = await res.json();
            const found = data.data?.find((d: Donation) => d.id === donationId);
            if (found) {
                setDonation(found);
                setEditForm(found);
            }
        } catch (error) {
            console.error('Error fetching donation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            const available = data.data?.filter((t: Tree) => t.status === 'available') || [];
            setAvailableTrees(available);
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

    const handleAssignTree = async () => {
        if (!selectedTreeId) {
            alert('Vui lòng chọn cây!');
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: donationId, tree_id: selectedTreeId }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã gán cây thành công!');
                setShowAssignModal(false);
                fetchDonation();
                fetchAvailableTrees();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnassignTree = async () => {
        if (!confirm('Hủy gán cây này?')) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: donationId, tree_id: null }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã hủy gán cây!');
                fetchDonation();
                fetchAvailableTrees();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
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
            case 'diamond': return '💎 Kim cương';
            case 'gold': return '🥇 Vàng';
            case 'silver': return '🥈 Bạc';
            case 'green': return '💚 Xanh';
            case 'imprint': return '🌸 Ghi danh';
            case 'entrust': return '🌸 Uỷ thác';
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
                            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">
                                {donation.is_organization ? '🏢' : '👤'}
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
                            <span className="text-gray-600">Số tiền</span>
                            <span className="text-2xl font-bold text-green-600">{formatCurrency(donation.amount)}</span>
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
                                <label className="block text-sm text-gray-500">Mã cây được gán</label>
                                <div className="flex items-center gap-2">
                                    {donation.tree_code ? (
                                        <>
                                            <span className="font-medium text-pink-600">{donation.tree_code}</span>
                                            <button
                                                onClick={handleUnassignTree}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                (Hủy)
                                            </button>
                                        </>
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
                            onClick={() => setShowAssignModal(true)}
                            className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        >
                            🌸 Gán cây
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

            {/* Assign Tree Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">🌸 Gán cây</h3>
                            <button onClick={() => setShowAssignModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30">✕</button>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 text-gray-600">Chọn cây để gán cho <strong>{donation.name}</strong>:</p>
                            <select
                                value={selectedTreeId}
                                onChange={(e) => setSelectedTreeId(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 mb-4"
                            >
                                <option value="">-- Chọn cây --</option>
                                {availableTrees.map(tree => (
                                    <option key={tree.id} value={tree.id}>
                                        {tree.code} (Khu {tree.zone})
                                    </option>
                                ))}
                            </select>
                            {availableTrees.length === 0 && (
                                <p className="text-yellow-600 text-sm mb-4">⚠️ Không có cây trống nào!</p>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button onClick={() => setShowAssignModal(false)} className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Hủy</button>
                            <button onClick={handleAssignTree} disabled={isSaving || !selectedTreeId} className="py-2 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50">
                                {isSaving ? 'Đang lưu...' : '✅ Gán cây'}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                                <input
                                    type="number"
                                    value={editForm.amount || 0}
                                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
                                <select
                                    value={editForm.tier || 'imprint'}
                                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="diamond">💎 Kim cương</option>
                                    <option value="gold">🥇 Vàng</option>
                                    <option value="silver">🥈 Bạc</option>
                                    <option value="green">💚 Xanh</option>
                                    <option value="imprint">🌸 Ghi danh</option>
                                    <option value="entrust">🌸 Uỷ thác</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lời nhắn</label>
                                <textarea
                                    value={editForm.message || ''}
                                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-lg"
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
