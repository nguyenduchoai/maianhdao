'use client';

import { useState, useEffect, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Income {
    id: string;
    name: string;
    amount: number;
    tier: string;
    status: string;
    created_at: string;
    tree_code?: string;
    message?: string;
}

interface Expense {
    id: string;
    date: string;
    title: string;
    category: string;
    amount: number;
    payment_method: string;
    vendor?: string;
    note?: string;
    invoice_url?: string;
}

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [expenseForm, setExpenseForm] = useState({
        date: new Date().toISOString().split('T')[0],
        title: '',
        category: 'event',
        amount: '',
        payment_method: 'transfer',
        vendor: '',
        note: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch incomes (approved donations)
            const incomeRes = await fetch('/api/admin/donations');
            const incomeData = await incomeRes.json();
            const approvedDonations = (incomeData.data || []).filter((d: Income) => d.status === 'approved');
            setIncomes(approvedDonations);

            // Fetch expenses
            const expenseRes = await fetch('/api/admin/expenses');
            const expenseData = await expenseRes.json();
            setExpenses(expenseData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            incomeCount: incomes.length,
            expenseCount: expenses.length,
        };
    }, [incomes, expenses]);

    const handleAddExpense = async () => {
        if (!expenseForm.title || !expenseForm.amount || !expenseForm.date) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...expenseForm,
                    amount: parseInt(expenseForm.amount),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowAddExpense(false);
                setExpenseForm({
                    date: new Date().toISOString().split('T')[0],
                    title: '',
                    category: 'event',
                    amount: '',
                    payment_method: 'transfer',
                    vendor: '',
                    note: '',
                });
                fetchData();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteExpense = async (id: string, title: string) => {
        if (!confirm(`Xóa chi phí "${title}"?`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/expenses?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchData();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setDeletingId(null);
        }
    };

    const categoryLabels: Record<string, string> = {
        event: '🎪 Sự kiện',
        tree: '🌸 Cây cối',
        marketing: '📢 Marketing',
        logistics: '🚚 Vận chuyển',
        staff: '👷 Nhân công',
        other: '📦 Khác',
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Tài Chính</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-4 text-white">
                    <div className="text-sm opacity-80">↙ Tổng thu</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalIncome)}</div>
                    <div className="text-xs opacity-70">{stats.incomeCount} khoản</div>
                </div>
                <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-4 text-white">
                    <div className="text-sm opacity-80">↗ Tổng chi</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalExpense)}</div>
                    <div className="text-xs opacity-70">{stats.expenseCount} khoản</div>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-4 text-white">
                    <div className="text-sm opacity-80">💰 Số dư</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
                    <div className="text-xs opacity-70">Thu - Chi</div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-4 text-white">
                    <div className="text-sm opacity-80">📊 Tỷ lệ chi</div>
                    <div className="text-2xl font-bold">
                        {stats.totalIncome > 0 ? Math.round((stats.totalExpense / stats.totalIncome) * 100) : 0}%
                    </div>
                    <div className="text-xs opacity-70">Chi/Thu</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('income')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'income'
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    💵 Danh sách Thu ({incomes.length})
                </button>
                <button
                    onClick={() => setActiveTab('expense')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    💸 Danh sách Chi ({expenses.length})
                </button>
            </div>

            {/* Income Tab */}
            {activeTab === 'income' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-green-50">
                        <h3 className="font-semibold text-green-800">💵 Danh sách Thu (từ Đóng góp)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thời gian</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Người đóng góp</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Loại</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Số tiền</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ghi chú</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cây</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {incomes.map((income) => (
                                    <tr key={income.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {income.created_at ? new Date(income.created_at).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{income.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                                ↙ Vào
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                                            +{formatCurrency(income.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                            {income.message || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-pink-600">
                                            {income.tree_code || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {incomes.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                Chưa có khoản thu nào
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Expense Tab */}
            {activeTab === 'expense' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-red-50 flex items-center justify-between">
                        <h3 className="font-semibold text-red-800">💸 Danh sách Chi phí</h3>
                        <button
                            onClick={() => setShowAddExpense(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            + Thêm chi phí
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tiêu đề</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Danh mục</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Số tiền</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thanh toán</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nhà cung cấp</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(expense.date).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{expense.title}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {categoryLabels[expense.category] || expense.category}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-red-600">
                                            -{formatCurrency(expense.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {expense.payment_method === 'transfer' ? '🏦 Chuyển khoản' :
                                                expense.payment_method === 'cash' ? '💵 Tiền mặt' : expense.payment_method}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{expense.vendor || '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleDeleteExpense(expense.id, expense.title)}
                                                disabled={deletingId === expense.id}
                                                className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                                            >
                                                {deletingId === expense.id ? '...' : '🗑️'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {expenses.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-4xl mb-2">💰</div>
                                <p>Chưa có chi phí nào</p>
                                <button
                                    onClick={() => setShowAddExpense(true)}
                                    className="text-red-500 hover:underline mt-2"
                                >
                                    + Thêm chi phí đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Expense Modal */}
            {showAddExpense && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">➕ Thêm Chi Phí Mới</h3>
                            <button onClick={() => setShowAddExpense(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                                    <input
                                        type="date"
                                        value={expenseForm.date}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ) *</label>
                                    <input
                                        type="number"
                                        value={expenseForm.amount}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                        placeholder="1000000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                                <input
                                    type="text"
                                    value={expenseForm.title}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="VD: Mua cây mai anh đào"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                    <select
                                        value={expenseForm.category}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="event">🎪 Sự kiện</option>
                                        <option value="tree">🌸 Cây cối</option>
                                        <option value="marketing">📢 Marketing</option>
                                        <option value="logistics">🚚 Vận chuyển</option>
                                        <option value="staff">👷 Nhân công</option>
                                        <option value="other">📦 Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thanh toán</label>
                                    <select
                                        value={expenseForm.payment_method}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, payment_method: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="transfer">🏦 Chuyển khoản</option>
                                        <option value="cash">💵 Tiền mặt</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                                <input
                                    type="text"
                                    value={expenseForm.vendor}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="VD: Vườn ươm ABC"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <textarea
                                    value={expenseForm.note}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t flex gap-3">
                            <button
                                onClick={handleAddExpense}
                                disabled={isSubmitting}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-lg font-medium"
                            >
                                {isSubmitting ? 'Đang lưu...' : '✅ Thêm chi phí'}
                            </button>
                            <button
                                onClick={() => setShowAddExpense(false)}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
