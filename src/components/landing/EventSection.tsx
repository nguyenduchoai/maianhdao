'use client';

interface EventSectionProps {
    settings?: Record<string, string>;
}

export function EventSection({ settings = {} }: EventSectionProps) {
    return (
        <section id="event" className="py-16 bg-gradient-to-b from-white to-pink-50">
            <div className="container mx-auto px-4">

                {/* Lễ phát động */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="text-center mb-8">
                        <span className="text-5xl mb-4 block">🎉</span>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {settings.eventTitle || 'Lễ Phát Động & Ra Quân'}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-8 text-center">
                            <div className="text-lg opacity-90 mb-2">Thời gian</div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">{settings.eventTime || '07:30 Sáng, Thứ Năm'}</div>
                            <div className="text-2xl md:text-3xl font-heading">{settings.eventDate || 'Ngày 18 Tháng 01, 2026'}</div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-2xl">📍</span> Địa điểm
                                    </h4>
                                    <p className="text-gray-600">
                                        {settings.eventLocation || 'Khu vực bãi cỏ/công viên ven Hồ Xuân Hương thuộc địa bàn Phường'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-2xl">👥</span> Thành phần
                                    </h4>
                                    <p className="text-gray-600">
                                        {settings.eventParticipants || 'Lãnh đạo Tỉnh, Lãnh đạo Phường, Doanh nghiệp, Đại diện nhân dân'}
                                    </p>
                                </div>
                            </div>

                            <hr className="my-6" />

                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📋</span> Nội dung chương trình
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                                    <span className="text-pink-500 font-bold">1</span>
                                    <p className="text-gray-700">{settings.eventProgram1 || 'Báo cáo nhanh kết quả 10 ngày thần tốc'}</p>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                                    <span className="text-pink-500 font-bold">2</span>
                                    <p className="text-gray-700">{settings.eventProgram2 || 'Trao Giấy khen/Thư cảm ơn cho Doanh nghiệp "Kiến Tạo"'}</p>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                                    <span className="text-pink-500 font-bold">3</span>
                                    <p className="text-gray-700">{settings.eventProgram3 || 'Nghi thức trồng cây: Đại diện vun đất và treo biển tên'}</p>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                                    <span className="text-pink-500 font-bold">4</span>
                                    <p className="text-gray-700">{settings.eventProgram4 || 'Check-in quảng bá cùng cây của mình'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Minh bạch tài chính */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="text-5xl mb-4 block">📊</span>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Cơ Cấu Tài Chính
                        </h2>
                        <p className="text-lg text-gray-600">MINH BẠCH TUYỆT ĐỐI</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="text-sm text-gray-500 mb-2">Tổng thu dự kiến</div>
                            <div className="text-4xl font-bold text-pink-600">500.000.000 VNĐ</div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Chi phí cây giống */}
                            <div className="relative">
                                <div className="absolute -top-3 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    60%
                                </div>
                                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 pt-8">
                                    <div className="text-3xl mb-3">🌱</div>
                                    <h4 className="font-bold text-gray-800 mb-2">Chi Phí Cây Giống</h4>
                                    <div className="text-2xl font-bold text-green-600 mb-2">300 Triệu</div>
                                    <p className="text-sm text-gray-600">
                                        Mua 200 cây Mai Anh Đào trưởng thành đạt tiêu chuẩn "Cây Di sản"
                                    </p>
                                </div>
                            </div>

                            {/* Quỹ chăm sóc */}
                            <div className="relative">
                                <div className="absolute -top-3 left-4 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    30%
                                </div>
                                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 pt-8">
                                    <div className="text-3xl mb-3">🛡️</div>
                                    <h4 className="font-bold text-gray-800 mb-2">Quỹ Chăm Sóc Cây</h4>
                                    <div className="text-2xl font-bold text-blue-600 mb-2">150 Triệu</div>
                                    <p className="text-sm text-gray-600">
                                        Thuê Công ty Công trình Đô thị hoặc Đội cây xanh chuyên nghiệp chăm sóc trong 24 tháng
                                    </p>
                                </div>
                            </div>

                            {/* Chi phí tổ chức */}
                            <div className="relative">
                                <div className="absolute -top-3 left-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    10%
                                </div>
                                <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200 pt-8">
                                    <div className="text-3xl mb-3">🎨</div>
                                    <h4 className="font-bold text-gray-800 mb-2">Tổ Chức & Truyền Thông</h4>
                                    <div className="text-2xl font-bold text-pink-600 mb-2">50 Triệu</div>
                                    <p className="text-sm text-gray-600">
                                        Sản xuất biển tên, in huy hiệu, giấy khen, âm thanh, backdrop Lễ phát động
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
