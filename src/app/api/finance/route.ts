import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface Income {
    amount: number;
}

interface Expense {
    id: string;
    date: string;
    title: string;
    category: string;
    amount: number;
    invoice_url?: string;
}

// GET /api/finance - Public finance data
export async function GET() {
    try {
        // Get approved donations (income)
        const incomes = db.prepare(`
            SELECT amount FROM donations WHERE status = 'approved'
        `).all() as Income[];

        // Get expenses
        const expenses = db.prepare(`
            SELECT id, date, title, category, amount, invoice_url 
            FROM expenses 
            ORDER BY date DESC
        `).all() as Expense[];

        const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const balance = totalIncome - totalExpense;
        const expenseRatio = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : '0';

        return NextResponse.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance,
                expenseRatio,
                incomeCount: incomes.length,
                expenseCount: expenses.length,
                expenses: expenses.map(e => ({
                    id: e.id,
                    date: e.date,
                    title: e.title,
                    category: e.category,
                    amount: e.amount,
                    hasInvoice: !!e.invoice_url,
                    invoice_url: e.invoice_url,
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching finance:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi lấy dữ liệu tài chính' },
            { status: 500 }
        );
    }
}
