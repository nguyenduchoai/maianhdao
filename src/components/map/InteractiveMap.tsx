'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Tree } from '@/types';
import { formatCurrency, getTierLabel } from '@/lib/utils';

// Dynamic import to avoid SSR issues with Leaflet
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

interface InteractiveMapProps {
    trees: Tree[];
}

export function InteractiveMap({ trees }: InteractiveMapProps) {
    const [isClient, setIsClient] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [L, setL] = useState<typeof import('leaflet') | null>(null);

    useEffect(() => {
        setIsClient(true);
        // Import Leaflet dynamically
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });
    }, []);

    // Get unique zones
    const zones = useMemo(() => {
        const uniqueZones = [...new Set(trees.map((t) => t.zone))].sort();
        return ['all', ...uniqueZones];
    }, [trees]);

    // Filter trees
    const filteredTrees = useMemo(() => {
        return trees.filter((tree) => {
            const matchesZone = selectedZone === 'all' || tree.zone === selectedZone;
            const matchesSearch = searchTerm === '' ||
                tree.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tree.donorName && tree.donorName.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesZone && matchesSearch;
        });
    }, [trees, selectedZone, searchTerm]);

    // Map center (Đảo Mai Anh Đào, Hồ Xuân Hương)
    const center: [number, number] = [11.948307, 108.450188];

    // Create custom icons
    const createIcon = (isSponsored: boolean) => {
        if (!L) return undefined;

        return L.divIcon({
            className: 'custom-tree-marker',
            html: `
        <div class="relative">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg
            ${isSponsored
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }">
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

    if (!isClient || !L) {
        return (
            <section id="map" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            🗺️ Bản Đồ Cây Mai Anh Đào
                        </h2>
                    </div>
                    <div className="h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                            <p className="text-gray-600">Đang tải bản đồ...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="map" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        🗺️ Bản Đồ Cây Mai Anh Đào
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Bấm vào mỗi cây để xem thông tin người đóng góp.
                        <span className="text-pink-600 font-medium"> Cây màu hồng</span> đã có người đóng góp,
                        <span className="text-gray-500 font-medium"> cây màu xám</span> đang chờ bạn!
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 justify-center">
                    {/* Zone Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Khu vực:</label>
                        <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500"
                        >
                            {zones.map((zone) => (
                                <option key={zone} value={zone}>
                                    {zone === 'all' ? 'Tất cả' : `Khu ${zone}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Tìm kiếm:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Mã cây hoặc tên người..."
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 w-48"
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                            Đã có chủ: {trees.filter(t => t.status === 'sponsored').length}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                            Còn trống: {trees.filter(t => t.status === 'available').length}
                        </span>
                    </div>
                </div>

                {/* Map */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <MapContainer
                        center={center}
                        zoom={18}
                        style={{ height: '600px', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {filteredTrees.map((tree) => (
                            <Marker
                                key={tree.id}
                                position={[tree.lat, tree.lng]}
                                icon={createIcon(tree.status === 'sponsored')}
                            >
                                <Popup>
                                    <TreePopup tree={tree} />
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Tree List (Mobile Friendly) */}
                <div className="mt-8 lg:hidden">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh sách cây ({filteredTrees.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                        {filteredTrees.map((tree) => (
                            <div
                                key={tree.id}
                                className={`
                  p-3 rounded-lg text-sm
                  ${tree.status === 'sponsored'
                                        ? 'bg-pink-100 border border-pink-200'
                                        : 'bg-gray-100 border border-gray-200'}
                `}
                            >
                                <div className="font-medium">{tree.code}</div>
                                {tree.donorName && (
                                    <div className="text-gray-600 truncate text-xs">{tree.donorName}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Tree Popup Component - Enhanced like festival map
function TreePopup({ tree }: { tree: Tree }) {
    const defaultImages = [
        '/images/hero-bg.jpg',
        '/images/og-image.jpg'
    ];
    const treeImages = tree.images && tree.images.length > 0 ? tree.images : defaultImages;

    return (
        <div className="min-w-[320px] max-w-[380px]">
            {/* Header with status indicator */}
            <div className={`
                px-4 py-3 flex items-center gap-2
                ${tree.status === 'sponsored' ? 'bg-gradient-to-r from-pink-500 to-pink-400' : 'bg-gray-400'}
                text-white rounded-t-lg
            `}>
                <span className="text-2xl">🌸</span>
                <div>
                    <h3 className="text-lg font-bold">
                        {tree.status === 'sponsored' ? 'Cây đã có chủ' : 'Cây còn trống'}
                    </h3>
                    <p className="text-pink-100 text-sm">{tree.code} - Khu {tree.zone}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-white">
                {tree.status === 'sponsored' && tree.donorName ? (
                    <>
                        {/* Location & Info */}
                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-pink-500">🏢</span>
                                <span className="font-semibold">{tree.donorName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📅</span>
                                <span>Thời gian: 05/01/2026 - 15/01/2026</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📍</span>
                                <span>Đảo Mai Anh Đào, Hồ Xuân Hương</span>
                            </div>
                            {tree.donorAmount && (
                                <div className="flex items-center gap-2 text-pink-600 font-medium">
                                    <span>💰</span>
                                    <span>{formatCurrency(tree.donorAmount)}</span>
                                </div>
                            )}
                        </div>

                        {/* Images Gallery */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">🖼️ Hình ảnh ({treeImages.length})</p>
                            <div className="grid grid-cols-2 gap-2">
                                {treeImages.slice(0, 4).map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`Cây ${tree.code}`}
                                        className="w-full h-20 object-cover rounded-lg border border-gray-200 hover:opacity-90 cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sponsor Logo/Name Plate */}
                        <div className="bg-gradient-to-r from-pink-50 to-white p-3 rounded-lg border border-pink-100 mb-4">
                            <div className="flex items-center gap-3">
                                {tree.donorLogo ? (
                                    <img
                                        src={tree.donorLogo}
                                        alt={tree.donorName}
                                        className="w-14 h-14 rounded-lg object-cover border-2 border-pink-200"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-lg bg-pink-100 flex items-center justify-center text-2xl border-2 border-pink-200">
                                        🌸
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-gray-800">{tree.donorName}</p>
                                    <p className="text-xs text-pink-600">Nhà tài trợ cây {tree.code}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="text-5xl mb-3">🌱</div>
                        <h4 className="font-bold text-gray-800 mb-2">Cây này đang chờ bạn!</h4>
                        <p className="text-gray-500 text-sm mb-4">
                            Đóng góp để sở hữu cây Mai Anh Đào và để lại dấu ấn tại Đà Lạt
                        </p>
                        <a
                            href="#donate"
                            className="inline-block btn-primary text-sm py-2 px-6 rounded-full"
                        >
                            💝 Đóng Góp Ngay
                        </a>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${tree.lat},${tree.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2.5 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                        📍 Chỉ đường
                    </a>
                    <button
                        className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            const shareText = `🌸 Cây ${tree.code} - Đảo Mai Anh Đào, Đà Lạt\n${tree.donorName ? `Nhà tài trợ: ${tree.donorName}` : 'Đang chờ người đóng góp!'}\nhttps://maianhdao.lamdong.vn`;
                            navigator.clipboard.writeText(shareText);
                        }}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
