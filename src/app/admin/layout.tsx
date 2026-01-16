'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/login');
            const data = await res.json();
            if (data.authenticated) {
                setUser(data.user);
            } else {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/login', { method: 'DELETE' });
        router.push('/admin/login');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
        { href: '/admin/trees', label: 'Quản Lý Cây', icon: '🌸' },
        { href: '/admin/donations', label: 'Đóng Góp', icon: '💰' },
        { href: '/admin/sponsors', label: 'Nhà Tài Trợ', icon: '🏢' },
        { href: '/admin/settings', label: 'Cài Đặt', icon: '⚙️' },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="text-2xl">🌸</span>
                            <h1 className="text-xl font-bold text-gray-800">
                                Admin - Ngàn Cây Anh Đào
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {user && (
                            <span className="text-sm text-gray-600">
                                👤 {user.username}
                            </span>
                        )}
                        <a
                            href="/"
                            target="_blank"
                            className="text-sm text-pink-600 hover:underline"
                        >
                            ← Trang chủ
                        </a>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div className="pt-16 max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <nav className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors flex items-center gap-3 block
                                        ${isActive(item.href, item.exact)
                                            ? 'bg-pink-50 text-pink-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'}
                                    `}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
