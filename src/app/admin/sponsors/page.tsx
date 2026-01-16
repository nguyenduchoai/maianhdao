'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTierLabel } from '@/lib/utils';

interface Sponsor {
    id: string;
    name: string;
    tier: string;
    logoUrl?: string;
    website?: string;
    isActive: boolean;
}

export default function AdminSponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            const res = await fetch('/api/sponsors');
            const data = await res.json();
            setSponsors(data.data || []);
        } catch (error) {
            console.error('Error fetching sponsors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const tierOrder = ['organizer', 'diamond', 'gold', 'silver', 'bronze'];
    const sortedSponsors = [...sponsors].sort((a, b) =>
        tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
    );

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
                <h2 className="text-2xl font-bold text-gray-800">🏢 Nhà Tài Trợ ({sponsors.length})</h2>
                <Link href="/admin/sponsors/new" className="btn-primary py-2 px-4">
                    + Thêm Nhà Tài Trợ
                </Link>
            </div>

            {/* Sponsors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedSponsors.map((s) => (
                    <div key={s.id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {s.logoUrl ? (
                                    <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-2xl">🏢</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{s.name}</div>
                                <span className={`tier-badge tier-${s.tier} text-xs`}>
                                    {s.tier === 'organizer' ? 'Đơn vị tổ chức' : getTierLabel(s.tier)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Link
                                href={`/admin/sponsors/${s.id}`}
                                className="flex-1 py-2 text-sm bg-gray-100 rounded text-center hover:bg-gray-200"
                            >
                                Xem
                            </Link>
                            <Link
                                href={`/admin/sponsors/${s.id}/edit`}
                                className="flex-1 py-2 text-sm bg-pink-50 text-pink-600 rounded text-center hover:bg-pink-100"
                            >
                                Sửa
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
