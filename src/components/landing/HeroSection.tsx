'use client';

import { CampaignStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface HeroSectionProps {
    stats?: CampaignStats;
}

export function HeroSection({ stats }: HeroSectionProps) {
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
                    Để Lại Dấu Ấn
                </h1>
                <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                    Tại Trái Tim Đà Lạt
                </h2>

                {/* Subtitle */}
                <p className="font-accent text-2xl md:text-3xl mb-8 text-pink-100">
                    Đảo Mai Anh Đào - Hồ Xuân Hương
                </p>

                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-pink-50 leading-relaxed">
                    Xã hội hóa cảnh quan & Gây quỹ cộng đồng để trồng <strong>200 cây Mai Anh Đào trưởng thành</strong>
                    {' '}tại trái tim thành phố ngàn hoa
                </p>

                {/* Progress Bar */}
                {stats && (
                    <div className="max-w-xl mx-auto mb-8">
                        <div className="flex justify-between text-sm mb-2 text-pink-100">
                            <span>Đã quyên góp</span>
                            <span>{formatCurrency(stats.totalRaised)} / {formatCurrency(stats.targetAmount)}</span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="progress-bar h-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentComplete}%` }}
                            />
                        </div>
                        <p className="text-sm mt-2 text-pink-100">
                            {percentComplete}% hoàn thành • {stats.totalDonors} người đóng góp • {stats.treesSponsored} cây đã có chủ
                        </p>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#donate" className="btn-primary text-lg">
                        💝 Đóng Góp Ngay
                    </a>
                    <a href="#map" className="btn-secondary bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-pink-600">
                        🗺️ Xem Bản Đồ Cây
                    </a>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
                        <div className="glass-card bg-white/10 backdrop-blur-sm p-4 text-center">
                            <div className="text-3xl font-bold text-white">{formatCurrency(stats.targetAmount)}</div>
                            <div className="text-sm text-pink-100">Mục tiêu</div>
                        </div>
                        <div className="glass-card bg-white/10 backdrop-blur-sm p-4 text-center">
                            <div className="text-3xl font-bold text-white">200</div>
                            <div className="text-sm text-pink-100">Cây Mai Anh Đào</div>
                        </div>
                        <div className="glass-card bg-white/10 backdrop-blur-sm p-4 text-center">
                            <div className="text-3xl font-bold text-white">10</div>
                            <div className="text-sm text-pink-100">Ngày cao điểm</div>
                        </div>
                        <div className="glass-card bg-white/10 backdrop-blur-sm p-4 text-center">
                            <div className="text-3xl font-bold text-white">{stats.treesAvailable}</div>
                            <div className="text-sm text-pink-100">Cây chờ đóng góp</div>
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
