'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency, getTierLabel } from '@/lib/utils';

interface Donation {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    amount: number;
    tier: string;
    status: string;
    tree_code?: string;
    message?: string;
    created_at?: string;
}

export default function AdminDonationsPage() {
    const router = useRouter();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const res = await fetch('/api/admin/donations');
            const data = await res.json();
            setDonations(data.data || []);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa đóng góp của "${name}"?`)) return;
        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/donations?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchDonations();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredDonations = donations.filter(d => {
        const matchesFilter = filter === 'all' || d.status === filter;
        const matchesSearch = search === '' ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            (d.phone && d.phone.includes(search)) ||
            (d.email && d.email.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: donations.length,
        approved: donations.filter(d => d.status === 'approved').length,
        pending: donations.filter(d => d.status === 'pending').length,
        totalAmount: donations.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0),
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 Quản Lý Đóng Góp ({stats.total})</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                    <div className="text-sm text-gray-500">Tổng lượt</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    <div className="text-sm text-gray-500">Đã duyệt</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-gray-500">Chờ duyệt</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-xl font-bold text-pink-600">{formatCurrency(stats.totalAmount)}</div>
                    <div className="text-sm text-gray-500">Tổng tiền</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                    <option value="all">Tất cả ({stats.total})</option>
                    <option value="approved">Đã duyệt ({stats.approved})</option>
                    <option value="pending">Chờ duyệt ({stats.pending})</option>
                </select>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm tên, SĐT, email..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
            </div>

            {/* Donations Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Người đóng góp</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Số tiền</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tier</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Cây</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Trạng thái</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDonations.map((d) => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-800">{d.name}</div>
                                    <div className="text-sm text-gray-500">{d.phone || d.email}</div>
                                </td>
                                <td className="px-4 py-3 font-medium text-pink-600">
                                    {formatCurrency(d.amount)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`tier-badge tier-${d.tier}`}>{getTierLabel(d.tier)}</span>
                                </td>
                                <td className="px-4 py-3">
                                    {d.tree_code ? (
                                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-sm">
                                            {d.tree_code}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Chưa gán</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`
                                        px-2 py-1 rounded-full text-xs font-medium
                                        ${d.status === 'approved'
                                            ? 'bg-green-100 text-green-700'
                                            : d.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'}
                                    `}>
                                        {d.status === 'approved' ? 'Đã duyệt' : d.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/donations/${d.id}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Chi tiết
                                        </Link>
                                        <button
                                            onClick={() => router.push(`/admin/donations/${d.id}`)}
                                            className="text-green-600 hover:underline text-sm"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(d.id, d.name)}
                                            disabled={isDeleting === d.id}
                                            className="text-red-600 hover:underline text-sm disabled:opacity-50"
                                        >
                                            {isDeleting === d.id ? '...' : 'Xóa'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
                Hiển thị {filteredDonations.length} / {donations.length} đóng góp
            </div>
        </div>
    );
}
