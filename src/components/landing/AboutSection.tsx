'use client';

export function AboutSection() {
    return (
        <section id="about" className="py-16 bg-gradient-to-b from-pink-50 to-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-5xl mb-4 block">🌸</span>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Về Chiến Dịch
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Xã hội hóa cảnh quan & Gây quỹ cộng đồng – Ngàn Cây Anh Đào quanh Hồ Xuân Hương
                    </p>
                </div>

                {/* Căn cứ và tính cấp thiết */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-pink-500">
                        <h3 className="font-heading text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <span className="text-3xl">📋</span> Căn Cứ & Tính Cấp Thiết
                        </h3>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex gap-4">
                                <span className="text-pink-500 font-bold text-lg">1.</span>
                                <div>
                                    <strong className="text-gray-800">Vị thế địa lý:</strong> Hồ Xuân Hương là <em>"trái tim"</em> của Đà Lạt.
                                    Cảnh quan quanh hồ quyết định trực tiếp đến ấn tượng của du khách và niềm tự hào của người dân địa phương.
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-pink-500 font-bold text-lg">2.</span>
                                <div>
                                    <strong className="text-gray-800">Thực trạng:</strong> Mật độ Mai Anh Đào quanh hồ hiện nay chưa đồng bộ,
                                    một số cây già cỗi hoặc bị sâu bệnh. Việc bổ sung những cây Mai Anh Đào trưởng thành, tán đẹp là
                                    <strong className="text-pink-600"> nhu cầu cấp thiết</strong> để chỉnh trang đô thị đón Tết.
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-pink-500 font-bold text-lg">3.</span>
                                <div>
                                    <strong className="text-gray-800">Cơ hội:</strong> Với tâm lý hướng về nguồn cội dịp Tết,
                                    người dân và doanh nghiệp rất sẵn lòng đóng góp nếu họ được <em>"ghi danh"</em> tại địa điểm danh giá nhất thành phố.
                                    Đây là cơ sở để thực hiện chiến dịch <strong className="text-pink-600">xã hội hóa 100%</strong>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mục tiêu đề án */}
                <div className="max-w-5xl mx-auto mb-16">
                    <h3 className="font-heading text-2xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
                        <span className="text-3xl">🎯</span> Mục Tiêu Đề Án (10 Ngày Cao Điểm)
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Mục tiêu tài chính */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-md">
                            <div className="text-4xl mb-4">💰</div>
                            <h4 className="font-bold text-lg text-gray-800 mb-3">Mục Tiêu Tài Chính</h4>
                            <div className="space-y-2 text-gray-700">
                                <p><strong className="text-green-600 text-xl">500.000.000 VNĐ</strong></p>
                                <p className="text-sm">(Năm trăm triệu đồng)</p>
                                <p className="text-sm mt-2"><strong>Thời gian:</strong> 05/01 - 15/01/2026</p>
                            </div>
                        </div>

                        {/* Mục tiêu hiện vật */}
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-md">
                            <div className="text-4xl mb-4">🌸</div>
                            <h4 className="font-bold text-lg text-gray-800 mb-3">Mục Tiêu Hiện Vật</h4>
                            <div className="space-y-2 text-gray-700">
                                <p><strong className="text-pink-600 text-xl">200 Cây</strong> Mai Anh Đào</p>
                                <p className="text-sm">Tiêu chuẩn "Cây Di sản":</p>
                                <ul className="text-sm list-disc list-inside">
                                    <li>Cao &gt;3m</li>
                                    <li>Đường kính gốc &gt;10cm</li>
                                    <li>Dáng đẹp, tán đều</li>
                                </ul>
                            </div>
                        </div>

                        {/* Cam kết đặc biệt */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-md">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h4 className="font-bold text-lg text-gray-800 mb-3">Cam Kết Đặc Biệt</h4>
                            <div className="space-y-2 text-gray-700 text-sm">
                                <p><strong className="text-blue-600">100% ngân sách dư</strong> được đưa vào <em>"Quỹ Bảo Dưỡng Xanh"</em></p>
                                <p>Thuê nhân sự chuyên nghiệp chăm sóc trong <strong>24 tháng</strong></p>
                                <p className="text-blue-600 font-medium">Đảm bảo cây sống và ra hoa!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mục tiêu lan tỏa */}
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
                    <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-3">
                        <span className="text-3xl">📣</span> Mục Tiêu Lan Tỏa
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">✅</span>
                            <p>100% Tổ dân phố, Trường học, Doanh nghiệp trên địa bàn Phường nhận được thông tin vận động</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📸</span>
                            <p>Tạo làn sóng <strong>"Check-in với cây của mình"</strong> ngay trong dịp Tết Nguyên Đán</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
