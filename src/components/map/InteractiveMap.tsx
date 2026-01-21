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
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
        // Import Leaflet dynamically
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });

        // Listen for lightbox events from popup
        const handleLightbox = (e: CustomEvent) => {
            setLightboxImage(e.detail);
        };
        window.addEventListener('openLightbox' as any, handleLightbox);
        return () => {
            window.removeEventListener('openLightbox' as any, handleLightbox);
        };
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
                        style={{ height: '500px', width: '100%' }}
                        className="sm:!h-[600px] md:!h-[700px] lg:!h-[800px]"
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
        </section>
    );
}

// Tree Popup Component - Enhanced with Multi-Donor Support
function TreePopup({ tree }: { tree: Tree }) {
    const defaultImages = [
        '/images/hero-bg.jpg',
        '/images/og-image.jpg'
    ];
    const treeImages = tree.images && tree.images.length > 0 ? tree.images : defaultImages;

    // Get all donors from donors array or fallback to primary donor
    const donors = tree.donors || (tree.donorName ? [{
        id: tree.donorId || '',
        name: tree.donorName,
        logo_url: tree.donorLogo || null,
        amount: tree.donorAmount || 0,
        tier: 'kientao',
        message: tree.donorMessage || null,
    }] : []);

    const getTierLabel = (tier: string) => {
        switch (tier) {
            case 'kientao': return '🏆 KIẾN TẠO';
            case 'dauun': return '🌸 DẤU ẤN';
            case 'guitrao': return '💝 GỬI TRAO';
            case 'gieomam': return '🌱 GIEO MẦM';
            default: return tier;
        }
    };

    return (
        <div className="w-[280px] sm:w-[360px] md:w-[420px] max-w-[90vw]">
            {/* Header with status indicator */}
            <div className={`
                px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-2 sm:gap-3
                ${tree.status === 'sponsored' ? 'bg-gradient-to-r from-pink-500 to-pink-400' : 'bg-gray-400'}
                text-white rounded-t-lg
            `}>
                <span className="text-2xl sm:text-3xl">🌸</span>
                <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-bold truncate">
                        {tree.status === 'sponsored' ? 'Địa điểm cây Mai anh đào' : 'Cây còn trống'}
                    </h3>
                    <p className="text-pink-100 text-sm">{tree.code} - Khu {tree.zone}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-5 bg-white">
                {tree.status === 'sponsored' && donors.length > 0 ? (
                    <>
                        {/* Multiple Donors Section */}
                        <div className="mb-3 sm:mb-4">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                                👥 Người sở hữu ({donors.length})
                            </h4>
                            <div className="space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
                                {donors.map((donor, index) => (
                                    <div
                                        key={donor.id}
                                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border ${index === 0
                                            ? 'bg-gradient-to-r from-pink-50 to-white border-pink-200'
                                            : 'bg-gray-50 border-gray-100'
                                            }`}
                                    >
                                        {donor.logo_url ? (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white border border-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <img
                                                    src={donor.logo_url}
                                                    alt={donor.name}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-pink-100 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                                                🌸
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <span className="font-bold text-gray-800 truncate text-sm sm:text-base">{donor.name}</span>
                                                {index === 0 && (
                                                    <span className="px-1 py-0.5 bg-pink-500 text-white text-[10px] sm:text-xs rounded flex-shrink-0">Chính</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                                <span className="text-pink-600 font-medium">{formatCurrency(donor.amount)}</span>
                                                <span className="text-gray-400 hidden sm:inline">•</span>
                                                <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">{getTierLabel(donor.tier)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Primary Donor Message */}
                        {donors[0]?.message && (
                            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <span className="text-base sm:text-lg">💬</span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1">Ghi chú:</p>
                                        <p className="text-gray-700 text-xs sm:text-sm break-words">{donors[0].message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Grid */}
                        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📅</span>
                                <span>Thời gian trồng: 18/01/2026</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📍</span>
                                <span className="truncate">Đảo Mai Anh Đào, Hồ Xuân Hương</span>
                            </div>
                        </div>

                        {/* Images Gallery */}
                        <div className="mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">🖼️ Hình ảnh ({treeImages.length})</p>
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                {treeImages.slice(0, 4).map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`Cây ${tree.code}`}
                                        className="w-full h-16 sm:h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 hover:shadow-md cursor-pointer transition-all active:scale-95"
                                        onClick={() => window.dispatchEvent(new CustomEvent('openLightbox', { detail: img }))}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 sm:py-6">
                        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🌱</div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Cây này đang chờ bạn!</h4>
                        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                            Đóng góp để sở hữu cây Mai Anh Đào và để lại dấu ấn tại Đà Lạt
                        </p>
                        <a
                            href="#donate"
                            className="inline-block btn-primary text-xs sm:text-sm py-2 px-4 sm:px-6 rounded-full"
                        >
                            💝 Đóng Góp Ngay
                        </a>
                    </div>
                )}

                {/* Actions - Touch friendly */}
                <div className="flex gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${tree.lat},${tree.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-3 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors"
                    >
                        📍 Chỉ đường
                    </a>
                    <button
                        className="py-2.5 sm:py-3 px-3 sm:px-4 bg-pink-100 text-pink-700 rounded-lg text-xs sm:text-sm hover:bg-pink-200 active:bg-pink-300 transition-colors font-medium"
                        onClick={() => {
                            const shareUrl = `https://maianhdao.lamdong.vn/map/${tree.id}`;
                            const shareText = `🌸 Cây ${tree.code} - Đảo Mai Anh Đào, Đà Lạt\n${donors.length > 0 ? `Nhà tài trợ: ${donors.map(d => d.name).join(', ')}` : 'Đang chờ người đóng góp!'}\n${shareUrl}`;
                            navigator.clipboard.writeText(shareText);
                            alert('Đã copy link chia sẻ!');
                        }}
                    >
                        🔗
                    </button>
                </div>
            </div>
        </div>
    );
}

