'use client';

import { Sponsor } from '@/types';
import Image from 'next/image';

interface SponsorsSectionProps {
    sponsors: Sponsor[];
}

export function SponsorsSection({ sponsors }: SponsorsSectionProps) {
    // Chỉ lấy organizers (Ban Tổ Chức)
    const organizers = sponsors.filter(s => s.tier === 'organizer');

    if (organizers.length === 0) {
        return null;
    }

    return (
        <section id="sponsors" className="py-20 bg-gradient-to-b from-white to-pink-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        🏛️ Ban Tổ Chức
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chiến dịch được tổ chức bởi các đơn vị uy tín tại Lâm Đồng
                    </p>
                </div>

                {/* Large Logo Cards for Organizers */}
                <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-5xl mx-auto">
                    {organizers.map((sponsor) => (
                        <a
                            key={sponsor.id}
                            href={sponsor.website || '#'}
                            target={sponsor.website ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-w-[200px] max-w-[280px] border border-gray-100"
                        >
                            {sponsor.logoUrl ? (
                                <div className="w-40 h-32 flex items-center justify-center mb-4">
                                    <Image
                                        src={sponsor.logoUrl}
                                        alt={sponsor.name}
                                        width={160}
                                        height={120}
                                        className="object-contain max-h-28"
                                    />
                                </div>
                            ) : (
                                <div className="w-40 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mb-4">
                                    <span className="text-5xl">🏛️</span>
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-gray-800 text-center">{sponsor.name}</h3>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
