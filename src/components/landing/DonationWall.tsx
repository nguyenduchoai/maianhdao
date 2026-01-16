'use client';

import { formatCurrency } from '@/lib/utils';
import { Donation } from '@/types';

interface DonationWallProps {
    donations: Donation[];
}

export function DonationWall({ donations }: DonationWallProps) {
    // Group donations by the 4 tiers
    const kientao = donations.filter(d => d.tier === 'kientao' || d.tier === 'diamond' || (d.amount && d.amount >= 5000000));
    const dauun = donations.filter(d => d.tier === 'dauun' || d.tier === 'gold' || (d.amount && d.amount >= 1000000 && d.amount < 5000000));
    const guitrao = donations.filter(d => d.tier === 'guitrao' || d.tier === 'silver' || (d.amount && d.amount >= 200000 && d.amount < 1000000));
    const gieomam = donations.filter(d =>
        d.tier === 'gieomam' || d.tier === 'green' || d.tier === 'imprint' || d.tier === 'entrust' ||
        (d.amount && d.amount < 200000) ||
        !d.tier
    );

    // Remove duplicates
    const usedIds = new Set([...kientao, ...dauun, ...guitrao].map(d => d.id));
    const filteredGieomam = gieomam.filter(d => !usedIds.has(d.id));

    return (
        <section id="donors" className="py-20 bg-gradient-to-b from-pink-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        🌸 Bảng Vinh Danh
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cảm ơn tất cả các cá nhân và đơn vị đã đóng góp cho chiến dịch
                    </p>
                </div>

                {/* KIẾN TẠO - Cao nhất, size lớn nhất */}
                {kientao.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-center mb-8">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-2xl shadow-lg">
                                🏆 KIẾN TẠO ({kientao.length})
                            </span>
                            <p className="text-amber-600 mt-2 text-sm">5.000.000đ - 10.000.000đ | Doanh nghiệp, Khách sạn, Nhà hàng</p>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {kientao.map((donation) => (
                                <div
                                    key={donation.id}
                                    className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-4xl shadow-lg">
                                            {donation.logoUrl ? (
                                                <img src={donation.logoUrl} alt={donation.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                donation.isOrganization ? '🏢' : '👤'
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-2xl text-gray-800 mb-1">{donation.name}</h4>
                                            {donation.treeCode && (
                                                <p className="text-amber-600 font-medium">🌸 Cây {donation.treeCode}</p>
                                            )}
                                            <p className="text-lg font-bold text-amber-600 mt-2">
                                                {formatCurrency(donation.amount)}
                                            </p>
                                        </div>
                                        <span className="text-4xl">🏆</span>
                                    </div>
                                    {donation.message && (
                                        <p className="mt-4 text-gray-600 italic border-t border-amber-200 pt-4">
                                            "{donation.message}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DẤU ẤN - Size lớn */}
                {dauun.length > 0 && (
                    <div className="mb-14">
                        <h3 className="text-center mb-6">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg md:text-xl font-bold px-6 py-3 rounded-xl shadow-md">
                                🌸 DẤU ẤN ({dauun.length})
                            </span>
                            <p className="text-pink-600 mt-2 text-sm">1.000.000đ - 2.000.000đ | Hộ gia đình, Nhóm bạn bè</p>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                            {dauun.map((donation) => (
                                <div
                                    key={donation.id}
                                    className="bg-white border-2 border-pink-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-2xl text-white shadow">
                                            {donation.logoUrl ? (
                                                <img src={donation.logoUrl} alt={donation.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                donation.isOrganization ? '🏢' : '👤'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-lg text-gray-800 truncate">{donation.name}</h4>
                                            {donation.treeCode && (
                                                <p className="text-pink-600 text-sm">🌸 Cây {donation.treeCode}</p>
                                            )}
                                            <p className="text-pink-600 font-medium text-sm mt-1">
                                                {formatCurrency(donation.amount)}
                                            </p>
                                        </div>
                                        <span className="text-2xl">🌸</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GỬI TRAO - Size trung bình */}
                {guitrao.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center mb-6">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-base md:text-lg font-bold px-5 py-2.5 rounded-lg shadow">
                                💝 GỬI TRAO ({guitrao.length})
                            </span>
                            <p className="text-blue-600 mt-2 text-sm">200.000đ - 500.000đ | Nhân viên văn phòng, Du khách yêu Đà Lạt</p>
                        </h3>
                        <div className="glass-card p-6 max-w-5xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {guitrao.map((donation) => (
                                    <div
                                        key={donation.id}
                                        className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="text-2xl mb-1">💝</div>
                                        <h4 className="font-semibold text-gray-800 text-sm truncate">{donation.name}</h4>
                                        {donation.treeCode && (
                                            <p className="text-blue-600 text-xs">Cây {donation.treeCode}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* GIEO MẦM - Size nhỏ nhất */}
                {filteredGieomam.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-center mb-6">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-white text-sm md:text-base font-bold px-4 py-2 rounded-lg">
                                🌱 GIEO MẦM ({filteredGieomam.length})
                            </span>
                            <p className="text-green-600 mt-2 text-xs">50.000đ - 100.000đ | Mọi người dân</p>
                        </h3>

                        <div className="glass-card p-6 max-w-4xl mx-auto">
                            <div className="flex flex-wrap justify-center gap-2">
                                {filteredGieomam.map((d) => (
                                    <span
                                        key={d.id}
                                        className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
                                    >
                                        🌱 {d.name}
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
