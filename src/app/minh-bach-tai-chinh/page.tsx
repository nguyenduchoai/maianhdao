'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { SubpageHeader } from '@/components/landing/SubpageHeader';

interface Donation {
    id: string;
    name: string;
    amount: number;
    tier: string;
    message?: string;
    isOrganization: boolean;
    createdAt: string;
}

interface FinanceData {
    totalIncome: number;
    incomeCount: number;
    donations: Donation[];
}

const tierLabels: Record<string, string> = {
    kientao: '🏆 KIẾN TẠO',
    dauun: '🌸 DẤU ẤN',
    guitrao: '💝 GỬI TRAO',
    gieomam: '🌱 GIEO MẦM',
};

export default function FinanceTransparencyPage() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/finance');
            const result = await res.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching finance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
                <p className="text-gray-600">Không có dữ liệu</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Full Navigation Header */}
            <SubpageHeader currentPage="minh-bach-tai-chinh" />

            {/* Spacer for fixed header */}
            <div className="h-16 md:h-20" />

            <main className="container mx-auto px-4 py-6 sm:py-12">
                {/* Title - Mobile Optimized */}
                <div className="text-center mb-6 sm:mb-12">
                    <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                        📊 Minh Bạch Tài Chính
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
                        Danh sách đóng góp cho chiến dịch <strong>NGÀN CÂY ANH ĐÀO</strong> được công khai minh bạch
                    </p>
                </div>

                {/* Stats Card - Mobile Optimized */}
                <div className="max-w-md mx-auto mb-6 sm:mb-12">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-lg text-center">
                        <div className="text-sm sm:text-lg opacity-80 mb-2">💰 Tổng số tiền đã nhận</div>
                        <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">{formatCurrency(data.totalIncome)}</div>
                        <div className="text-sm sm:text-lg opacity-70">{data.incomeCount} lượt đóng góp</div>
                    </div>
                </div>

                {/* Donations List - Mobile Responsive */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                        💰 Danh sách đóng góp ({data.donations?.length || 0})
                    </h2>

                    {!data.donations || data.donations.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Chưa có đóng góp nào</p>
                    ) : (
                        <>
                            {/* Desktop Table - Hidden on Mobile */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Người đóng góp</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Số tiền</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cấp độ</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ghi chú</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.donations.map((donation) => (
                                            <tr key={donation.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span>{donation.isOrganization ? '🏢' : '👤'}</span>
                                                        <span className="font-medium text-gray-800">{donation.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right font-bold text-green-600">
                                                    +{formatCurrency(donation.amount)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`tier-badge tier-${donation.tier}`}>
                                                        {tierLabels[donation.tier] || donation.tier}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                                                    {donation.message || '—'}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-500">
                                                    {new Date(donation.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards - Hidden on Desktop */}
                            <div className="md:hidden space-y-3">
                                {data.donations.map((donation) => (
                                    <div 
                                        key={donation.id} 
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className="text-lg">{donation.isOrganization ? '🏢' : '👤'}</span>
                                                <span className="font-medium text-gray-800 truncate">{donation.name}</span>
                                            </div>
                                            <span className="font-bold text-green-600 flex-shrink-0 ml-2">
                                                +{formatCurrency(donation.amount)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`tier-badge tier-${donation.tier} text-xs px-2 py-0.5`}>
                                                {tierLabels[donation.tier] || donation.tier}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {new Date(donation.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        {donation.message && (
                                            <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                                                "{donation.message}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Back to home */}
                <div className="text-center">
                    <Link href="/" className="btn-primary inline-block text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
                        ← Quay về trang chủ
                    </Link>
                </div>
            </main>
        </div>
    );
}
