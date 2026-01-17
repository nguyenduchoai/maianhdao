'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navbar() {
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
        { href: '#map', label: 'Bản Đồ' },
        { href: '#donate', label: 'Đóng Góp' },
        { href: '#sponsors', label: 'Ban Tổ Chức' },
        { href: '#donors', label: 'Bảng Vinh Danh' },
    ];

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'}
      `}
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
                            Ngàn Cây Anh Đào
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
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
                        ))}
                        <a href="#donate" className="btn-primary py-2 px-4 text-sm">
                            💝 Đóng Góp
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white rounded-b-2xl shadow-lg py-4 px-4 mb-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-3 text-gray-700 font-medium hover:text-pink-600 border-b border-gray-100"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#donate"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block mt-4 btn-primary text-center py-3"
                        >
                            💝 Đóng Góp Ngay
                        </a>
                    </div>
                )}
            </div>
        </nav>
    );
}
