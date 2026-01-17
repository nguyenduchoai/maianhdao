'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface AdminUser {
    username: string;
    role: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            setIsLoading(false);
            return;
        }
        checkAuth();
    }, [pathname]);

    // Check access when pathname changes
    useEffect(() => {
        if (user && !isLoading) {
            checkAccess();
        }
    }, [pathname, user, isLoading]);

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

    const checkAccess = () => {
        // Admin-only pages
        const adminOnlyPages = ['/admin/settings', '/admin/users'];
        const isAdminOnlyPage = adminOnlyPages.some(page => pathname.startsWith(page));

        if (isAdminOnlyPage && user?.role !== 'admin') {
            alert('Bạn không có quyền truy cập trang này!');
            router.push('/admin');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/login', { method: 'DELETE' });
        router.push('/admin/login');
    };

    const isAdmin = user?.role === 'admin';

    // Navigation items - some are admin-only
    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
        { href: '/admin/trees', label: 'Quản Lý Cây', icon: '🌸' },
        { href: '/admin/donations', label: 'Đóng Góp', icon: '💰' },
        { href: '/admin/sponsors', label: 'Ban Tổ Chức', icon: '🏛️' },
        ...(isAdmin ? [
            { href: '/admin/users', label: 'Users', icon: '👥' },
            { href: '/admin/settings', label: 'Cài Đặt', icon: '⚙️' },
        ] : []),
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

    // Skip layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header with horizontal nav */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Top row: Logo + User */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="text-2xl">🌸</span>
                            <h1 className="text-xl font-bold text-gray-800">
                                Admin - Ngàn Cây Anh Đào
                            </h1>
                        </Link>
                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        👤 {user.username}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role === 'admin' ? 'Admin' : 'Editor'}
                                    </span>
                                </div>
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

                    {/* Navigation row */}
                    <nav className="flex items-center gap-1 py-2 overflow-x-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap
                                    ${isActive(item.href, item.exact)
                                        ? 'bg-pink-500 text-white font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'}
                                `}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
