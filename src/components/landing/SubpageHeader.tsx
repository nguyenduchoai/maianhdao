'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SubpageHeaderProps {
    currentPage?: string;
}

export function SubpageHeader({ currentPage }: SubpageHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Trang Chủ' },
        { href: '/#map', label: 'Bản Đồ' },
        { href: '/#donate', label: 'Đóng Góp' },
        { href: '/#sponsors', label: 'Ban Tổ Chức' },
        { href: '/#donors', label: 'Bảng Vinh Danh' },
        { href: '/thu-vien-anh', label: '🖼️ Thư Viện' },
        { href: '/minh-bach-tai-chinh', label: '📊 Minh Bạch' },
    ];

    const isActive = (href: string) => {
        if (currentPage && href.includes(currentPage)) return true;
        return false;
    };

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-300
                ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-white shadow-sm'}`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🌸</span>
                        <span className="font-heading font-bold text-lg md:text-xl text-pink-600">
                            Ngàn Cây Anh Đào
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-5 lg:gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    font-medium transition-colors text-sm lg:text-base
                                    ${isActive(link.href)
                                        ? 'text-pink-600'
                                        : 'text-gray-700 hover:text-pink-600'}
                                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/#donate"
                            className="bg-pink-600 text-white px-4 py-2 rounded-full font-medium hover:bg-pink-700 transition-colors text-sm"
                        >
                            💝 Đóng Góp
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 p-4 border">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block py-2 ${isActive(link.href) ? 'text-pink-600 font-medium' : 'text-gray-700 hover:text-pink-600'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/#donate"
                            className="block mt-2 bg-pink-600 text-white text-center py-2 rounded-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            💝 Đóng Góp
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
