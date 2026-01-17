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
    const [showImportModal, setShowImportModal] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);

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

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setImportResult(null);

        try {
            // Read Excel file using SheetJS (loaded from CDN)
            const XLSX = (window as any).XLSX;
            if (!XLSX) {
                alert('Đang tải thư viện Excel, vui lòng thử lại...');
                // Load XLSX from CDN
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                document.head.appendChild(script);
                setIsImporting(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = async (evt) => {
                try {
                    const data = evt.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);

                    if (jsonData.length === 0) {
                        alert('File Excel trống!');
                        setIsImporting(false);
                        return;
                    }

                    // Send to webhook
                    const res = await fetch('/api/webhook/donations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(jsonData),
                    });
                    const result = await res.json();

                    setImportResult({ success: result.imported || 0, failed: result.failed || 0 });
                    if (result.imported > 0) {
                        fetchDonations();
                    }
                } catch (err) {
                    alert('Lỗi đọc file Excel');
                } finally {
                    setIsImporting(false);
                }
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            alert('Lỗi import');
            setIsImporting(false);
        }
        e.target.value = '';
    };

    const filteredDonations = donations.filter(d => {
        const matchesFilter = filter === 'all' || d.status === filter;
        const searchLower = search.toLowerCase();
        const matchesSearch = search === '' ||
            d.name.toLowerCase().includes(searchLower) ||
            (d.phone && d.phone.includes(search)) ||
            (d.email && d.email.toLowerCase().includes(searchLower)) ||
            (d.tree_code && d.tree_code.toLowerCase().includes(searchLower)) ||
            (d.message && d.message.toLowerCase().includes(searchLower));
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
            {/* Load XLSX library */}
            <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" async />

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 Quản Lý Đóng Góp ({stats.total})</h2>
                <div className="flex gap-2">
                    <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-pointer">
                        📥 Import Excel
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImportExcel}
                            className="hidden"
                            disabled={isImporting}
                        />
                    </label>
                    <Link
                        href="/admin/donations/new"
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                        ➕ Thêm đóng góp
                    </Link>
                </div>
            </div>

            {/* Import Result */}
            {isImporting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                    <span className="text-blue-700">Đang import...</span>
                </div>
            )}
            {importResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-700">
                        ✅ Import hoàn tất: <strong>{importResult.success}</strong> thành công
                        {importResult.failed > 0 && <span className="text-red-600">, {importResult.failed} thất bại</span>}
                    </p>
                </div>
            )}

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
