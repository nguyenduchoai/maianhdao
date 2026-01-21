'use client';

interface FooterProps {
    settings?: Record<string, string>;
}

export function Footer({ settings = {} }: FooterProps) {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="font-heading text-2xl font-bold text-pink-400 mb-4">
                            🌸 {settings.siteName || 'NGÀN CÂY ANH ĐÀO'}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {settings.footerAbout || 'Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào quanh Hồ Xuân Hương và các khu vực trọng điểm của Đà Lạt - Thành phố ngàn hoa.'}
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{settings.footerContactTitle || 'Liên Hệ'}</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{settings.footerAddress || 'Chi hội DNT Phường Xuân Hương - Đà Lạt'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📞</span>
                                <span>{settings.footerPhone || '0935.956.421 (Anh Nghĩa)'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>✉️</span>
                                <span>{settings.footerEmail || 'maianhdao@lamdong.vn'}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{settings.footerLinksTitle || 'Liên Kết'}</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#map" className="hover:text-pink-400 transition-colors">
                                    {settings.footerLinkMap || 'Bản đồ cây'}
                                </a>
                            </li>
                            <li>
                                <a href="#donate" className="hover:text-pink-400 transition-colors">
                                    {settings.footerLinkDonate || 'Đóng góp'}
                                </a>
                            </li>
                            <li>
                                <a href="#sponsors" className="hover:text-pink-400 transition-colors">
                                    {settings.footerLinkSponsors || 'Nhà tài trợ'}
                                </a>
                            </li>
                            <li>
                                <a href="#donors" className="hover:text-pink-400 transition-colors">
                                    {settings.footerLinkDonors || 'Danh sách ghi danh'}
                                </a>
                            </li>
                            <li>
                                <a href="/thu-vien-anh" className="hover:text-pink-400 transition-colors">
                                    🖼️ Thư viện ảnh
                                </a>
                            </li>
                            <li>
                                <a href="/minh-bach-tai-chinh" className="hover:text-pink-400 transition-colors">
                                    📊 Minh bạch tài chính
                                </a>
                            </li>
                            <li>
                                <a href="/admin" className="hover:text-pink-400 transition-colors">
                                    Quản trị
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Campaign Info */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">
                            <strong>Thời gian chiến dịch:</strong> {settings.footerCampaignTime || '05/01/2026 - 15/01/2026 (10 ngày cao điểm)'}
                        </p>
                        <p className="text-gray-400 text-sm">
                            <strong>Mục tiêu:</strong> {settings.footerCampaignGoal || '500.000.000 VNĐ | Ngàn cây hoa Anh Đào cho Đà Lạt'}
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
                    <p>
                        {settings.footerCopyright || '© 2026 Chiến dịch NGÀN CÂY ANH ĐÀO - Hội DNT tỉnh Lâm Đồng.'}{' '}
                        Được phát triển bởi <a href="https://bizino.ai" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Bizino</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
