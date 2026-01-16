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
    logoUrl?: string;
    message?: string;
    isOrganization?: boolean;
    status: string;
    tier?: string;
    treeCode?: string;
    createdAt?: string;
}

export default function DonationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const donationId = params.id as string;

    const [donation, setDonation] = useState<Donation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDonation();
    }, [donationId]);

    const fetchDonation = async () => {
        try {
            const res = await fetch('/api/donations');
            const data = await res.json();
            const found = data.data?.find((d: Donation) => d.id === donationId);
            if (found) {
                setDonation(found);
            }
        } catch (error) {
            console.error('Error fetching donation:', error);
        } finally {
            setIsLoading(false);
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
                                onClick={() => alert('TODO: Duyệt đóng góp')}
                                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                ✅ Duyệt
                            </button>
                            <button
                                onClick={() => alert('TODO: Từ chối đóng góp')}
                                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                                {donation.isOrganization ? '🏢' : '👤'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{donation.name}</p>
                                <p className="text-sm text-gray-500">
                                    {donation.isOrganization ? 'Tổ chức/Doanh nghiệp' : 'Cá nhân'}
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
                                <p className="font-medium">{donation.treeCode || 'Chưa gán'}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Ngày tạo</label>
                                <p className="font-medium">
                                    {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString('vi-VN') : '-'}
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
                            onClick={() => alert('TODO: Gán cây cho người đóng góp')}
                            className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        >
                            🌸 Gán cây
                        </button>
                        <button
                            onClick={() => alert('TODO: Chỉnh sửa thông tin')}
                            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            ✏️ Chỉnh sửa
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa đóng góp này?')) {
                                    alert('TODO: Xóa đóng góp');
                                }
                            }}
                            className="py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
