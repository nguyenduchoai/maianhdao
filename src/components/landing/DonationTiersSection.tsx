'use client';

interface DonationTiersSectionProps {
    settings?: Record<string, string>;
}

export function DonationTiersSection({ settings = {} }: DonationTiersSectionProps) {
    const tiers = [
        {
            level: 1,
            name: settings.tier1Name || 'GIEO MẦM',
            range: settings.tier1Range || '50.000đ - 100.000đ',
            emoji: '🌱',
            color: 'from-green-400 to-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-300',
            target: settings.tierGieomamDesc || 'Mọi người dân',
            benefits: [
                settings.tier1Benefit1 || 'Ghi danh trên "Bức tường Hoa Anh Đào Digital" (Website/Fanpage)',
                settings.tier1Benefit2 || 'Nhận Thiệp cảm ơn điện tử (E-Card)'
            ].filter(Boolean)
        },
        {
            level: 2,
            name: settings.tier2Name || 'GỬI TRAO',
            range: settings.tier2Range || '200.000đ - 500.000đ',
            emoji: '💝',
            color: 'from-blue-400 to-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300',
            target: settings.tierGuitraoDesc || 'Nhân viên văn phòng, Du khách yêu Đà Lạt',
            benefits: [
                settings.tier2Benefit1 || 'Bộ Postcard độc quyền "Hồ Xuân Hương Mùa Xuân"',
                settings.tier2Benefit2 || 'Huy hiệu Lễ hội (Limited Edition)',
                settings.tier2Benefit3 || 'Giấy chứng nhận đóng góp điện tử (E-Certificate)'
            ].filter(Boolean)
        },
        {
            level: 3,
            name: settings.tier3Name || 'DẤU ẤN',
            range: settings.tier3Range || '1.000.000đ - 2.000.000đ',
            emoji: '🌸',
            color: 'from-pink-400 to-pink-500',
            textColor: 'text-pink-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-400',
            target: settings.tierDauunDesc || 'Hộ gia đình, Nhóm bạn bè',
            hot: true,
            benefits: [
                settings.tier3Benefit1 || '🏷️ Treo biển gỗ khắc tên (Tagname) lên cây trồng',
                settings.tier3Benefit2 || 'Thông điệp tùy chọn: "Cây của Gia đình...", "Kỷ niệm ngày cưới..."',
                settings.tier3Benefit3 || '🎁 Sở hữu một "kỷ vật sống" ngay tại Hồ Xuân Hương'
            ].filter(Boolean)
        },
        {
            level: 4,
            name: settings.tier4Name || 'KIẾN TẠO',
            range: settings.tier4Range || '5.000.000đ - 10.000.000đ',
            emoji: '🏆',
            color: 'from-yellow-400 to-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-400',
            target: settings.tierKientaoDesc || 'Doanh nghiệp, Khách sạn, Nhà hàng',
            benefits: [
                settings.tier4Benefit1 || '🏢 Biển tên Doanh nghiệp (kích thước quy chuẩn, thẩm mỹ) gắn tại cây',
                settings.tier4Benefit2 || '📺 Vinh danh Logo trang trọng trên Backdrop Lễ phát động (Ngày 15/1)',
                settings.tier4Benefit3 || '📜 UBND Phường trao tặng Giấy khen/Thư cảm ơn',
                settings.tier4Benefit4 || '✅ Có giá trị làm hồ sơ năng lực/thương hiệu'
            ].filter(Boolean)
        }
    ];

    return (
        <section id="tiers" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-5xl mb-4 block">💎</span>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {settings.tiersTitle || 'Chiến Lược Gây Quỹ: "Để Lại Di Sản"'}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {settings.tiersSubtitle || 'Vì địa điểm là Hồ Xuân Hương, giá trị các gói đóng góp được định vị ở mức cao cấp và trang trọng'}
                    </p>
                </div>

                {/* Donation Tiers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.level}
                            className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${tier.borderColor} ${tier.bgColor}`}
                        >
                            {/* Hot badge */}
                            {tier.hot && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                    HOT 🔥
                                </div>
                            )}

                            {/* Header */}
                            <div className={`bg-gradient-to-r ${tier.color} text-white p-6 text-center`}>
                                <div className="text-5xl mb-3">{tier.emoji}</div>
                                <div className="text-sm opacity-90 mb-1">{settings.tierLevelLabel || 'Mức'} {tier.level}</div>
                                <h3 className="font-heading text-2xl font-bold">{tier.name}</h3>
                            </div>

                            {/* Price */}
                            <div className="p-6 text-center border-b border-gray-100">
                                <div className={`text-xl font-bold ${tier.textColor}`}>{tier.range}</div>
                                <div className="text-sm text-gray-500 mt-1">{tier.target}</div>
                            </div>

                            {/* Benefits */}
                            <div className="p-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">{settings.tierBenefitsLabel || 'Quyền lợi'}:</p>
                                <ul className="space-y-2">
                                    {tier.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-pink-500 mt-0.5">✓</span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="p-6 pt-0">
                                <a
                                    href="#donate"
                                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${tier.color} text-white hover:opacity-90 hover:shadow-md`}
                                >
                                    {settings.tierCTAButton || 'Đóng Góp Ngay'}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
