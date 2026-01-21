'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface GalleryImage {
    url: string;
    title: string;
    category: 'trees' | 'donors' | 'events' | 'general';
    createdAt: string;
}

const categoryLabels: Record<string, { label: string; icon: string }> = {
    trees: { label: 'Cây Anh Đào', icon: '🌸' },
    donors: { label: 'Nhà Tài Trợ', icon: '💝' },
    events: { label: 'Sự Kiện', icon: '🎉' },
    general: { label: 'Tổng Hợp', icon: '📷' },
};

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [uploadCategory, setUploadCategory] = useState<string>('general');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [viewImage, setViewImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            if (data.success) {
                setImages(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const uploadedCount = { success: 0, failed: 0 };

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'gallery');
            formData.append('category', uploadCategory);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    uploadedCount.success++;
                } else {
                    uploadedCount.failed++;
                }
            } catch {
                uploadedCount.failed++;
            }
        }

        alert(`Đã tải lên ${uploadedCount.success} ảnh thành công${uploadedCount.failed > 0 ? `, ${uploadedCount.failed} ảnh thất bại` : ''}`);
        setIsUploading(false);
        setShowUploadModal(false);
        fetchImages();
    };

    const handleDelete = async (urls: string[]) => {
        if (!confirm(`Xóa ${urls.length} ảnh đã chọn?`)) return;

        try {
            const res = await fetch('/api/gallery', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã xóa thành công!');
                setSelectedImages(new Set());
                fetchImages();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch {
            alert('Lỗi kết nối server');
        }
    };

    const toggleImageSelection = (url: string) => {
        const newSelected = new Set(selectedImages);
        if (newSelected.has(url)) {
            newSelected.delete(url);
        } else {
            newSelected.add(url);
        }
        setSelectedImages(newSelected);
    };

    const filteredImages = selectedCategory === 'all'
        ? images
        : images.filter(img => img.category === selectedCategory);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Đang tải thư viện ảnh...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">🖼️ Thư Viện Ảnh</h2>
                    <p className="text-gray-500 text-sm mt-1">{images.length} ảnh trong thư viện</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {selectedImages.size > 0 && (
                        <button
                            onClick={() => handleDelete(Array.from(selectedImages))}
                            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                            🗑️ Xóa ({selectedImages.size})
                        </button>
                    )}
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
                    >
                        📤 Tải ảnh lên
                    </button>
                    <Link
                        href="/thu-vien-anh"
                        target="_blank"
                        className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                        👁️ Xem trang công khai
                    </Link>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg shadow-sm p-4">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === 'all'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Tất cả ({images.length})
                </button>
                {Object.entries(categoryLabels).map(([key, { label, icon }]) => {
                    const count = images.filter(img => img.category === key).length;
                    return (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === key
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {icon} {label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Gallery Grid */}
            {filteredImages.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="text-5xl mb-4">📷</div>
                    <p className="text-gray-600 mb-2">Chưa có ảnh nào</p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="text-pink-600 hover:underline"
                    >
                        Tải ảnh đầu tiên lên →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image.url + index}
                            className={`relative group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer border-2 transition-all ${
                                selectedImages.has(image.url) ? 'border-pink-500 ring-2 ring-pink-200' : 'border-transparent'
                            }`}
                        >
                            <div
                                className="aspect-square"
                                onClick={() => setViewImage(image)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title || 'Ảnh thư viện'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setViewImage(image);
                                    }}
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100"
                                >
                                    🔍
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete([image.url]);
                                    }}
                                    className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                                >
                                    🗑️
                                </button>
                            </div>

                            {/* Checkbox */}
                            <div
                                className="absolute top-2 left-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleImageSelection(image.url);
                                }}
                            >
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                    selectedImages.has(image.url)
                                        ? 'bg-pink-500 border-pink-500 text-white'
                                        : 'bg-white/80 border-gray-300'
                                }`}>
                                    {selectedImages.has(image.url) && '✓'}
                                </div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-2 right-2">
                                <span className="px-2 py-1 bg-white/90 rounded text-xs">
                                    {categoryLabels[image.category]?.icon}
                                </span>
                            </div>

                            {/* Title */}
                            {image.title && (
                                <div className="p-2 bg-white">
                                    <p className="text-xs text-gray-600 truncate">{image.title}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">📤 Tải ảnh lên</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Category Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục
                                </label>
                                <select
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                >
                                    {Object.entries(categoryLabels).map(([key, { label, icon }]) => (
                                        <option key={key} value={key}>
                                            {icon} {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Upload Zone */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleUpload}
                                    className="hidden"
                                    id="gallery-upload"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="gallery-upload"
                                    className="cursor-pointer"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                                            <p className="text-gray-600">Đang tải lên...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-5xl mb-4">📷</div>
                                            <p className="text-gray-600 mb-2">Nhấn để chọn ảnh</p>
                                            <p className="text-gray-400 text-sm">Có thể chọn nhiều ảnh cùng lúc</p>
                                            <p className="text-gray-400 text-xs mt-2">JPG, PNG, WebP - Tối đa 5MB mỗi ảnh</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Image Modal */}
            {viewImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setViewImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <img
                            src={viewImage.url}
                            alt={viewImage.title || 'Ảnh phóng to'}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setViewImage(null)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30"
                        >
                            ✕
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-4 text-white">
                            <p className="font-medium">{viewImage.title || 'Ảnh thư viện'}</p>
                            <p className="text-sm opacity-70">{categoryLabels[viewImage.category]?.label}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
