'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Tree } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Dynamic imports for Leaflet
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);


export default function MapTreePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const treeId = params.id as string;
    const highlightedDonorId = searchParams.get('donor'); // For personalized view

    const [trees, setTrees] = useState<Tree[]>([]);
    const [organizers, setOrganizers] = useState<{ id: string, name: string, logoUrl: string }[]>([]);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapReady, setIsMapReady] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Function to select a tree and show popup
    const selectTree = (tree: Tree) => {
        setSelectedTree(tree);
        setShowPopup(true);
    };

    useEffect(() => {
        fetchTrees();
        fetchOrganizers();
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
            setIsMapReady(true);
        });
    }, []);

    useEffect(() => {
        if (trees.length > 0 && treeId) {
            const tree = trees.find(t => t.id === treeId);
            if (tree) {
                setSelectedTree(tree);
                setShowPopup(true);
            }
        }
    }, [trees, treeId]);

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

    const fetchOrganizers = async () => {
        try {
            const res = await fetch('/api/sponsors');
            const data = await res.json();
            const orgSponsors = (data.data || []).filter((s: any) => s.tier === 'organizer');
            setOrganizers(orgSponsors);
        } catch (error) {
            console.error('Error fetching organizers:', error);
        }
    };

    const filteredTrees = useMemo(() => trees.filter(t => {
        const matchesFilter = filter === 'all' ||
            (filter === 'sponsored' && t.status === 'sponsored') ||
            (filter === 'available' && t.status === 'available');
        const matchesSearch = search === '' ||
            t.code.toLowerCase().includes(search.toLowerCase()) ||
            (t.donorName && t.donorName.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    }), [trees, filter, search]);

    const mapCenter: [number, number] = selectedTree
        ? [selectedTree.lat, selectedTree.lng]
        : [11.948307, 108.450188];

    const createIcon = (isSponsored: boolean, isSelected: boolean) => {
        if (!L) return undefined;
        const size = isSelected ? 28 : 20;
        return L.divIcon({
            className: 'custom-tree-marker',
            html: `
                <div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:${isSelected ? 14 : 10}px;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:transform 0.2s;
                    ${isSelected ? 'transform:scale(1.2);box-shadow:0 0 0 3px #60a5fa;' : ''}
                    ${isSponsored ? 'background:#ec4899;' : 'background:#d1d5db;'}">
                    🌸
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size],
            popupAnchor: [0, -size],
        });
    };

    const stats = {
        total: trees.length,
        sponsored: trees.filter(t => t.status === 'sponsored').length,
        available: trees.filter(t => t.status === 'available').length,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Đang tải bản đồ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Organizer Logos */}
                        <div className="flex items-center gap-2">
                            {organizers.map((org) => (
                                <img
                                    key={org.id}
                                    src={org.logoUrl || `/logos/${org.name.toLowerCase().replace(/\s+/g, '')}.svg`}
                                    alt={org.name}
                                    className="h-8 object-contain"
                                    title={org.name}
                                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                />
                            ))}
                        </div>
                        <span className="text-gray-300">|</span>
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
                            <span className="text-2xl">🌸</span>
                            <span className="font-bold text-gray-800">Ngàn Cây Anh Đào</span>
                        </Link>
                        <span className="text-gray-400">|</span>
                        <h1 className="text-lg font-semibold text-gray-700">Bản Đồ Cây</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-pink-600">
                            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                            Đã có chủ: {stats.sponsored}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                            Còn trống: {stats.available}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-56px)]">
                {/* Sidebar - Tree List */}
                <aside className="w-80 bg-white border-r border-pink-100 flex flex-col">
                    {/* Filters */}
                    <div className="p-3 space-y-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-pink-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 text-gray-700"
                        >
                            <option value="all">Tất cả ({stats.total})</option>
                            <option value="sponsored">Đã có chủ ({stats.sponsored})</option>
                            <option value="available">Còn trống ({stats.available})</option>
                        </select>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔍 Tìm mã cây, tên người..."
                            className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                        />
                    </div>

                    {/* Tree List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredTrees.map((tree) => (
                            <div
                                key={tree.id}
                                onClick={() => selectTree(tree)}
                                className={`
                                    p-2 rounded-lg cursor-pointer transition-all
                                    ${selectedTree?.id === tree.id
                                        ? 'bg-gradient-to-r from-pink-100 to-pink-50 shadow-sm'
                                        : 'hover:bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar/Logo */}
                                    {tree.donorLogo ? (
                                        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={tree.donorLogo}
                                                alt={tree.donorName || ''}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center shadow-sm
                                            ${tree.status === 'sponsored'
                                                ? 'bg-gradient-to-br from-pink-400 to-pink-500'
                                                : 'bg-gradient-to-br from-gray-200 to-gray-300'}
                                        `}>
                                            {tree.status === 'sponsored' ? (
                                                <span className="text-white text-2xl">🌸</span>
                                            ) : (
                                                <span className="text-gray-500 text-xl">🌱</span>
                                            )}
                                        </div>
                                    )}
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-gray-800">{tree.code}</span>
                                            <span className={`
                                                text-xs px-2 py-0.5 rounded-full font-medium
                                                ${tree.status === 'sponsored'
                                                    ? 'bg-pink-500 text-white'
                                                    : 'bg-gray-200 text-gray-600'}
                                            `}>
                                                {tree.status === 'sponsored' ? 'Có chủ' : 'Trống'}
                                            </span>
                                        </div>
                                        {tree.donorName ? (
                                            <div className="text-sm text-pink-600 font-medium truncate">{tree.donorName}</div>
                                        ) : (
                                            <div className="text-xs text-gray-400">Khu {tree.zone} • Chờ đóng góp</div>
                                        )}

                                    </div>
                                    {/* Arrow */}
                                    <div className="text-gray-300">
                                        →
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 text-center">
                        {filteredTrees.length} / {trees.length} cây
                    </div>
                </aside>

                {/* Map */}
                <main className="flex-1 relative">
                    {isMapReady && L ? (
                        <MapContainer
                            center={mapCenter}
                            zoom={selectedTree ? 18 : 15}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredTrees.map((tree) => (
                                <Marker
                                    key={tree.id}
                                    position={[tree.lat, tree.lng]}
                                    icon={createIcon(tree.status === 'sponsored', selectedTree?.id === tree.id)}
                                    eventHandlers={{
                                        click: () => selectTree(tree),
                                    }}
                                />
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                                <p className="text-gray-500">Đang tải bản đồ...</p>
                            </div>
                        </div>
                    )}

                    {/* Selected Tree Detail Modal */}
                    {selectedTree && showPopup && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[9999]">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 pointer-events-auto overflow-hidden animate-fadeIn">
                                {/* Header with status */}
                                <div className={`
                                    px-6 py-5 flex items-center gap-3
                                    ${selectedTree.status === 'sponsored' ? 'bg-gradient-to-r from-pink-500 to-pink-400' : 'bg-gray-400'}
                                    text-white
                                `}>
                                    <span className="text-4xl">🌸</span>
                                    <div className="flex-1">
                                        <div className="font-bold text-2xl">
                                            {selectedTree.status === 'sponsored' ? 'Địa điểm cây Mai anh đào' : 'Cây còn trống'}
                                        </div>
                                        <div className="text-pink-100 text-lg">{selectedTree.code} - Khu {selectedTree.zone}</div>
                                    </div>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {selectedTree.status === 'sponsored' && (selectedTree.donors?.length || selectedTree.donorName) ? (
                                        <>
                                            {/* Multiple Donors Section */}
                                            {(() => {
                                                // Get all donors from donors array or fallback to primary donor
                                                let donors = selectedTree.donors || (selectedTree.donorName ? [{
                                                    id: selectedTree.donorId || '',
                                                    name: selectedTree.donorName,
                                                    logo_url: selectedTree.donorLogo || null,
                                                    amount: selectedTree.donorAmount || 0,
                                                    tier: 'kientao',
                                                    message: selectedTree.donorMessage || null,
                                                }] : []);

                                                // If highlightedDonorId is set, reorder donors to put that one first
                                                if (highlightedDonorId) {
                                                    const highlightedIndex = donors.findIndex(d => d.id === highlightedDonorId);
                                                    if (highlightedIndex > 0) {
                                                        const highlighted = donors[highlightedIndex];
                                                        donors = [highlighted, ...donors.filter((_, i) => i !== highlightedIndex)];
                                                    }
                                                }

                                                const getTierLabel = (tier: string) => {
                                                    switch (tier) {
                                                        case 'kientao': return '🏆 KIẾN TẠO';
                                                        case 'dauun': return '🌸 DẤU ẤN';
                                                        case 'guitrao': return '💝 GỬI TRAO';
                                                        case 'gieomam': return '🌱 GIEO MẦM';
                                                        default: return tier;
                                                    }
                                                };

                                                const isHighlighted = (donorId: string) => highlightedDonorId === donorId;

                                                return (
                                                    <>
                                                        {/* Personalized Header */}
                                                        {highlightedDonorId && donors.length > 0 && donors[0].id === highlightedDonorId && (
                                                            <div className="mb-4 p-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-xl text-center">
                                                                <p className="text-sm">🌸 Cây của bạn</p>
                                                                <p className="font-bold text-lg">{donors[0].name}</p>
                                                            </div>
                                                        )}

                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                                                                👥 {highlightedDonorId ? 'Đồng sở hữu' : 'Người sở hữu'} ({donors.length})
                                                            </h4>
                                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                                {donors.map((donor, index) => {
                                                                    const isMyDonor = isHighlighted(donor.id);
                                                                    const isFirst = index === 0;

                                                                    return (
                                                                        <div
                                                                            key={donor.id || index}
                                                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMyDonor
                                                                                    ? 'bg-gradient-to-r from-pink-100 to-pink-50 border-pink-300 ring-2 ring-pink-400 shadow-md'
                                                                                    : isFirst && !highlightedDonorId
                                                                                        ? 'bg-gradient-to-r from-pink-50 to-white border-pink-200'
                                                                                        : highlightedDonorId
                                                                                            ? 'bg-gray-50 border-gray-100 opacity-60'
                                                                                            : 'bg-gray-50 border-gray-100'
                                                                                }`}
                                                                        >
                                                                            {donor.logo_url ? (
                                                                                <div className={`w-14 h-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden ${isMyDonor ? 'border-pink-300' : 'border-pink-100'
                                                                                    }`}>
                                                                                    <img
                                                                                        src={donor.logo_url}
                                                                                        alt={donor.name}
                                                                                        className="w-12 h-12 object-contain"
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl ${isMyDonor ? 'bg-pink-200' : 'bg-pink-100'
                                                                                    }`}>
                                                                                    🌸
                                                                                </div>
                                                                            )}
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                                    <span className={`font-bold ${isMyDonor ? 'text-pink-700' : 'text-gray-800'}`}>
                                                                                        {donor.name}
                                                                                    </span>
                                                                                    {isMyDonor && (
                                                                                        <span className="px-2 py-0.5 bg-pink-500 text-white text-xs rounded animate-pulse">
                                                                                            ⭐ Của bạn
                                                                                        </span>
                                                                                    )}
                                                                                    {isFirst && !highlightedDonorId && (
                                                                                        <span className="px-2 py-0.5 bg-pink-500 text-white text-xs rounded">Chính</span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2 text-sm mt-1">
                                                                                    <span className={`font-semibold ${isMyDonor ? 'text-pink-600' : 'text-pink-600'}`}>
                                                                                        {formatCurrency(donor.amount)}
                                                                                    </span>
                                                                                    <span className="text-gray-400">•</span>
                                                                                    <span className="text-xs text-gray-500">{getTierLabel(donor.tier)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Show highlighted donor's message first, or primary donor message */}
                                                        {(() => {
                                                            const messageToShow = highlightedDonorId
                                                                ? donors.find(d => d.id === highlightedDonorId)?.message
                                                                : donors[0]?.message;

                                                            return messageToShow ? (
                                                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                                    <div className="flex items-start gap-2">
                                                                        <span className="text-lg">💬</span>
                                                                        <div>
                                                                            <p className="text-sm text-gray-500 font-medium mb-1">Ghi chú:</p>
                                                                            <p className="text-gray-700">{messageToShow}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </>
                                                );
                                            })()}

                                            {/* Info Grid */}
                                            <div className="space-y-2 mb-4 text-sm bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <span>📅</span>
                                                    <span><strong>Thời gian trồng:</strong> 18/01/2026</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <span>🌸</span>
                                                    <span><strong>Số lượng:</strong> 1 cây</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <span>📍</span>
                                                    <span>Đảo Mai Anh Đào, Hồ Xuân Hương, Đà Lạt</span>
                                                </div>
                                            </div>

                                            {/* Images Gallery */}
                                            <div className="mb-4">
                                                <div className="text-sm text-gray-500 mb-2">🖼️ Hình ảnh (bấm để xem lớn)</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <img
                                                        src={selectedTree.images?.[0] || '/images/hero-bg.jpg'}
                                                        alt={`Cây ${selectedTree.code}`}
                                                        className="w-full h-28 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 hover:shadow-md transition-all"
                                                        onClick={() => setLightboxImage(selectedTree.images?.[0] || '/images/hero-bg.jpg')}
                                                    />
                                                    <img
                                                        src={selectedTree.images?.[1] || '/images/og-image.jpg'}
                                                        alt={`Cây ${selectedTree.code}`}
                                                        className="w-full h-28 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 hover:shadow-md transition-all"
                                                        onClick={() => setLightboxImage(selectedTree.images?.[1] || '/images/og-image.jpg')}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="text-5xl mb-3">🌱</div>
                                            <h4 className="font-bold text-gray-800 mb-2">Cây này đang chờ bạn!</h4>
                                            <p className="text-gray-500 text-sm mb-4">
                                                Đóng góp để sở hữu cây Mai Anh Đào<br />và để lại dấu ấn tại Đà Lạt
                                            </p>
                                            <a
                                                href="/#donate"
                                                className="inline-block bg-pink-500 text-white py-2 px-6 rounded-full font-medium hover:bg-pink-600"
                                            >
                                                💝 Đóng Góp Ngay
                                            </a>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTree.lat},${selectedTree.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                                        >
                                            📍 Chỉ đường
                                        </a>
                                        <button
                                            onClick={() => setShowPopup(false)}
                                            className="py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl"
                    >
                        ✕
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Xem ảnh lớn"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
