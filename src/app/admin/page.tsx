'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, getTierLabel } from '@/lib/utils';

interface Stats {
    totalRaised: number;
    targetAmount: number;
    totalDonors: number;
    treesSponsored: number;
    treesAvailable: number;
    percentComplete: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [donations, setDonations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, donationsRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/donations'),
            ]);
            const statsData = await statsRes.json();
            const donationsData = await donationsRes.json();
            setStats(statsData.data);
            setDonations(donationsData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
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

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-500 mb-1">Đã quyên góp</div>
                    <div className="text-2xl font-bold text-pink-600">{formatCurrency(stats?.totalRaised || 0)}</div>
                    <div className="text-xs text-gray-400 mt-1">{stats?.percentComplete || 0}% mục tiêu</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-500 mb-1">Số người đóng góp</div>
                    <div className="text-2xl font-bold text-blue-600">{stats?.totalDonors || 0}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-500 mb-1">Cây đã có chủ</div>
                    <div className="text-2xl font-bold text-green-600">{stats?.treesSponsored || 0}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-500 mb-1">Cây còn trống</div>
                    <div className="text-2xl font-bold text-gray-600">{stats?.treesAvailable || 0}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Tiến độ chiến dịch</h3>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all"
                        style={{ width: `${stats?.percentComplete || 0}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{formatCurrency(stats?.totalRaised || 0)}</span>
                    <span>{formatCurrency(stats?.targetAmount || 500000000)}</span>
                </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Đóng góp gần đây</h3>
                <div className="space-y-3">
                    {donations.slice(0, 10).map((d: any) => (
                        <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-800">{d.name}</div>
                                <div className="text-sm text-gray-500">{d.tree_code ? `Cây ${d.tree_code}` : 'Chưa gán cây'}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-pink-600">{formatCurrency(d.amount)}</div>
                                <span className={`tier-badge tier-${d.tier} text-xs`}>{getTierLabel(d.tier)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
