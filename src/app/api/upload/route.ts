import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

// POST /api/upload - Upload file (REQUIRES AUTH)
export async function POST(request: NextRequest) {
    // 🔐 Auth Check - Only authenticated users can upload
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized - Login required to upload files' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'donors'; // donors, sponsors, trees, gallery
        const category = formData.get('category') as string || 'general'; // For gallery

        if (!file) {
            return NextResponse.json({ error: 'Không có file' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP, SVG)' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File quá lớn (tối đa 5MB)' }, { status: 400 });
        }

        // Sanitize type to prevent path traversal
        const allowedUploadTypes = ['donors', 'sponsors', 'trees', 'gallery', 'invoices'];
        const safeType = allowedUploadTypes.includes(type) ? type : 'donors';

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeType);
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename (sanitized)
        const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '');
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return public URL
        const publicUrl = `/uploads/${safeType}/${filename}`;

        // If gallery type, also add to gallery database
        if (safeType === 'gallery') {
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
                
                db.prepare(`
                    INSERT INTO gallery (url, title, category)
                    VALUES (?, ?, ?)
                `).run(publicUrl, file.name.replace(/\.[^/.]+$/, ''), category);
            } catch (dbError) {
                console.error('Gallery DB error:', dbError);
                // Continue anyway - file is uploaded
            }
        }

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Lỗi upload file' }, { status: 500 });
    }
}
