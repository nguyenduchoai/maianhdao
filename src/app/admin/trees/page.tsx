'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tree } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminTreesPage() {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            setTrees(data.data || []);
        } catch (error) {
            console.error('Error fetching trees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTrees = trees.filter(tree => {
        const matchesFilter = filter === 'all'
            || (filter === 'sponsored' && tree.status === 'sponsored')
            || (filter === 'available' && tree.status === 'available');
        const matchesSearch = tree.code.toLowerCase().includes(search.toLowerCase())
            || (tree.donorName && tree.donorName.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: trees.length,
        sponsored: trees.filter(t => t.status === 'sponsored').length,
        available: trees.filter(t => t.status === 'available').length,
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🌸 Quản Lý Cây</h2>
                <div className="flex gap-2">
                    <Link
                        href="/map/all"
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        🗺️ Xem bản đồ
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-gray-500 text-sm">Tổng số cây</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-3xl font-bold text-pink-600">{stats.sponsored}</p>
                    <p className="text-gray-500 text-sm">Đã có chủ</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-3xl font-bold text-gray-400">{stats.available}</p>
                    <p className="text-gray-500 text-sm">Còn trống</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔍 Tìm mã cây hoặc tên người đóng góp..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                        <option value="all">Tất cả ({stats.total})</option>
                        <option value="sponsored">Đã có chủ ({stats.sponsored})</option>
                        <option value="available">Còn trống ({stats.available})</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Mã cây</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Khu</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Người đóng góp</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Số tiền</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Vị trí</th>
                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrees.map((tree, index) => (
                            <tr key={tree.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3">
                                    <span className="font-semibold text-gray-800">{tree.code}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">Khu {tree.zone}</td>
                                <td className="px-4 py-3">
                                    {tree.status === 'sponsored' ? (
                                        <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                            Có chủ
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                            Trống
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {tree.donorName ? (
                                        <span className="text-pink-600 font-medium">{tree.donorName}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {tree.donorAmount ? (
                                        <span className="text-green-600 font-medium">{formatCurrency(tree.donorAmount)}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {tree.lat.toFixed(4)}, {tree.lng.toFixed(4)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={`/admin/trees/${tree.id}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Chi tiết
                                        </Link>
                                        <a
                                            href={`/map/${tree.id}`}
                                            target="_blank"
                                            className="text-pink-600 hover:underline text-sm"
                                        >
                                            Bản đồ
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredTrees.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Không tìm thấy cây nào phù hợp
                    </div>
                )}
            </div>

            {/* Pagination info */}
            <div className="mt-4 text-sm text-gray-500 text-center">
                Hiển thị {filteredTrees.length} / {trees.length} cây
            </div>
        </div>
    );
}
