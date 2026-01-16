'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    role: string;
    is_active: number;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'editor',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.data || []);
            } else {
                setError(data.error || 'Không thể tải danh sách users');
            }
        } catch (error) {
            setError('Lỗi kết nối server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async () => {
        setError('');

        if (!newUser.username.trim() || !newUser.password) {
            setError('Username và password là bắt buộc');
            return;
        }

        if (newUser.password !== newUser.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newUser.password.length < 6) {
            setError('Mật khẩu phải ít nhất 6 ký tự');
            return;
        }

        setIsAdding(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: newUser.username,
                    password: newUser.password,
                    role: newUser.role,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setShowAddModal(false);
                setNewUser({ username: '', password: '', confirmPassword: '', role: 'editor' });
                fetchUsers();
            } else {
                setError(data.error || 'Không thể tạo user');
            }
        } catch (error) {
            setError('Lỗi kết nối server');
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggleActive = async (user: User) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    is_active: user.is_active ? 0 : 1,
                }),
            });
            const data = await res.json();

            if (data.success) {
                fetchUsers();
            } else {
                alert(data.error || 'Không thể cập nhật');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Bạn có chắc muốn xóa user "${user.username}"?`)) return;

        try {
            const res = await fetch(`/api/admin/users?id=${user.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                fetchUsers();
            } else {
                alert(data.error || 'Không thể xóa user');
            }
        } catch (error) {
            alert('Lỗi kết nối server');
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return { text: 'Admin', class: 'bg-red-100 text-red-700' };
            case 'editor': return { text: 'Editor', class: 'bg-blue-100 text-blue-700' };
            default: return { text: role, class: 'bg-gray-100 text-gray-700' };
        }
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">👥 Quản Lý Users</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                    ➕ Thêm User Mới
                </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                    <strong>💡 Phân quyền:</strong>
                </p>
                <ul className="text-blue-700 text-sm mt-1 list-disc list-inside">
                    <li><strong>Admin</strong>: Toàn quyền (bao gồm Cài đặt, Quản lý Users)</li>
                    <li><strong>Editor</strong>: Nhập liệu (Dashboard, Cây, Đóng góp, Nhà tài trợ)</li>
                </ul>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Username</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Quyền</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Ngày tạo</th>
                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const roleInfo = getRoleLabel(user.role);
                            return (
                                <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-gray-800">👤 {user.username}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.class}`}>
                                            {roleInfo.text}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.is_active ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                ✅ Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                ❌ Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleToggleActive(user)}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                {user.is_active ? 'Vô hiệu' : 'Kích hoạt'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Chưa có user nào
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">👤 Thêm User Mới</h3>
                            <button
                                onClick={() => { setShowAddModal(false); setError(''); }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    ❌ {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    placeholder="VD: editor1, nhaplieu..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Ít nhất 6 ký tự"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={newUser.confirmPassword}
                                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quyền</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="editor">Editor (Nhập liệu)</option>
                                    <option value="admin">Admin (Toàn quyền)</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button
                                onClick={() => { setShowAddModal(false); setError(''); }}
                                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddUser}
                                disabled={isAdding}
                                className="py-2 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
                            >
                                {isAdding ? 'Đang tạo...' : '✅ Tạo User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
