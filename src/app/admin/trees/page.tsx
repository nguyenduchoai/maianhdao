'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

// Dynamic import map
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
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface Tree {
    id: string;
    code: string;
    zone: string;
    lat: number;
    lng: number;
    status: string;
    donorName?: string;
    donorAmount?: number;
    images?: string[];
}

export default function AdminTreesPage() {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isMapReady, setIsMapReady] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);

    useEffect(() => {
        fetchTrees();
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
            setIsMapReady(true);
        });
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

    const filteredTrees = useMemo(() => trees.filter(t => {
        const matchesFilter = filter === 'all' ||
            (filter === 'sponsored' && t.status === 'sponsored') ||
            (filter === 'available' && t.status === 'available');
        const matchesSearch = search === '' ||
            t.code.toLowerCase().includes(search.toLowerCase()) ||
            (t.donorName && t.donorName.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    }), [trees, filter, search]);

    const stats = {
        total: trees.length,
        sponsored: trees.filter(t => t.status === 'sponsored').length,
        available: trees.filter(t => t.status === 'available').length,
    };

    const mapCenter: [number, number] = selectedTree
        ? [selectedTree.lat, selectedTree.lng]
        : [11.948307, 108.450188];

    const createIcon = (isSponsored: boolean, isSelected: boolean) => {
        if (!L) return undefined;
        return L.divIcon({
            className: 'custom-tree-marker',
            html: `
                <div class="relative">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform
                        ${isSelected ? 'scale-125 ring-4 ring-blue-400' : ''}
                        ${isSponsored ? 'bg-pink-500 text-white' : 'bg-gray-300 text-gray-600'}">
                        🌸
                    </div>
                    ${isSponsored ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>' : ''}
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });
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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🌸 Quản Lý Cây ({stats.total})</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-lg shadow-sm p-3 text-center">
                    <div className="text-xl font-bold text-gray-800">{stats.total}</div>
                    <div className="text-xs text-gray-500">Tổng cây</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-3 text-center">
                    <div className="text-xl font-bold text-pink-600">{stats.sponsored}</div>
                    <div className="text-xs text-gray-500">Đã có chủ</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-3 text-center">
                    <div className="text-xl font-bold text-green-600">{stats.available}</div>
                    <div className="text-xs text-gray-500">Còn trống</div>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex gap-4 h-[calc(100vh-280px)]">
                {/* Left - Tree List */}
                <div className="w-80 flex-shrink-0 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                    {/* Filters */}
                    <div className="p-3 border-b space-y-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="all">Tất cả ({stats.total})</option>
                            <option value="sponsored">Đã có chủ ({stats.sponsored})</option>
                            <option value="available">Còn trống ({stats.available})</option>
                        </select>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm mã cây, tên..."
                            className="w-full px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Tree Items */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredTrees.map((tree) => (
                            <div
                                key={tree.id}
                                onClick={() => setSelectedTree(tree)}
                                className={`
                                    p-3 border-b cursor-pointer transition-colors
                                    ${selectedTree?.id === tree.id ? 'bg-pink-50 border-l-4 border-l-pink-500' : 'hover:bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-lg
                                        ${tree.status === 'sponsored' ? 'bg-pink-100' : 'bg-gray-100'}
                                    `}>
                                        🌸
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">{tree.code}</span>
                                            <span className={`
                                                text-xs px-1.5 py-0.5 rounded-full
                                                ${tree.status === 'sponsored' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}
                                            `}>
                                                {tree.status === 'sponsored' ? 'Có chủ' : 'Trống'}
                                            </span>
                                        </div>
                                        {tree.donorName ? (
                                            <div className="text-sm text-gray-600 truncate">{tree.donorName}</div>
                                        ) : (
                                            <div className="text-xs text-gray-400">Khu {tree.zone}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 text-center">
                        {filteredTrees.length} / {trees.length} cây
                    </div>
                </div>

                {/* Right - Map & Detail */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Map */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative">
                        {isMapReady && L ? (
                            <MapContainer
                                center={mapCenter}
                                zoom={selectedTree ? 19 : 17}
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
                                            click: () => setSelectedTree(tree),
                                        }}
                                    >
                                        <Popup>
                                            <TreePopupContent tree={tree} />
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-100">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Đang tải bản đồ...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Tree Info */}
                    {selectedTree && (
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-14 h-14 rounded-lg flex items-center justify-center text-2xl
                                        ${selectedTree.status === 'sponsored' ? 'bg-pink-100' : 'bg-gray-100'}
                                    `}>
                                        🌸
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Cây {selectedTree.code}</h3>
                                        <p className="text-sm text-gray-500">
                                            Khu {selectedTree.zone} • {selectedTree.lat.toFixed(6)}, {selectedTree.lng.toFixed(6)}
                                        </p>
                                        {selectedTree.donorName && (
                                            <p className="text-pink-600 font-medium mt-1">
                                                {selectedTree.donorName}
                                                {selectedTree.donorAmount && ` - ${formatCurrency(selectedTree.donorAmount)}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTree.lat},${selectedTree.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                    >
                                        📍 Chỉ đường
                                    </a>
                                    <Link
                                        href={`/admin/trees/${selectedTree.id}`}
                                        className="px-3 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => setSelectedTree(null)}
                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Popup content for map markers
function TreePopupContent({ tree }: { tree: Tree }) {
    const defaultImages = ['/images/hero-bg.jpg', '/images/og-image.jpg'];
    const images = tree.images && tree.images.length > 0 ? tree.images : defaultImages;

    return (
        <div className="min-w-[280px]">
            <div className={`
                px-3 py-2 flex items-center gap-2 rounded-t-lg
                ${tree.status === 'sponsored' ? 'bg-gradient-to-r from-pink-500 to-pink-400' : 'bg-gray-400'}
                text-white
            `}>
                <span className="text-xl">🌸</span>
                <div>
                    <div className="font-bold">{tree.status === 'sponsored' ? 'Cây đã có chủ' : 'Cây còn trống'}</div>
                    <div className="text-xs opacity-80">{tree.code} - Khu {tree.zone}</div>
                </div>
            </div>

            <div className="p-3 bg-white">
                {tree.status === 'sponsored' && tree.donorName && (
                    <div className="mb-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-pink-500">🏢</span>
                            <span className="font-semibold">{tree.donorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📅</span>
                            <span>Thời gian: 05/01/2026 - 15/01/2026</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📍</span>
                            <span>Đảo Mai Anh Đào, Hồ Xuân Hương</span>
                        </div>
                        {tree.donorAmount && (
                            <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
                                <span>💰</span>
                                <span>{formatCurrency(tree.donorAmount)}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Images */}
                <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">🖼️ Hình ảnh ({images.length})</div>
                    <div className="grid grid-cols-2 gap-1">
                        {images.slice(0, 2).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Cây ${tree.code}`}
                                className="w-full h-16 object-cover rounded"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${tree.lat},${tree.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                        📍 Chỉ đường
                    </a>
                    <Link
                        href={`/admin/trees/${tree.id}`}
                        className="py-2 px-3 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    >
                        Sửa
                    </Link>
                </div>
            </div>
        </div>
    );
}
