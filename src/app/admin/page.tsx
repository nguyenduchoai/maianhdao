'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate, getTierLabel, getTierColor } from '@/lib/utils';

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'trees' | 'donations' | 'sponsors' | 'settings'>('dashboard');
    const [stats, setStats] = useState<{
        totalRaised: number;
        targetAmount: number;
        totalDonors: number;
        treesSponsored: number;
        treesAvailable: number;
        percentComplete: number;
    } | null>(null);
    const [trees, setTrees] = useState<any[]>([]);
    const [donations, setDonations] = useState<any[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/login');
            const data = await res.json();
            if (data.authenticated) {
                setIsAuthenticated(true);
                setUser(data.user);
                fetchData();
            } else {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/login', { method: 'DELETE' });
        router.push('/admin/login');
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, treesRes, donationsRes, sponsorsRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/trees'),
                fetch('/api/donations'),
                fetch('/api/sponsors'),
            ]);

            const statsData = await statsRes.json();
            const treesData = await treesRes.json();
            const donationsData = await donationsRes.json();
            const sponsorsData = await sponsorsRes.json();

            setStats(statsData.data);
            setTrees(treesData.data || []);
            setDonations(donationsData.data || []);
            setSponsors(sponsorsData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'trees', label: '🌸 Cây', icon: '🌸' },
        { id: 'donations', label: '💰 Đóng Góp', icon: '💰' },
        { id: 'sponsors', label: '🏢 Nhà Tài Trợ', icon: '🏢' },
        { id: 'settings', label: '⚙️ Cài Đặt', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🌸</span>
                        <h1 className="text-xl font-bold text-gray-800">
                            Admin - Đảo Mai Anh Đào
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {user && (
                            <span className="text-sm text-gray-600">
                                👤 {user.username}
                            </span>
                        )}
                        <a
                            href="/"
                            target="_blank"
                            className="text-sm text-pink-600 hover:underline"
                        >
                            ← Trang chủ
                        </a>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <nav className="bg-white rounded-lg shadow-sm p-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`
                    w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors flex items-center gap-3
                    ${activeTab === tab.id
                                            ? 'bg-pink-50 text-pink-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'}
                  `}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label.replace(tab.icon + ' ', '')}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {isLoading ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                                <p className="text-gray-600">Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'dashboard' && <DashboardTab stats={stats} donations={donations} />}
                                {activeTab === 'trees' && <TreesTab trees={trees} onRefresh={fetchData} />}
                                {activeTab === 'donations' && <DonationsTab donations={donations} trees={trees} onRefresh={fetchData} />}
                                {activeTab === 'sponsors' && <SponsorsTab sponsors={sponsors} onRefresh={fetchData} />}
                                {activeTab === 'settings' && <SettingsTab />}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Dashboard Tab
function DashboardTab({ stats, donations }: { stats: any; donations: any[] }) {
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
                    {donations.slice(0, 5).map((d: any) => (
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

// Trees Tab
function TreesTab({ trees, onRefresh }: { trees: any[]; onRefresh: () => void }) {
    const [filter, setFilter] = useState('all');

    const filteredTrees = trees.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'sponsored') return t.status === 'sponsored';
        if (filter === 'available') return t.status === 'available';
        return true;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🌸 Quản Lý Cây ({trees.length})</h2>
                <button className="btn-primary py-2 px-4">+ Thêm Cây</button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="all">Tất cả</option>
                    <option value="sponsored">Đã có chủ</option>
                    <option value="available">Còn trống</option>
                </select>
            </div>

            {/* Trees Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredTrees.map((tree) => (
                    <div
                        key={tree.id}
                        className={`
              bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer hover:shadow-md transition-shadow
              ${tree.status === 'sponsored' ? 'border-2 border-pink-200' : 'border border-gray-200'}
            `}
                    >
                        <div className="text-2xl mb-2">🌸</div>
                        <div className="font-bold text-gray-800">{tree.code}</div>
                        <div className="text-xs text-gray-500">Khu {tree.zone}</div>
                        <div className={`
              text-xs mt-2 px-2 py-1 rounded-full
              ${tree.status === 'sponsored'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-gray-100 text-gray-600'}
            `}>
                            {tree.status === 'sponsored' ? 'Có chủ' : 'Trống'}
                        </div>
                        {tree.donorName && (
                            <div className="text-xs text-gray-600 mt-2 truncate">{tree.donorName}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Donations Tab
function DonationsTab({ donations, trees, onRefresh }: { donations: any[]; trees: any[]; onRefresh: () => void }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💰 Quản Lý Đóng Góp ({donations.length})</h2>
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
                        {donations.map((d: any) => (
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
                                    <button className="text-blue-600 hover:underline text-sm mr-2">Sửa</button>
                                    <button className="text-red-600 hover:underline text-sm">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Sponsors Tab
function SponsorsTab({ sponsors, onRefresh }: { sponsors: any[]; onRefresh: () => void }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🏢 Nhà Tài Trợ ({sponsors.length})</h2>
                <button className="btn-primary py-2 px-4">+ Thêm Nhà Tài Trợ</button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((s: any) => (
                    <div key={s.id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                {s.logoUrl ? (
                                    <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain rounded-lg" />
                                ) : (
                                    <span className="text-2xl">🏢</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{s.name}</div>
                                <span className={`tier-badge tier-${s.tier} text-xs`}>
                                    {getTierLabel(s.tier)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="flex-1 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">Sửa</button>
                            <button className="flex-1 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100">Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Settings Tab
function SettingsTab() {
    const [settings, setSettings] = useState({
        bankName: 'Vietcombank',
        accountNumber: '0123456789',
        accountHolder: 'Quỹ Mai Anh Đào Đà Lạt',
        targetAmount: '500000000',
        campaignStart: '2026-01-05',
        campaignEnd: '2026-01-15',
    });

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cài Đặt</h2>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Thông tin ngân hàng</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                        <input
                            type="text"
                            value={settings.bankName}
                            onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                        <input
                            type="text"
                            value={settings.accountNumber}
                            onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                        <input
                            type="text"
                            value={settings.accountHolder}
                            onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                <h3 className="font-semibold text-gray-800 mb-4">Chiến dịch</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu (VNĐ)</label>
                        <input
                            type="number"
                            value={settings.targetAmount}
                            onChange={(e) => setSettings({ ...settings, targetAmount: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={settings.campaignStart}
                            onChange={(e) => setSettings({ ...settings, campaignStart: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                        <input
                            type="date"
                            value={settings.campaignEnd}
                            onChange={(e) => setSettings({ ...settings, campaignEnd: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                <button className="btn-primary py-2 px-6">
                    💾 Lưu Cài Đặt
                </button>
            </div>
        </div>
    );
}
