'use client';

import { Sponsor } from '@/types';
import { getTierLabel } from '@/lib/utils';
import Image from 'next/image';

interface SponsorsSectionProps {
    sponsors: Sponsor[];
}

export function SponsorsSection({ sponsors }: SponsorsSectionProps) {
    const organizers = sponsors.filter(s => s.tier === 'organizer');
    const diamonds = sponsors.filter(s => s.tier === 'diamond');
    const golds = sponsors.filter(s => s.tier === 'gold');
    const silvers = sponsors.filter(s => s.tier === 'silver');

    return (
        <section id="sponsors" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Đơn Vị Đồng Hành
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cảm ơn sự đồng hành của các đơn vị, doanh nghiệp và cá nhân đã chung tay xây dựng
                        Đảo Mai Anh Đào tại trái tim Đà Lạt
                    </p>
                </div>

                {/* Organizers */}
                {organizers.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center text-lg font-semibold text-pink-600 mb-6 uppercase tracking-wider">
                            {getTierLabel('organizer')}
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-8">
                            {organizers.map((sponsor) => (
                                <SponsorCard key={sponsor.id} sponsor={sponsor} size="large" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Diamond Sponsors */}
                {diamonds.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center text-lg font-semibold text-blue-600 mb-6 uppercase tracking-wider">
                            {getTierLabel('diamond')}
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-6">
                            {diamonds.map((sponsor) => (
                                <SponsorCard key={sponsor.id} sponsor={sponsor} size="medium" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Gold Sponsors */}
                {golds.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center text-lg font-semibold text-amber-600 mb-6 uppercase tracking-wider">
                            {getTierLabel('gold')}
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            {golds.map((sponsor) => (
                                <SponsorCard key={sponsor.id} sponsor={sponsor} size="small" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Silver Sponsors */}
                {silvers.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-center text-lg font-semibold text-gray-500 mb-6 uppercase tracking-wider">
                            {getTierLabel('silver')}
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            {silvers.map((sponsor) => (
                                <SponsorCard key={sponsor.id} sponsor={sponsor} size="small" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

interface SponsorCardProps {
    sponsor: Sponsor;
    size: 'large' | 'medium' | 'small';
}

function SponsorCard({ sponsor, size }: SponsorCardProps) {
    const sizes = {
        large: 'w-40 h-28',
        medium: 'w-32 h-24',
        small: 'w-24 h-20',
    };

    return (
        <a
            href={sponsor.website || '#'}
            target={sponsor.website ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={`
        ${sizes[size]} 
        glass-card p-3 flex flex-col items-center justify-center
        hover:shadow-lg transition-all duration-300 hover:-translate-y-1
      `}
        >
            {sponsor.logoUrl ? (
                <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={size === 'large' ? 120 : size === 'medium' ? 100 : 80}
                    height={size === 'large' ? 60 : size === 'medium' ? 50 : 40}
                    className="object-contain"
                />
            ) : (
                <div className="text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-xs text-gray-600 line-clamp-2">{sponsor.name}</div>
                </div>
            )}
        </a>
    );
}
