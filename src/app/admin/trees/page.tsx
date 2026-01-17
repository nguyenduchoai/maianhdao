'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Tree } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Dynamic import for map in modal
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
const ZoomControl = dynamic(
    () => import('react-leaflet').then((mod) => mod.ZoomControl),
    { ssr: false }
);

// Map click handler component - dynamically loaded
const LocationPicker = dynamic(
    () => Promise.resolve(function LocationPickerInner({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
        const { useMapEvents } = require('react-leaflet');

        useMapEvents({
            click: (e: any) => {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });

        return null;
    }),
    { ssr: false }
);

export default function AdminTreesPage() {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const [newTree, setNewTree] = useState({
        code: '',
        zone: 'A',
        lat: 11.948307,
        lng: 108.450188,
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchTrees();
        // Load Leaflet
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

    const handleLocationSelect = useCallback((lat: number, lng: number) => {
        setNewTree(prev => ({ ...prev, lat, lng }));
    }, []);

    const createMarkerIcon = () => {
        if (!L) return undefined;
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="width:32px;height:32px;background:#ec4899;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid white;">🌸</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    };

    const handleAddTree = async () => {
        if (!newTree.code.trim()) {
            alert('Vui lòng nhập mã cây!');
            return;
        }

        setIsAdding(true);
        try {
            const res = await fetch('/api/admin/trees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: newTree.code.toUpperCase(),
                    zone: newTree.zone,
                    lat: newTree.lat,
                    lng: newTree.lng,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã thêm cây thành công!');
                setShowAddModal(false);
                setNewTree({ code: '', zone: 'A', lat: 11.948307, lng: 108.450188 });
                fetchTrees();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error adding tree:', error);
            alert('Lỗi kết nối server');
        } finally {
            setIsAdding(false);
        }
    };

    const filteredTrees = trees.filter(tree => {
        const matchesFilter = filter === 'all'
            || (filter === 'sponsored' && tree.status === 'sponsored')
            || (filter === 'available' && tree.status === 'available');
        const matchesSearch = tree.code.toLowerCase().includes(search.toLowerCase())
            || (tree.donorName && tree.donorName.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: trees.length,
        sponsored: trees.filter(t => t.status === 'sponsored').length,
        available: trees.filter(t => t.status === 'available').length,
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🌸 Quản Lý Cây</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                        ➕ Thêm cây mới
                    </button>
                    <Link
                        href="/map/all"
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        🗺️ Xem bản đồ
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-gray-500 text-sm">Tổng số cây</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-3xl font-bold text-pink-600">{stats.sponsored}</p>
                    <p className="text-gray-500 text-sm">Đã có chủ</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-3xl font-bold text-gray-400">{stats.available}</p>
                    <p className="text-gray-500 text-sm">Còn trống</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔍 Tìm mã cây hoặc tên người đóng góp..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                        <option value="all">Tất cả ({stats.total})</option>
                        <option value="sponsored">Đã có chủ ({stats.sponsored})</option>
                        <option value="available">Còn trống ({stats.available})</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Mã cây</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Khu</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Người đóng góp</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Số tiền</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Vị trí</th>
                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrees.map((tree, index) => (
                            <tr key={tree.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3">
                                    <span className="font-semibold text-gray-800">{tree.code}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">Khu {tree.zone}</td>
                                <td className="px-4 py-3">
                                    {tree.status === 'sponsored' ? (
                                        <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                            Có chủ
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                            Trống
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {tree.donorName ? (
                                        <span className="text-pink-600 font-medium">{tree.donorName}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {tree.donorAmount ? (
                                        <span className="text-green-600 font-medium">{formatCurrency(tree.donorAmount)}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {tree.lat.toFixed(4)}, {tree.lng.toFixed(4)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={`/admin/trees/${tree.id}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Chi tiết
                                        </Link>
                                        <a
                                            href={`/map/${tree.id}`}
                                            target="_blank"
                                            className="text-pink-600 hover:underline text-sm"
                                        >
                                            Bản đồ
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredTrees.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Không tìm thấy cây nào phù hợp
                    </div>
                )}
            </div>

            {/* Pagination info */}
            <div className="mt-4 text-sm text-gray-500 text-center">
                Hiển thị {filteredTrees.length} / {trees.length} cây
            </div>

            {/* Add Tree Modal with Map */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-xl font-bold">🌸 Thêm cây mới</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Form side */}
                                <div className="p-6 space-y-4 border-r border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mã cây <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newTree.code}
                                            onChange={(e) => setNewTree({ ...newTree, code: e.target.value })}
                                            placeholder="VD: A1, B5, C10..."
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                                        <select
                                            value={newTree.zone}
                                            onChange={(e) => setNewTree({ ...newTree, zone: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        >
                                            <option value="A">Khu A</option>
                                            <option value="B">Khu B</option>
                                            <option value="C">Khu C</option>
                                            <option value="D">Khu D</option>
                                            <option value="E">Khu E</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Lat)</label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={newTree.lat}
                                                onChange={(e) => setNewTree({ ...newTree, lat: parseFloat(e.target.value) || 0 })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Lng)</label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={newTree.lng}
                                                onChange={(e) => setNewTree({ ...newTree, lng: parseFloat(e.target.value) || 0 })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-xs text-pink-600 bg-pink-50 p-3 rounded-lg">
                                        👆 <strong>Click vào bản đồ</strong> bên phải để chọn vị trí cây
                                    </div>
                                </div>

                                {/* Map side */}
                                <div className="h-[400px] md:h-auto relative">
                                    {isMapReady && L ? (
                                        <MapContainer
                                            center={[newTree.lat, newTree.lng]}
                                            zoom={17}
                                            style={{ height: '100%', width: '100%', minHeight: '400px' }}
                                            scrollWheelZoom={true}
                                            zoomControl={false}
                                        >
                                            <TileLayer
                                                attribution='&copy; OpenStreetMap'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker
                                                position={[newTree.lat, newTree.lng]}
                                                icon={createMarkerIcon()}
                                                draggable={true}
                                                eventHandlers={{
                                                    dragend: (e: any) => {
                                                        const marker = e.target;
                                                        const position = marker.getLatLng();
                                                        handleLocationSelect(position.lat, position.lng);
                                                    },
                                                }}
                                            />
                                            <LocationPicker onLocationSelect={handleLocationSelect} />
                                            <ZoomControl position="bottomright" />
                                        </MapContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center bg-gray-100">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">Đang tải bản đồ...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Map overlay info */}
                                    <div className="absolute top-2 left-2 bg-white/90 px-3 py-2 rounded-lg shadow text-sm z-[1000]">
                                        📍 {newTree.lat.toFixed(6)}, {newTree.lng.toFixed(6)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end flex-shrink-0 border-t">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddTree}
                                disabled={isAdding}
                                className="py-2 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
                            >
                                {isAdding ? 'Đang thêm...' : '✅ Thêm cây'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
