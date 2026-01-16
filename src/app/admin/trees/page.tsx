'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tree {
    id: string;
    code: string;
    zone: string;
    lat: number;
    lng: number;
    status: string;
    donorName?: string;
    donorAmount?: number;
}

export default function AdminTreesPage() {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

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

    const filteredTrees = trees.filter(t => {
        const matchesFilter = filter === 'all' ||
            (filter === 'sponsored' && t.status === 'sponsored') ||
            (filter === 'available' && t.status === 'available');
        const matchesSearch = search === '' ||
            t.code.toLowerCase().includes(search.toLowerCase()) ||
            (t.donorName && t.donorName.toLowerCase().includes(search.toLowerCase()));
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🌸 Quản Lý Cây ({stats.total})</h2>
                <Link href="/admin/trees/new" className="btn-primary py-2 px-4">
                    + Thêm Cây
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                    <div className="text-sm text-gray-500">Tổng cây</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">{stats.sponsored}</div>
                    <div className="text-sm text-gray-500">Đã có chủ</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                    <div className="text-sm text-gray-500">Còn trống</div>
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
                    <option value="sponsored">Đã có chủ ({stats.sponsored})</option>
                    <option value="available">Còn trống ({stats.available})</option>
                </select>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm mã cây hoặc tên người..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
            </div>

            {/* Trees Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Mã Cây</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Khu</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Vị Trí</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Người sở hữu</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrees.map((tree) => (
                            <tr key={tree.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-800">🌸 {tree.code}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">Khu {tree.zone}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    <a
                                        href={`https://maps.google.com/?q=${tree.lat},${tree.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        📍 {tree.lat.toFixed(5)}, {tree.lng.toFixed(5)}
                                    </a>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`
                                        px-2 py-1 rounded-full text-xs font-medium
                                        ${tree.status === 'sponsored'
                                            ? 'bg-pink-100 text-pink-700'
                                            : 'bg-green-100 text-green-700'}
                                    `}>
                                        {tree.status === 'sponsored' ? 'Có chủ' : 'Trống'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {tree.donorName ? (
                                        <span className="text-gray-800">{tree.donorName}</span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Chưa gán</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/trees/${tree.id}`}
                                        className="text-blue-600 hover:underline text-sm mr-3"
                                    >
                                        Chi tiết
                                    </Link>
                                    <Link
                                        href={`/admin/trees/${tree.id}/edit`}
                                        className="text-pink-600 hover:underline text-sm"
                                    >
                                        Sửa
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Showing count */}
            <div className="mt-4 text-sm text-gray-500 text-center">
                Hiển thị {filteredTrees.length} / {trees.length} cây
            </div>
        </div>
    );
}
