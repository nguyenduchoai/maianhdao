import { NextResponse } from 'next/server';
import { getAllSettings } from '@/lib/db';

// GET /api/site-settings - Public API to get all site settings
export async function GET() {
    try {
        const settings = getAllSettings();

        // Return all settings - the frontend will use defaults for missing ones
        return NextResponse.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi lấy cài đặt' },
            { status: 500 }
        );
    }
}
