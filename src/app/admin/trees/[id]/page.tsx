'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/utils';

const DraggableMap = dynamic(() => import('@/components/admin/DraggableMap'), { ssr: false });

interface Tree {
    id: string;
    code: string;
    zone: string;
    lat: number;
    lng: number;
    status: string;
    images: string[];
    donorId?: string;
    donorName?: string;
    donorAmount?: number;
}

export default function TreeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [tree, setTree] = useState<Tree | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        lat: '',
        lng: '',
        zone: '',
        code: '',
        images: [] as string[],
    });

    useEffect(() => {
        fetchTree();
    }, [params.id]);

    const fetchTree = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            const foundTree = data.data?.find((t: Tree) => t.id === params.id);
            if (foundTree) {
                setTree(foundTree);
                setFormData({
                    lat: foundTree.lat.toString(),
                    lng: foundTree.lng.toString(),
                    zone: foundTree.zone,
                    code: foundTree.code,
                    images: foundTree.images || [],
                });
            }
        } catch (error) {
            console.error('Error fetching tree:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!tree) return;
        try {
            const res = await fetch('/api/admin/trees', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: tree.id,
                    code: formData.code,
                    zone: formData.zone,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                    images: formData.images,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã lưu thành công!');
                fetchTree();
                setIsEditing(false);
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving tree:', error);
            alert('Lỗi kết nối server');
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

    if (!tree) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">Không tìm thấy cây!</p>
                <Link href="/admin/trees" className="text-pink-600 hover:underline mt-4 inline-block">
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/admin/trees" className="text-pink-600 hover:underline">
                    ← Quay lại danh sách cây
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🌸 Cây {tree.code}</h2>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary py-2 px-4"
                        >
                            ✏️ Sửa thông tin
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="btn-primary py-2 px-4"
                            >
                                💾 Lưu
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tree Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Thông tin cây</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã cây</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            ) : (
                                <p className="text-lg font-bold text-pink-600">{tree.code}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.zone}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            ) : (
                                <p className="text-gray-800">Khu {tree.zone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <span className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${tree.status === 'sponsored'
                                    ? 'bg-pink-100 text-pink-700'
                                    : 'bg-green-100 text-green-700'}
                            `}>
                                {tree.status === 'sponsored' ? '🌸 Đã có chủ' : '🌱 Còn trống'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">📍 Vị trí trên bản đồ</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Lat)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={formData.lat}
                                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-mono">{tree.lat.toFixed(6)}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Lng)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={formData.lng}
                                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-mono">{tree.lng.toFixed(6)}</p>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            /* Draggable Map for editing */
                            <DraggableMap
                                lat={parseFloat(formData.lat) || tree.lat}
                                lng={parseFloat(formData.lng) || tree.lng}
                                onLocationChange={(newLat, newLng) => {
                                    setFormData({
                                        ...formData,
                                        lat: newLat.toFixed(6),
                                        lng: newLng.toFixed(6),
                                    });
                                }}
                            />
                        ) : (
                            <>
                                <Link
                                    href={`/map/${tree.id}`}
                                    className="block w-full text-center py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                >
                                    🗺️ Xem trên Bản đồ
                                </Link>

                                <a
                                    href={`https://www.google.com/maps?q=${tree.lat},${tree.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    📍 Xem trên Google Maps
                                </a>

                                {/* Mini Map Preview */}
                                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${tree.lat},${tree.lng}&zoom=18`}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Donor Info */}
                {tree.donorName && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">👤 Người sở hữu</h3>

                        <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">
                                🌸
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{tree.donorName}</p>
                                {tree.donorAmount && (
                                    <p className="text-pink-600 font-medium">{formatCurrency(tree.donorAmount)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Images */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">🖼️ Hình ảnh</h3>

                    {(formData.images && formData.images.length > 0) ? (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={img}
                                        alt={`Cây ${tree.code}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = formData.images.filter((_, idx) => idx !== i);
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
                            <p className="text-gray-500">Chưa có hình ảnh</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            id="tree-image-upload"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(true);
                                const formDataUpload = new FormData();
                                formDataUpload.append('file', file);
                                formDataUpload.append('type', 'trees');
                                try {
                                    const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                                    const data = await res.json();
                                    if (data.success) {
                                        setFormData({ ...formData, images: [...formData.images, data.url] });
                                        alert('Đã thêm ảnh! Nhớ nhấn "Lưu" để lưu thay đổi.');
                                    } else {
                                        alert(data.error || 'Lỗi upload');
                                    }
                                } catch (err) {
                                    alert('Lỗi upload file');
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                        />
                        <label
                            htmlFor="tree-image-upload"
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors
                                ${isUploading ? 'bg-gray-300 text-gray-500' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                        >
                            {isUploading ? 'Đang tải lên...' : '📷 Thêm hình ảnh'}
                        </label>
                        <span className="text-xs text-gray-500">Tối đa 5MB - JPG, PNG, WebP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
