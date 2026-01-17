'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Expense {
    id: string;
    date: string;
    title: string;
    category: string;
    amount: number;
    hasInvoice: boolean;
    invoice_url?: string;
}

interface FinanceData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    expenseRatio: string;
    incomeCount: number;
    expenseCount: number;
    expenses: Expense[];
}

const categoryLabels: Record<string, string> = {
    event: '🎪 Sự kiện',
    tree: '🌸 Cây giống',
    labor: '👷 Nhân công',
    transport: '🚚 Vận chuyển',
    marketing: '📢 Marketing',
    admin: '📋 Hành chính',
    other: '📦 Khác',
};

export default function FinanceTransparencyPage() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/finance');
            const result = await res.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching finance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
                <p className="text-gray-600">Không có dữ liệu</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🌸</span>
                        <span className="font-heading font-bold text-xl text-gray-800">Mai Anh Đào</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-pink-600">Trang chủ</Link>
                        <Link href="/minh-bach-tai-chinh" className="text-pink-600 font-medium">Minh bạch tài chính</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        📊 Minh Bạch Tài Chính
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tất cả đóng góp và chi tiêu của chiến dịch <strong>NGÀN CÂY ANH ĐÀO</strong> được công khai minh bạch
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-sm opacity-80 mb-1">💰 Tổng thu</div>
                        <div className="text-3xl font-bold">{formatCurrency(data.totalIncome)}</div>
                        <div className="text-sm opacity-70 mt-2">{data.incomeCount} lượt đóng góp</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-sm opacity-80 mb-1">💸 Tổng chi</div>
                        <div className="text-3xl font-bold">{formatCurrency(data.totalExpense)}</div>
                        <div className="text-sm opacity-70 mt-2">{data.expenseCount} khoản chi</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-sm opacity-80 mb-1">💵 Số dư</div>
                        <div className="text-3xl font-bold">{formatCurrency(data.balance)}</div>
                        <div className="text-sm opacity-70 mt-2">Thu - Chi</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="text-sm opacity-80 mb-1">📈 Tỷ lệ chi</div>
                        <div className="text-3xl font-bold">{data.expenseRatio}%</div>
                        <div className="text-sm opacity-70 mt-2">Chi / Thu</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">📊 Biểu đồ Thu Chi</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-green-600 font-medium">Tổng thu</span>
                                <span className="font-bold">{formatCurrency(data.totalIncome)}</span>
                            </div>
                            <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-red-600 font-medium">Tổng chi</span>
                                <span className="font-bold">{formatCurrency(data.totalExpense)}</span>
                            </div>
                            <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                                    style={{ width: `${Math.min(100, parseFloat(data.expenseRatio))}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-blue-600 font-medium">Số dư</span>
                                <span className="font-bold">{formatCurrency(data.balance)}</span>
                            </div>
                            <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                    style={{ width: `${data.totalIncome > 0 ? ((data.balance / data.totalIncome) * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">📝 Danh sách chi tiêu</h2>

                    {data.expenses.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Chưa có khoản chi nào</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nội dung</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Danh mục</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Số tiền</th>
                                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Hóa đơn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.expenses.map((expense) => (
                                        <tr key={expense.id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(expense.date).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-medium text-gray-800">{expense.title}</span>
                                            </td>
                                            <td className="py-4 px-4 text-sm">
                                                {categoryLabels[expense.category] || expense.category}
                                            </td>
                                            <td className="py-4 px-4 text-right font-medium text-red-600">
                                                -{formatCurrency(expense.amount)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {expense.hasInvoice ? (
                                                    <button
                                                        onClick={() => setSelectedExpense(expense)}
                                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm"
                                                    >
                                                        📄 Xem
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Back to home */}
                <div className="text-center mt-12">
                    <Link href="/" className="btn-primary inline-block">
                        ← Quay về trang chủ
                    </Link>
                </div>
            </main>

            {/* Invoice Modal */}
            {selectedExpense && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-semibold">📄 Hóa đơn / Chứng từ</h3>
                            <button
                                onClick={() => setSelectedExpense(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4 space-y-2">
                                <p><strong>Ngày:</strong> {new Date(selectedExpense.date).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Nội dung:</strong> {selectedExpense.title}</p>
                                <p><strong>Số tiền:</strong> <span className="text-red-600 font-bold">{formatCurrency(selectedExpense.amount)}</span></p>
                            </div>
                            {selectedExpense.invoice_url ? (
                                <img
                                    src={selectedExpense.invoice_url}
                                    alt="Hóa đơn"
                                    className="w-full rounded-lg border"
                                />
                            ) : (
                                <p className="text-gray-500 text-center py-8">Không có hình ảnh hóa đơn</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
