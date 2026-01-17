import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/admin/expenses - Get all expenses
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let query = 'SELECT * FROM expenses WHERE 1=1';
        const params: any[] = [];

        if (category && category !== 'all') {
            query += ' AND category = ?';
            params.push(category);
        }

        if (startDate) {
            query += ' AND date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        const expenses = db.prepare(query).all(...params);

        // Get total
        const totalResult = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses').get() as { total: number };

        return NextResponse.json({
            success: true,
            data: expenses,
            total: totalResult.total
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST /api/admin/expenses - Create new expense
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, title, category, amount, payment_method, vendor, note, invoice_url } = body;

        if (!title || !amount || !date) {
            return NextResponse.json({ error: 'Ngày, tiêu đề và số tiền là bắt buộc' }, { status: 400 });
        }

        const id = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        db.prepare(`
            INSERT INTO expenses (id, date, title, category, amount, payment_method, vendor, note, invoice_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            date,
            title,
            category || 'other',
            amount,
            payment_method || 'cash',
            vendor || null,
            note || null,
            invoice_url || null,
            new Date().toISOString()
        );

        return NextResponse.json({ success: true, message: 'Tạo chi phí thành công', id });
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT /api/admin/expenses - Update expense
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, date, title, category, amount, payment_method, vendor, note, invoice_url } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        const updates: string[] = [];
        const values: any[] = [];

        if (date !== undefined) { updates.push('date = ?'); values.push(date); }
        if (title !== undefined) { updates.push('title = ?'); values.push(title); }
        if (category !== undefined) { updates.push('category = ?'); values.push(category); }
        if (amount !== undefined) { updates.push('amount = ?'); values.push(amount); }
        if (payment_method !== undefined) { updates.push('payment_method = ?'); values.push(payment_method); }
        if (vendor !== undefined) { updates.push('vendor = ?'); values.push(vendor); }
        if (note !== undefined) { updates.push('note = ?'); values.push(note); }
        if (invoice_url !== undefined) { updates.push('invoice_url = ?'); values.push(invoice_url); }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(id);

        db.prepare(`UPDATE expenses SET ${updates.join(', ')} WHERE id = ?`).run(...values);

        return NextResponse.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        console.error('Error updating expense:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE /api/admin/expenses - Delete expense
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
        }

        db.prepare('DELETE FROM expenses WHERE id = ?').run(id);

        return NextResponse.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
