'use client';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="font-heading text-2xl font-bold text-pink-400 mb-4">
                            🌸 Đảo Mai Anh Đào
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Dự án xã hội hóa cảnh quan và gây quỹ cộng đồng để trồng 200 cây Mai Anh Đào
                            trưởng thành tại Hồ Xuân Hương - trái tim thành phố Đà Lạt.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Liên Hệ</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                                <span>📍</span>
                                <span>Đảng ủy - UBND Phường Xuân Huong, Đà Lạt</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📞</span>
                                <span>0263.XXX.XXXX</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>✉️</span>
                                <span>maianhdao@lamdong.vn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Liên Kết</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#map" className="hover:text-pink-400 transition-colors">
                                    Bản đồ cây
                                </a>
                            </li>
                            <li>
                                <a href="#donate" className="hover:text-pink-400 transition-colors">
                                    Đóng góp
                                </a>
                            </li>
                            <li>
                                <a href="#sponsors" className="hover:text-pink-400 transition-colors">
                                    Nhà tài trợ
                                </a>
                            </li>
                            <li>
                                <a href="#donors" className="hover:text-pink-400 transition-colors">
                                    Danh sách ghi danh
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
                            <strong>Thời gian chiến dịch:</strong> 05/01/2026 - 15/01/2026 (10 ngày cao điểm)
                        </p>
                        <p className="text-gray-400 text-sm">
                            <strong>Mục tiêu:</strong> 500.000.000 VNĐ | 200 cây Mai Anh Đào trưởng thành
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
                    <p>
                        © 2026 Đảo Mai Anh Đào - Hồ Xuân Hương, Đà Lạt.
                        Được phát triển bởi <a href="https://bizino.vn" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Bizino</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
