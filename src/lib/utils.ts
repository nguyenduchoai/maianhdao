import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
}

export function getDonationTier(amount: number): 'kientao' | 'dauun' | 'guitrao' | 'gieomam' {
    if (amount >= 5_000_000) return 'kientao';  // KIẾN TẠO: 5-10tr
    if (amount >= 1_000_000) return 'dauun';    // DẤU ẤN: 1-2tr
    if (amount >= 200_000) return 'guitrao';    // GỬI TRAO: 200k-500k
    return 'gieomam';                           // GIEO MẦM: 50k-100k
}

export function getTierLabel(tier: string): string {
    const labels: Record<string, string> = {
        kientao: '🏆 KIẾN TẠO',
        dauun: '🌸 DẤU ẤN',
        guitrao: '💝 GỬi TRAO',
        gieomam: '🌱 GIEO MẦM',
        diamond: '💎 Kim Cương',
        gold: '🥇 Vàng',
        silver: '🥈 Bạc',
        green: '💚 Xanh',
        imprint: '🌸 Ghi danh',
        entrust: '🌸 Uỷ thác',
        organizer: '🏆 Đơn vị tổ chức',
    };
    return labels[tier] || tier;
}

export function getTierColor(tier: string): string {
    const colors: Record<string, string> = {
        kientao: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        dauun: 'bg-gradient-to-r from-pink-400 to-pink-500',
        guitrao: 'bg-gradient-to-r from-blue-400 to-blue-500',
        gieomam: 'bg-gradient-to-r from-green-400 to-green-500',
        diamond: 'bg-blue-500',
        gold: 'bg-amber-500',
        silver: 'bg-gray-400',
        green: 'bg-green-500',
        organizer: 'bg-pink-600',
    };
    return colors[tier] || 'bg-gray-500';
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
