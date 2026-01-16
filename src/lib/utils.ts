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

export function getDonationTier(amount: number): 'diamond' | 'gold' | 'silver' | 'green' {
    if (amount >= 50_000_000) return 'diamond';
    if (amount >= 20_000_000) return 'gold';
    if (amount >= 5_000_000) return 'silver';
    return 'green';
}

export function getTierLabel(tier: string): string {
    const labels: Record<string, string> = {
        diamond: '💎 Kim Cương',
        gold: '🥇 Vàng',
        silver: '🥈 Bạc',
        green: '💚 Xanh',
        organizer: '🏆 Đơn vị tổ chức',
    };
    return labels[tier] || tier;
}

export function getTierColor(tier: string): string {
    const colors: Record<string, string> = {
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
