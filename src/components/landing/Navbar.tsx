'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
    settings?: Record<string, string>;
}

export function Navbar({ settings = {} }: NavbarProps) {
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
        { href: '#map', label: settings.navLinkMap || 'Bản Đồ' },
        { href: '#donate', label: settings.navLinkDonate || 'Đóng Góp' },
        { href: '#sponsors', label: settings.navLinkSponsors || 'Ban Tổ Chức' },
        { href: '#donors', label: settings.navLinkDonors || 'Bảng Vinh Danh' },
        { href: '/thu-vien-anh', label: '🖼️ Thư Viện', isLink: true },
        { href: '/minh-bach-tai-chinh', label: settings.navLinkTransparency || '📊 Minh Bạch', isLink: true },
    ];

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'}`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🌸</span>
                        <span className={`
              font-heading font-bold text-lg md:text-xl
              ${isScrolled ? 'text-pink-600' : 'text-white'}
            `}>
                            {settings.navLogoText || 'Ngàn Cây Anh Đào'}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            link.isLink ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        font-medium transition-colors
                                        ${isScrolled
                                            ? 'text-gray-700 hover:text-pink-600'
                                            : 'text-white hover:text-pink-200'}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        font-medium transition-colors
                                        ${isScrolled
                                            ? 'text-gray-700 hover:text-pink-600'
                                            : 'text-white hover:text-pink-200'}
                                    `}
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                        <a
                            href="#donate"
                            className="bg-pink-600 text-white px-4 py-2 rounded-full font-medium hover:bg-pink-700 transition-colors"
                        >
                            💝 Đóng Góp
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
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
                    <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 p-4">
                        {navLinks.map((link) => (
                            link.isLink ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-gray-700 hover:text-pink-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-gray-700 hover:text-pink-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                        <a
                            href="#donate"
                            className="block mt-2 bg-pink-600 text-white text-center py-2 rounded-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            💝 Đóng Góp
                        </a>
                    </div>
                )}
            </div>
        </nav>
    );
}
