import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

// GET /api/gallery - Get all gallery images
export async function GET() {
    try {
        // Ensure table exists
        db.exec(`
            CREATE TABLE IF NOT EXISTS gallery (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL UNIQUE,
                title TEXT,
                category TEXT DEFAULT 'general',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const images = db.prepare(`
            SELECT url, title, category, created_at as createdAt
            FROM gallery
            ORDER BY created_at DESC
        `).all();

        return NextResponse.json({ success: true, data: images });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch gallery' },
            { status: 500 }
        );
    }
}

// POST /api/gallery - Add image to gallery
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, title, category } = body;

        if (!url) {
            return NextResponse.json(
                { success: false, error: 'URL is required' },
                { status: 400 }
            );
        }

        // Ensure table exists
        db.exec(`
            CREATE TABLE IF NOT EXISTS gallery (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL UNIQUE,
                title TEXT,
                category TEXT DEFAULT 'general',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if URL already exists
        const existing = db.prepare('SELECT id FROM gallery WHERE url = ?').get(url);
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Image already exists in gallery' },
                { status: 400 }
            );
        }

        db.prepare(`
            INSERT INTO gallery (url, title, category)
            VALUES (?, ?, ?)
        `).run(url, title || null, category || 'general');

        return NextResponse.json({ success: true, message: 'Image added to gallery' });
    } catch (error) {
        console.error('Error adding to gallery:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add to gallery' },
            { status: 500 }
        );
    }
}

// DELETE /api/gallery - Remove images from gallery
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { urls } = body;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { success: false, error: 'URLs array is required' },
                { status: 400 }
            );
        }

        // Delete from database
        const placeholders = urls.map(() => '?').join(',');
        db.prepare(`DELETE FROM gallery WHERE url IN (${placeholders})`).run(...urls);

        // Optionally delete files from disk
        for (const url of urls) {
            if (url.startsWith('/uploads/gallery/')) {
                const filePath = path.join(process.cwd(), 'public', url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Images deleted successfully' });
    } catch (error) {
        console.error('Error deleting from gallery:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete images' },
            { status: 500 }
        );
    }
}
