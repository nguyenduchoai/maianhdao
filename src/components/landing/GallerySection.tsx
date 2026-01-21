'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GalleryImage {
    url: string;
    title: string;
    category: string;
}

const categoryLabels: Record<string, { label: string; icon: string }> = {
    trees: { label: 'Cây Anh Đào', icon: '🌸' },
    donors: { label: 'Nhà Tài Trợ', icon: '💝' },
    events: { label: 'Sự Kiện', icon: '🎉' },
    general: { label: 'Tổng Hợp', icon: '📷' },
};

interface GallerySectionProps {
    settings?: Record<string, string>;
}

export function GallerySection({ settings = {} }: GallerySectionProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    // Show only first 8 images on landing page
    const displayImages = images.slice(0, 8);

    // Don't render section if no images
    if (!isLoading && images.length === 0) {
        return null;
    }

    return (
        <section id="gallery" className="py-12 sm:py-20 bg-gradient-to-b from-pink-50 to-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                        {settings.galleryTitle || '🖼️ Thư Viện Ảnh'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
                        {settings.gallerySubtitle || 'Những khoảnh khắc đẹp từ chiến dịch Ngàn Cây Anh Đào'}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent" />
                    </div>
                ) : (
                    <>
                        {/* Gallery Grid - Responsive */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                            {displayImages.map((image, index) => (
                                <div
                                    key={image.url + index}
                                    onClick={() => setViewImage(image)}
                                    className="relative group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                                >
                                    <div className="aspect-square">
                                        <img
                                            src={image.url}
                                            alt={image.title || 'Ảnh chiến dịch'}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white">
                                            <p className="text-xs sm:text-sm font-medium truncate">
                                                {image.title || categoryLabels[image.category]?.label || 'Ảnh thư viện'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 rounded text-xs shadow">
                                            {categoryLabels[image.category]?.icon || '📷'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Button */}
                        {images.length > 8 && (
                            <div className="text-center">
                                <Link
                                    href="/thu-vien-anh"
                                    className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    🖼️ Xem tất cả {images.length} ảnh
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Lightbox Modal */}
            {viewImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setViewImage(null)}
                >
                    <button
                        onClick={() => setViewImage(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 z-10 text-lg"
                    >
                        ✕
                    </button>
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
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
