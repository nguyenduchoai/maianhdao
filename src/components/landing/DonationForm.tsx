'use client';

import { useState } from 'react';
import { formatCurrency, getDonationTier, getTierLabel } from '@/lib/utils';
import QRCode from 'react-qr-code';

interface DonationFormProps {
    bankInfo: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    };
}

export function DonationForm({ bankInfo }: DonationFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        amount: 5000000,
        message: '',
        isOrganization: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const presetAmounts = [
        { value: 2000000, label: '2 triệu' },
        { value: 5000000, label: '5 triệu' },
        { value: 10000000, label: '10 triệu' },
        { value: 20000000, label: '20 triệu' },
        { value: 50000000, label: '50 triệu' },
    ];

    // Generate VietQR content
    const qrContent = `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact.png?amount=${formData.amount}&addInfo=${encodeURIComponent(`DON GOP MAI ANH DAO - ${formData.name || 'KHACH HANG'}`)}&accountName=${encodeURIComponent(bankInfo.accountHolder)}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting donation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section id="donate" className="py-20 bg-gradient-to-b from-white to-pink-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center glass-card p-8">
                        <div className="text-6xl mb-4">🌸</div>
                        <h3 className="font-heading text-3xl font-bold text-gray-800 mb-4">
                            Cảm Ơn Bạn!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Đóng góp của bạn đã được ghi nhận. Chúng tôi sẽ xác nhận sau khi nhận được thanh toán.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="btn-primary"
                        >
                            Đóng Góp Thêm
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="donate" className="py-20 bg-gradient-to-b from-white to-pink-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        💝 Đóng Góp Ngay
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Quét mã QR để đóng góp và được ghi danh trên bản đồ Mai Anh Đào
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Form */}
                    <div className="glass-card p-6 md:p-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông tin đóng góp</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên cá nhân / đơn vị *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            {/* Organization Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isOrganization}
                                    onChange={(e) => setFormData({ ...formData, isOrganization: e.target.checked })}
                                    className="w-4 h-4 rounded text-pink-600"
                                />
                                <span className="text-sm text-gray-600">Đây là đơn vị / doanh nghiệp</span>
                            </label>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="0912345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            {/* Amount Presets */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số tiền đóng góp *
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                                    {presetAmounts.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, amount: preset.value })}
                                            className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-all
                        ${formData.amount === preset.value
                                                    ? 'bg-pink-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    required
                                    min={100000}
                                    step={100000}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatCurrency(formData.amount)} - {getTierLabel(getDonationTier(formData.amount))}
                                </p>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lời nhắn (không bắt buộc)
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Chúc chiến dịch thành công..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Thông Tin'}
                            </button>
                        </form>
                    </div>

                    {/* QR Code */}
                    <div className="glass-card p-6 md:p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quét mã QR để thanh toán</h3>

                        <div className="qr-container inline-block mb-6">
                            <QRCode
                                value={qrContent}
                                size={200}
                                level="M"
                            />
                        </div>

                        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Ngân hàng:</span> {bankInfo.bankName}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Số tài khoản:</span> {bankInfo.accountNumber}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Chủ tài khoản:</span> {bankInfo.accountHolder}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Số tiền:</span> {formatCurrency(formData.amount)}
                            </p>
                        </div>

                        <p className="text-sm text-gray-500">
                            Nội dung chuyển khoản: <br />
                            <code className="bg-pink-100 px-2 py-1 rounded text-pink-700">
                                DON GOP MAI ANH DAO - {formData.name || 'TEN CUA BAN'}
                            </code>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
