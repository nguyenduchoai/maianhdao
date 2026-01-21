'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Tree } from '@/types';

// Dynamic import to avoid SSR issues
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

interface TreePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (tree: Tree) => void;
    selectedTreeId?: string;
}

export function TreePickerModal({ isOpen, onClose, onSelect, selectedTreeId }: TreePickerModalProps) {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const [hoveredTreeId, setHoveredTreeId] = useState<string | null>(null);

    // Map center (Đảo Mai Anh Đào, Hồ Xuân Hương)
    const center: [number, number] = [11.948307, 108.450188];

    // Fetch trees on mount
    useEffect(() => {
        if (isOpen) {
            fetchTrees();
            import('leaflet').then((leaflet) => {
                setL(leaflet.default);
            });
        }
    }, [isOpen]);

    const fetchTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            if (data.success) {
                setTrees(data.data);
            }
        } catch (error) {
            console.error('Error fetching trees:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique zones
    const zones = useMemo(() => {
        const uniqueZones = [...new Set(trees.map((t) => t.zone))].sort();
        return ['all', ...uniqueZones];
    }, [trees]);

    // Filter trees - only show available ones
    const filteredTrees = useMemo(() => {
        return trees.filter((tree) => {
            const matchesZone = selectedZone === 'all' || tree.zone === selectedZone;
            const matchesSearch = searchTerm === '' ||
                tree.code.toLowerCase().includes(searchTerm.toLowerCase());
            // Only show available trees for selection
            const isAvailable = tree.status === 'available';
            return matchesZone && matchesSearch && isAvailable;
        });
    }, [trees, selectedZone, searchTerm]);

    // Stats
    const stats = useMemo(() => {
        return {
            sponsored: trees.filter(t => t.status === 'sponsored').length,
            available: trees.filter(t => t.status === 'available').length,
        };
    }, [trees]);

    // Create custom icons
    const createIcon = (isSelected: boolean, isHovered: boolean) => {
        if (!L) return undefined;
        
        const bgColor = isSelected 
            ? 'bg-green-500' 
            : isHovered 
                ? 'bg-pink-400' 
                : 'bg-gray-300';
        const scale = isSelected || isHovered ? 'scale-125' : '';

        return L.divIcon({
            className: 'custom-tree-marker',
            html: `
                <div class="relative ${scale} transition-transform">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-lg ${bgColor} text-white">
                        🌸
                    </div>
                    ${isSelected ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>' : ''}
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="absolute inset-4 md:inset-8 lg:inset-12 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🌸</span>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold">Chọn Vị Trí Cây Mai Anh Đào</h2>
                            <p className="text-pink-100 text-sm">Chọn cây mà doanh nghiệp muốn sở hữu</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-pink-300"></span>
                                Đã có chủ: {stats.sponsored}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                                Còn trống: {stats.available}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Tree List Sidebar */}
                    <div className="w-full lg:w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                        {/* Filters */}
                        <div className="p-3 border-b border-gray-200 space-y-2">
                            <select
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-pink-500"
                            >
                                {zones.map((zone) => (
                                    <option key={zone} value={zone}>
                                        {zone === 'all' ? `Tất cả (${filteredTrees.length})` : `Khu ${zone}`}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="🔍 Tìm mã cây, tên người..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* Tree List */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
                                </div>
                            ) : filteredTrees.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <p className="text-4xl mb-2">🌱</p>
                                    <p>Không có cây nào còn trống</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredTrees.map((tree) => (
                                        <button
                                            key={tree.id}
                                            onClick={() => onSelect(tree)}
                                            onMouseEnter={() => setHoveredTreeId(tree.id)}
                                            onMouseLeave={() => setHoveredTreeId(null)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                                                ${selectedTreeId === tree.id 
                                                    ? 'bg-green-100 border-2 border-green-500 shadow-md' 
                                                    : 'bg-white border border-gray-200 hover:border-pink-300 hover:shadow'}
                                            `}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                                                ${selectedTreeId === tree.id ? 'bg-green-500 text-white' : 'bg-gray-200'}
                                            `}>
                                                🌸
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800">{tree.code}</span>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full
                                                        ${tree.status === 'available' 
                                                            ? 'bg-gray-100 text-gray-600' 
                                                            : 'bg-pink-100 text-pink-600'}
                                                    `}>
                                                        {tree.status === 'available' ? 'Trống' : 'Có chủ'}
                                                    </span>
                                                    {selectedTreeId === tree.id && (
                                                        <span className="text-green-600 text-xs font-medium">✓ Đã chọn</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">Khu {tree.zone} • Chờ đóng góp</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Stats */}
                        <div className="p-3 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
                            {filteredTrees.length} / {trees.filter(t => t.status === 'available').length} cây
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 relative hidden lg:block">
                        {L ? (
                            <MapContainer
                                center={center}
                                zoom={18}
                                style={{ height: '100%', width: '100%' }}
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
                                        icon={createIcon(
                                            selectedTreeId === tree.id,
                                            hoveredTreeId === tree.id
                                        )}
                                        eventHandlers={{
                                            click: () => onSelect(tree),
                                        }}
                                    />
                                ))}
                            </MapContainer>
                        ) : (
                            <div className="h-full bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                                    <p className="text-gray-600">Đang tải bản đồ...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        {selectedTreeId ? (
                            <span className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                Đã chọn cây: <strong className="text-pink-600">{trees.find(t => t.id === selectedTreeId)?.code}</strong>
                            </span>
                        ) : (
                            <span className="text-gray-400">Chưa chọn cây nào</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onClose}
                            disabled={!selectedTreeId}
                            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Xác Nhận Chọn Cây
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
