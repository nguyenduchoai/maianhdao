'use client';

import { CampaignStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface HeroSectionProps {
    stats?: CampaignStats;
    settings?: Record<string, string>;
}

export function HeroSection({ stats, settings = {} }: HeroSectionProps) {
    const percentComplete = stats?.percentComplete || 0;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-pink-900/60 via-pink-800/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
                {/* Decorative Cherry Blossom */}
                <div className="mb-6">
                    <span className="text-6xl">🌸</span>
                </div>

                {/* Main Title */}
                <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
                    {settings.heroTitle || 'NGÀN CÂY ANH ĐÀO'}
                </h1>
                <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg">
                    {settings.heroSubtitle || 'Quanh Hồ Xuân Hương & Khu Vực Đà Lạt'}
                </h2>

                {/* Subtitle */}
                <p className="font-accent text-2xl md:text-3xl mb-8 text-pink-100">
                    {settings.heroTagline || 'Để Lại Dấu Ấn Tại Trái Tim Thành Phố Ngàn Hoa'}
                </p>

                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-pink-50 leading-relaxed">
                    {settings.heroDescription || 'Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào tại Hồ Xuân Hương và các khu vực trọng điểm của Đà Lạt'}
                </p>

                {/* Progress Bar */}
                {stats && (
                    <div className="max-w-xl mx-auto mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                        <div className="flex justify-between text-sm mb-2 text-gray-700">
                            <span className="font-medium">Đã quyên góp</span>
                            <span className="font-bold text-pink-600">{formatCurrency(stats.totalRaised)} / {formatCurrency(stats.targetAmount)}</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="progress-bar h-full transition-all duration-1000 ease-out bg-gradient-to-r from-pink-500 to-pink-400"
                                style={{ width: `${percentComplete}%` }}
                            />
                        </div>
                        <p className="text-sm mt-2 text-gray-600 text-center">
                            <span className="font-bold text-pink-600">{percentComplete}%</span> hoàn thành • {stats.totalDonors} người đóng góp • {stats.treesSponsored} cây đã có chủ
                        </p>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#donate" className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        💝 {settings.heroButtonText || 'Đóng Góp Ngay'}
                    </a>
                    <a href="#map" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm hover:bg-white hover:text-pink-600 transition-all">
                        🗺️ {settings.heroButtonText2 || 'Xem Bản Đồ Cây'}
                    </a>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-4xl mx-auto">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 text-center shadow-lg border border-white/50">
                            <div className="text-lg md:text-xl font-bold text-pink-600 whitespace-nowrap">{settings.statTarget || '500 triệu'}</div>
                            <div className="text-xs md:text-sm text-gray-600">{settings.statTargetLabel || 'Mục tiêu'}</div>
                        </div>
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 text-center shadow-lg border border-white/50">
                            <div className="text-xl md:text-2xl font-bold text-pink-600">{settings.statTrees || '200'}</div>
                            <div className="text-xs md:text-sm text-gray-600">{settings.statTreesLabel || 'Cây Mai Anh Đào'}</div>
                        </div>
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 text-center shadow-lg border border-white/50">
                            <div className="text-xl md:text-2xl font-bold text-pink-600">{settings.statDays || '10'}</div>
                            <div className="text-xs md:text-sm text-gray-600">{settings.statDaysLabel || 'Ngày cao điểm'}</div>
                        </div>
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 text-center shadow-lg border border-white/50">
                            <div className="text-xl md:text-2xl font-bold text-pink-600">{stats.treesAvailable}</div>
                            <div className="text-xs md:text-sm text-gray-600">{settings.statWaitingLabel || 'Cây chờ đóng góp'}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
