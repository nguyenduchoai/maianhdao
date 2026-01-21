'use client';

import { useState } from 'react';
import { formatCurrency, getDonationTier, getTierLabel } from '@/lib/utils';
import { Tree } from '@/types';
import { TreePickerModal } from './TreePickerModal';

interface DonationFormProps {
    bankInfo: {
        bankName: string;
        bankBin: string; // VietQR BIN code (e.g., 970426 for MSB)
        accountNumber: string;
        accountHolder: string;
    };
}

// Remove Vietnamese diacritics
function removeVietnameseDiacritics(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .toUpperCase();
}

export function DonationForm({ bankInfo }: DonationFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        amount: 5000000,
        message: '',
        isOrganization: false,
        logoUrl: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    
    // Tree selection for organizations
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [showTreePicker, setShowTreePicker] = useState(false);

    const presetAmounts = [
        { value: 2000000, label: '2 triệu' },
        { value: 5000000, label: '5 triệu' },
        { value: 10000000, label: '10 triệu' },
        { value: 20000000, label: '20 triệu' },
        { value: 50000000, label: '50 triệu' },
    ];

    // Generate transfer content (no diacritics)
    const transferContent = removeVietnameseDiacritics(
        `MAI ANH DAO ${formData.name}${formData.message ? ' ' + formData.message : ''}`
    ).slice(0, 50);

    // Generate VietQR Quick Link (Official API)
    // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
    // BANK_ID can be: BIN code (970426) OR shortName (MSB) OR code (MSB)
    const qrContent = `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact2.png?amount=${formData.amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountHolder)}`;

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingLogo(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('type', 'donors');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.url) {
                setFormData({ ...formData, logoUrl: data.url });
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Vui lòng nhập tên!');
            return;
        }
        setIsConfirmed(true);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    logo_url: formData.logoUrl,
                    // Include selected tree for organizations
                    selected_tree_id: selectedTree?.id || null,
                }),
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
                            onClick={() => {
                                setSubmitted(false);
                                setIsConfirmed(false);
                                setSelectedTree(null);
                                setFormData({
                                    name: '',
                                    phone: '',
                                    email: '',
                                    amount: 5000000,
                                    message: '',
                                    isOrganization: false,
                                    logoUrl: '',
                                });
                            }}
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

                        <form onSubmit={handleConfirm} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên cá nhân / đơn vị *
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={isConfirmed}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            {/* Organization Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    disabled={isConfirmed}
                                    checked={formData.isOrganization}
                                    onChange={(e) => {
                                        setFormData({ ...formData, isOrganization: e.target.checked });
                                        if (!e.target.checked) {
                                            setSelectedTree(null); // Clear tree selection when unchecked
                                        }
                                    }}
                                    className="w-4 h-4 rounded text-pink-600"
                                />
                                <span className="text-sm text-gray-600">Đây là đơn vị / doanh nghiệp</span>
                            </label>

                            {/* Tree Selection for Organizations */}
                            {formData.isOrganization && (
                                <div className="p-4 bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200 rounded-xl">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                🌳 Chọn vị trí cây (tùy chọn)
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Doanh nghiệp có thể chọn trước vị trí cây muốn sở hữu
                                            </p>
                                        </div>
                                        {selectedTree ? (
                                            <div className="flex items-center gap-2">
                                                <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 flex items-center gap-2">
                                                    <span className="text-green-600">✓</span>
                                                    <span className="font-bold text-green-700">{selectedTree.code}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={isConfirmed}
                                                    onClick={() => setShowTreePicker(true)}
                                                    className="text-pink-600 hover:text-pink-700 text-sm font-medium disabled:opacity-50"
                                                >
                                                    Đổi
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={isConfirmed}
                                                onClick={() => setShowTreePicker(true)}
                                                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <span>🗺️</span>
                                                <span>Chọn vị trí cây</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo / Ảnh đại diện (không bắt buộc)
                                </label>
                                <div className="flex items-center gap-4">
                                    {formData.logoUrl ? (
                                        <div className="relative">
                                            <img
                                                src={formData.logoUrl}
                                                alt="Logo"
                                                className="w-16 h-16 object-cover rounded-lg border"
                                            />
                                            {!isConfirmed && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <label className={`flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {uploadingLogo ? (
                                                <span className="animate-spin">⏳</span>
                                            ) : (
                                                <>
                                                    <span>📷</span>
                                                    <span className="text-sm">Tải ảnh lên</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={isConfirmed || uploadingLogo}
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Phone & Email - Stack on mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        disabled={isConfirmed}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 text-base"
                                        placeholder="0912345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        disabled={isConfirmed}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 text-base"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            {/* Amount Presets */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số tiền đóng góp *
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                                    {presetAmounts.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            disabled={isConfirmed}
                                            onClick={() => setFormData({ ...formData, amount: preset.value })}
                                            className={`
                                                py-2 px-3 rounded-lg text-sm font-medium transition-all
                                                ${formData.amount === preset.value
                                                    ? 'bg-pink-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                                ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}
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
                                    disabled={isConfirmed}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 text-base"
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
                                    disabled={isConfirmed}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                                    placeholder="Chúc chiến dịch thành công..."
                                />
                            </div>

                            {!isConfirmed ? (
                                <button
                                    type="submit"
                                    className="w-full btn-primary py-3 text-lg"
                                >
                                    Xác Nhận Thông Tin
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmed(false)}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg text-lg"
                                >
                                    ✏️ Sửa thông tin
                                </button>
                            )}
                        </form>
                    </div>

                    {/* QR Code - Only show after confirmed */}
                    <div className="glass-card p-6 md:p-8 text-center">
                        {!isConfirmed ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <div className="text-6xl mb-4">📋</div>
                                <p className="text-lg">Vui lòng điền thông tin và nhấn<br /><strong>"Xác Nhận Thông Tin"</strong><br />để hiển thị mã QR thanh toán</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Quét mã QR để thanh toán</h3>

                                <div className="qr-container inline-block mb-6 bg-white p-2 rounded-lg shadow-md">
                                    <img 
                                        src={qrContent} 
                                        alt="VietQR Payment" 
                                        width={220}
                                        height={220}
                                        className="rounded"
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

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-2">Nội dung chuyển khoản:</p>
                                    <code className="block bg-pink-100 px-3 py-2 rounded text-pink-700 font-mono text-sm">
                                        {transferContent}
                                    </code>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-3 text-lg disabled:opacity-50"
                                >
                                    {isSubmitting ? '⏳ Đang gửi...' : '✅ Tôi Đã Chuyển Khoản'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tree Picker Modal for Organizations */}
            <TreePickerModal
                isOpen={showTreePicker}
                onClose={() => setShowTreePicker(false)}
                onSelect={(tree) => {
                    setSelectedTree(tree);
                    setShowTreePicker(false);
                }}
                selectedTreeId={selectedTree?.id}
            />
        </section>
    );
}
