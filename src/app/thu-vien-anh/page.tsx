'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SubpageHeader } from '@/components/landing/SubpageHeader';

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

export default function PublicGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewImage, setViewImage] = useState<GalleryImage | null>(null);
    const [viewIndex, setViewIndex] = useState<number>(0);

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

    const filteredImages = selectedCategory === 'all'
        ? images
        : images.filter(img => img.category === selectedCategory);

    const handlePrev = () => {
        if (viewIndex > 0) {
            setViewIndex(viewIndex - 1);
            setViewImage(filteredImages[viewIndex - 1]);
        }
    };

    const handleNext = () => {
        if (viewIndex < filteredImages.length - 1) {
            setViewIndex(viewIndex + 1);
            setViewImage(filteredImages[viewIndex + 1]);
        }
    };

    const openImage = (image: GalleryImage, index: number) => {
        setViewImage(image);
        setViewIndex(index);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thư viện ảnh...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Full Navigation Header */}
            <SubpageHeader currentPage="thu-vien-anh" />

            {/* Spacer for fixed header */}
            <div className="h-16 md:h-20" />

            <main className="container mx-auto px-4 py-6 sm:py-12">
                {/* Title */}
                <div className="text-center mb-6 sm:mb-12">
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
                        🖼️ Thư Viện Ảnh
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Những khoảnh khắc đẹp từ chiến dịch <strong>NGÀN CÂY ANH ĐÀO</strong>
                    </p>
                </div>

                {/* Category Filter - Mobile Optimized */}
                <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                            selectedCategory === 'all'
                                ? 'bg-pink-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-pink-100 shadow'
                        }`}
                    >
                        Tất cả ({images.length})
                    </button>
                    {Object.entries(categoryLabels).map(([key, { label, icon }]) => {
                        const count = images.filter(img => img.category === key).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                    selectedCategory === key
                                        ? 'bg-pink-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-pink-100 shadow'
                                }`}
                            >
                                {icon} <span className="hidden sm:inline">{label}</span> ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Gallery Grid - Responsive */}
                {filteredImages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-gray-500 mb-4">Chưa có ảnh nào trong thư viện</p>
                        <Link href="/" className="btn-primary inline-block">
                            ← Quay về trang chủ
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                        {filteredImages.map((image, index) => (
                            <div
                                key={image.url + index}
                                onClick={() => openImage(image, index)}
                                className="relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                            >
                                <div className="aspect-square">
                                    <img
                                        src={image.url}
                                        alt={image.title || 'Ảnh thư viện'}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white">
                                        <p className="text-xs sm:text-sm font-medium truncate">
                                            {image.title || categoryLabels[image.category]?.label}
                                        </p>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 rounded text-xs shadow">
                                        {categoryLabels[image.category]?.icon}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back to home */}
                <div className="text-center mt-8 sm:mt-12">
                    <Link href="/" className="btn-primary inline-block text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
                        ← Quay về trang chủ
                    </Link>
                </div>
            </main>

            {/* Lightbox Modal - Mobile optimized */}
            {viewImage && (
                <div
                    className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
                    onClick={() => setViewImage(null)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setViewImage(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 z-10 text-lg"
                    >
                        ✕
                    </button>

                    {/* Navigation - Previous */}
                    {viewIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 text-xl sm:text-2xl"
                        >
                            ‹
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="max-w-[95vw] sm:max-w-4xl max-h-[85vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={viewImage.url}
                            alt={viewImage.title || 'Ảnh phóng to'}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                            <p className="text-white font-medium text-sm sm:text-base">
                                {viewImage.title || 'Ảnh thư viện'}
                            </p>
                            <p className="text-white/70 text-xs sm:text-sm">
                                {categoryLabels[viewImage.category]?.icon} {categoryLabels[viewImage.category]?.label}
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                                {viewIndex + 1} / {filteredImages.length}
                            </p>
                        </div>
                    </div>

                    {/* Navigation - Next */}
                    {viewIndex < filteredImages.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 text-xl sm:text-2xl"
                        >
                            ›
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
