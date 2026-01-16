import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/upload - Upload file
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'donors'; // donors, sponsors, trees

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

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return public URL
        const publicUrl = `/uploads/${type}/${filename}`;

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
