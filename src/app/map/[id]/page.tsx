'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
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
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

export default function MapTreePage() {
    const params = useParams();
    const treeId = params.id as string;

    const [trees, setTrees] = useState<Tree[]>([]);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapReady, setIsMapReady] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTrees();
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
        return L.divIcon({
            className: 'custom-tree-marker',
            html: `
                <div class="relative">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform
                        ${isSelected ? 'scale-125 ring-4 ring-blue-400 animate-pulse' : ''}
                        ${isSponsored ? 'bg-pink-500 text-white' : 'bg-gray-300 text-gray-600'}">
                        🌸
                    </div>
                    ${isSponsored ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>' : ''}
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
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
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
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
                            placeholder="Tìm mã cây, tên người..."
                            className="w-full px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Tree List */}
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
                                            <div className="text-sm text-pink-600 truncate">{tree.donorName}</div>
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
                </aside>

                {/* Map */}
                <main className="flex-1 relative">
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
                                        <TreePopup tree={tree} />
                                    </Popup>
                                </Marker>
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

                    {/* Selected Tree Info Panel */}
                    {selectedTree && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-lg mx-auto">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                                        ${selectedTree.status === 'sponsored' ? 'bg-pink-100' : 'bg-gray-100'}
                                    `}>
                                        🌸
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Cây {selectedTree.code}</h3>
                                        <p className="text-sm text-gray-500">
                                            Khu {selectedTree.zone} • {selectedTree.lat.toFixed(6)}, {selectedTree.lng.toFixed(6)}
                                        </p>
                                        {selectedTree.donorName && (
                                            <p className="text-pink-600 font-semibold mt-1">
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
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                                    >
                                        📍 Chỉ đường
                                    </a>
                                    <button
                                        onClick={() => setSelectedTree(null)}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Popup content
function TreePopup({ tree }: { tree: Tree }) {
    const defaultImages = ['/images/hero-bg.jpg', '/images/og-image.jpg'];
    const images = tree.images && tree.images.length > 0 ? tree.images : defaultImages;

    return (
        <div className="min-w-[300px]">
            <div className={`
                px-4 py-3 flex items-center gap-3 rounded-t-lg
                ${tree.status === 'sponsored' ? 'bg-gradient-to-r from-pink-500 to-pink-400' : 'bg-gray-400'}
                text-white
            `}>
                <span className="text-2xl">🌸</span>
                <div>
                    <div className="font-bold text-lg">{tree.status === 'sponsored' ? 'Cây đã có chủ' : 'Cây còn trống'}</div>
                    <div className="text-sm opacity-90">{tree.code} - Khu {tree.zone}</div>
                </div>
            </div>

            <div className="p-4 bg-white">
                {tree.status === 'sponsored' && tree.donorName && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <span className="text-pink-500">🏢</span>
                            <span>{tree.donorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📅</span>
                            <span>Thời gian nở hoa: 05/01/2026 - 31/01/2026</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📍</span>
                            <span>Đảo Mai Anh Đào, Hồ Xuân Hương, Đà Lạt</span>
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
                <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">🖼️ Hình ảnh ({images.length})</div>
                    <div className="grid grid-cols-2 gap-2">
                        {images.slice(0, 2).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Cây ${tree.code}`}
                                className="w-full h-20 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${tree.lat},${tree.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                    >
                        📍 Chỉ đường
                    </a>
                    <button className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
