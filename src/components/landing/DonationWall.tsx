'use client';

import { useState } from 'react';
import { formatCurrency, getTierLabel, getTierColor } from '@/lib/utils';
import { Donation } from '@/types';

interface DonationWallProps {
    donations: Donation[];
}

export function DonationWall({ donations }: DonationWallProps) {
    const [showAll, setShowAll] = useState(false);

    const displayDonations = showAll ? donations : donations.slice(0, 20);

    // Group donations by tier
    const diamonds = donations.filter(d => d.tier === 'diamond');
    const golds = donations.filter(d => d.tier === 'gold');
    const silvers = donations.filter(d => d.tier === 'silver');
    const greens = donations.filter(d => d.tier === 'green');
    const imprints = donations.filter(d => d.tier === 'imprint');
    const entrusts = donations.filter(d => d.tier === 'entrust');

    // Combine all other donors
    const otherDonors = [...imprints, ...entrusts, ...donations.filter(d => !['diamond', 'gold', 'silver', 'green', 'imprint', 'entrust'].includes(d.tier || ''))];


    return (
        <section id="donors" className="py-20 bg-gradient-to-b from-pink-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        🌸 Danh Sách Ghi Danh
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cảm ơn tất cả các cá nhân và đơn vị đã đóng góp cho chiến dịch
                    </p>
                </div>

                {/* Diamond Donors */}
                {diamonds.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center mb-6">
                            <span className="tier-badge tier-diamond text-lg px-4 py-2">
                                💎 Kim Cương ({diamonds.length})
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {diamonds.map((donation) => (
                                <DonationCard key={donation.id} donation={donation} featured />
                            ))}
                        </div>
                    </div>
                )}

                {/* Gold Donors */}
                {golds.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center mb-6">
                            <span className="tier-badge tier-gold text-lg px-4 py-2">
                                🥇 Vàng ({golds.length})
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {golds.map((donation) => (
                                <DonationCard key={donation.id} donation={donation} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Silver & Green Donors - Combined List */}
                {(silvers.length > 0 || greens.length > 0) && (
                    <div className="mb-8">
                        <h3 className="text-center mb-6">
                            <span className="tier-badge tier-silver text-base px-3 py-1 mr-2">
                                🥈 Bạc ({silvers.length})
                            </span>
                            <span className="tier-badge tier-green text-base px-3 py-1">
                                💚 Xanh ({greens.length})
                            </span>
                        </h3>

                        {/* Text List Format */}
                        <div className="glass-card p-6 max-w-4xl mx-auto">
                            <p className="text-gray-700 leading-relaxed text-center">
                                {[...silvers, ...greens].map((d, i) => (
                                    <span key={d.id}>
                                        <span className="font-medium hover:text-pink-600 transition-colors">
                                            {d.name}
                                        </span>
                                        {i < silvers.length + greens.length - 1 && (
                                            <span className="text-pink-400 mx-2">•</span>
                                        )}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                )}

                {/* Imprint & Entrust Donors - Danh Sách Ghi Danh */}
                {otherDonors.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-center mb-6">
                            <span className="bg-gradient-to-r from-pink-500 to-pink-400 text-white text-base px-4 py-2 rounded-full">
                                🌸 Danh Sách Ghi Danh ({otherDonors.length})
                            </span>
                        </h3>

                        {/* Grid of Names */}
                        <div className="glass-card p-6 max-w-5xl mx-auto">
                            <div className="flex flex-wrap justify-center gap-2">
                                {otherDonors.map((d) => (
                                    <span
                                        key={d.id}
                                        className="bg-pink-50 border border-pink-200 text-pink-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-pink-100 transition-colors"
                                    >
                                        🌸 {d.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Count */}
                <div className="text-center mt-12">
                    <p className="text-gray-500">
                        Tổng cộng <span className="font-bold text-pink-600">{donations.length}</span> người đã đóng góp
                    </p>
                </div>
            </div>
        </section>
    );
}

interface DonationCardProps {
    donation: Donation;
    featured?: boolean;
}

function DonationCard({ donation, featured }: DonationCardProps) {
    return (
        <div
            className={`
        glass-card p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${featured ? 'border-2 border-blue-200' : ''}
      `}
        >
            <div className="flex items-center gap-4">
                {/* Logo or Avatar */}
                <div className={`
          ${featured ? 'w-16 h-16' : 'w-12 h-12'} 
          rounded-full flex items-center justify-center text-white text-xl
          ${getTierColor(donation.tier || 'green')}
        `}>
                    {donation.logoUrl ? (
                        <img src={donation.logoUrl} alt={donation.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        donation.isOrganization ? '🏢' : '👤'
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-gray-800 truncate ${featured ? 'text-lg' : 'text-base'}`}>
                        {donation.name}
                    </h4>
                    {donation.treeCode && (
                        <p className="text-sm text-gray-500">
                            🌸 Cây {donation.treeCode}
                        </p>
                    )}
                    {featured && (
                        <p className="text-sm text-pink-600 font-medium">
                            {formatCurrency(donation.amount)}
                        </p>
                    )}
                </div>

                {/* Tier Badge */}
                <span className={`tier-badge tier-${donation.tier}`}>
                    {donation.tier === 'diamond' ? '💎' :
                        donation.tier === 'gold' ? '🥇' :
                            donation.tier === 'silver' ? '🥈' : '💚'}
                </span>
            </div>

            {/* Message */}
            {featured && donation.message && (
                <p className="mt-3 text-sm text-gray-600 italic line-clamp-2">
                    "{donation.message}"
                </p>
            )}
        </div>
    );
}
