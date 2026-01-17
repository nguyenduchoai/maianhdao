'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Donation } from '@/types';

interface DonationWallProps {
    donations: Donation[];
    settings?: Record<string, string>;
}

export function DonationWall({ donations, settings = {} }: DonationWallProps) {
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

    // Group donations by the 4 tiers - prioritize tier field over amount
    const kientao = donations.filter(d =>
        d.tier === 'kientao' || d.tier === 'diamond' ||
        (!d.tier && d.amount && d.amount >= 5000000)
    );
    const dauun = donations.filter(d =>
        d.tier === 'dauun' || d.tier === 'gold' ||
        (!d.tier && d.amount && d.amount >= 1000000 && d.amount < 5000000)
    );
    const guitrao = donations.filter(d =>
        d.tier === 'guitrao' || d.tier === 'silver' ||
        (!d.tier && d.amount && d.amount >= 200000 && d.amount < 1000000)
    );
    const gieomam = donations.filter(d =>
        d.tier === 'gieomam' || d.tier === 'green' || d.tier === 'imprint' || d.tier === 'entrust' ||
        (!d.tier && (!d.amount || d.amount < 200000))
    );

    // Remove duplicates
    const usedIds = new Set([...kientao, ...dauun, ...guitrao].map(d => d.id));
    const filteredGieomam = gieomam.filter(d => !usedIds.has(d.id));

    return (
        <section id="donors" className="py-20 bg-gradient-to-b from-pink-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        {settings.donorsTitle || '🌸 Bảng Vinh Danh'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {settings.donorsSubtitle || 'Cảm ơn tất cả các cá nhân và đơn vị đã đóng góp cho chiến dịch'}
                    </p>
                </div>

                {/* KIẾN TẠO - 5 columns, square logo */}
                {kientao.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-center mb-8">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-2xl shadow-lg">
                                🏆 KIẾN TẠO ({kientao.length})
                            </span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                            {kientao.map((donation) => (
                                <div
                                    key={donation.id}
                                    onClick={() => setSelectedDonation(donation)}
                                    className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center"
                                >
                                    {/* Logo - no background if has image */}
                                    <div className="w-20 h-16 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                                        {donation.logoUrl ? (
                                            <img src={donation.logoUrl} alt={donation.name} className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-2xl shadow-md">
                                                {donation.isOrganization ? '🏢' : '👤'}
                                            </div>
                                        )}
                                    </div>
                                    {/* Name - single line */}
                                    <h4 className="font-bold text-sm text-gray-800 truncate" title={donation.name}>{donation.name}</h4>
                                    {donation.treeCode && (
                                        <p className="text-amber-600 text-xs mt-1">🌸 Cây {donation.treeCode}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DẤU ẤN - Chỉ tên, không logo/emoji ngoài */}
                {dauun.length > 0 && (
                    <div className="mb-14">
                        <h3 className="text-center mb-6">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg md:text-xl font-bold px-6 py-3 rounded-xl shadow-md">
                                🌸 DẤU ẤN ({dauun.length})
                            </span>
                        </h3>
                        <div className="glass-card p-6 max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {dauun.map((donation) => (
                                    <button
                                        key={donation.id}
                                        onClick={() => setSelectedDonation(donation)}
                                        className="bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg p-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <h4 className="font-semibold text-gray-800 text-sm leading-tight">{donation.name}</h4>
                                        {donation.treeCode && (
                                            <p className="text-pink-600 text-xs mt-1">Cây {donation.treeCode}</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* GỬI TRAO - Chỉ tên, không emoji */}
                {guitrao.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center mb-6">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-base md:text-lg font-bold px-5 py-2.5 rounded-lg shadow">
                                💝 GỬI TRAO ({guitrao.length})
                            </span>
                        </h3>
                        <div className="glass-card p-6 max-w-5xl mx-auto">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                                {guitrao.map((donation) => (
                                    <button
                                        key={donation.id}
                                        onClick={() => setSelectedDonation(donation)}
                                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-center transition-colors"
                                    >
                                        <h4 className="font-medium text-gray-800 text-xs leading-tight">{donation.name}</h4>
                                    </button>
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
                        </h3>

                        <div className="glass-card p-6 max-w-4xl mx-auto">
                            <div className="flex flex-wrap justify-center gap-2">
                                {filteredGieomam.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setSelectedDonation(d)}
                                        className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
                                    >
                                        {d.name}
                                    </button>
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

            {/* Popup Modal */}
            {selectedDonation && (
                <div
                    className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
                    onClick={() => setSelectedDonation(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🌸</span>
                                <div>
                                    <h3 className="font-bold text-lg">Thông tin đóng góp</h3>
                                    {selectedDonation.treeCode && (
                                        <p className="text-pink-100 text-sm">Cây {selectedDonation.treeCode}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDonation(null)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Donor Info */}
                            <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-pink-50 to-white rounded-xl border border-pink-100">
                                {selectedDonation.logoUrl ? (
                                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-pink-200 flex items-center justify-center overflow-hidden shadow-sm">
                                        <img
                                            src={selectedDonation.logoUrl}
                                            alt={selectedDonation.name}
                                            className="w-14 h-14 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-pink-100 flex items-center justify-center text-3xl border-2 border-pink-200">
                                        {selectedDonation.isOrganization ? '🏢' : '👤'}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">{selectedDonation.name}</h3>
                                </div>
                            </div>

                            {/* Message */}
                            {selectedDonation.message && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">💬</span>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Ghi chú:</p>
                                            <p className="text-gray-700">{selectedDonation.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>📅</span>
                                    <span>Thời gian trồng: 18/01/2026</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>📍</span>
                                    <span>Đảo Mai Anh Đào, Hồ Xuân Hương, Đà Lạt</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                {selectedDonation.treeCode && (
                                    <a
                                        href={`/map/tree-${selectedDonation.treeCode.toLowerCase()}`}
                                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
                                    >
                                        🗺️ Xem trên bản đồ
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedDonation(null)}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
