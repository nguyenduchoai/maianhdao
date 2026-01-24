import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from './db';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('🚨 CRITICAL: JWT_SECRET environment variable is not set!');
}

interface JWTPayload {
    id: string;
    username: string;
    role?: string;
    iat?: number;
    exp?: number;
}

interface AdminUser {
    id: string;
    username: string;
    role: string;
    is_active: number;
}

// Audit log for security events
// In production: logs only to persistent database
// In development: also logs to console for debugging
export function logSecurityEvent(event: string, details: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        event,
        ...details,
    };
    
    // Only log to console in development mode
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`🔐 SECURITY: ${JSON.stringify(logEntry)}`);
    }
    
    // Always store in database for persistent audit trail
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS security_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event TEXT NOT NULL,
                details TEXT,
                ip TEXT,
                user_id TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        db.prepare(`
            INSERT INTO security_logs (event, details, ip, user_id)
            VALUES (?, ?, ?, ?)
        `).run(event, JSON.stringify(details), details.ip || null, details.userId || null);
    } catch {
        // Silently fail - don't break auth if logging fails
        // In production, consider using an external logging service
    }
}

/**
 * Verify admin authentication from cookies
 * Returns user info if authenticated, null otherwise
 */
export async function verifyAuth(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return null;
        }

        if (!JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        // Verify user still exists and is active
        const user = db.prepare(
            'SELECT id, role, is_active FROM admin_users WHERE id = ?'
        ).get(decoded.id) as AdminUser | undefined;

        if (!user || !user.is_active) {
            logSecurityEvent('AUTH_FAILED', {
                reason: 'User not found or inactive',
                userId: decoded.id,
            });
            return null;
        }

        return {
            id: decoded.id,
            username: decoded.username,
            role: user.role || decoded.role || 'editor'
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logSecurityEvent('TOKEN_EXPIRED', { error: 'Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            logSecurityEvent('INVALID_TOKEN', { error: 'Invalid token' });
        }
        return null;
    }
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const user = await verifyAuth();
    return user?.role === 'admin';
}

/**
 * Check if current user is authenticated (any role)
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await verifyAuth();
    return user !== null;
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
    return verifyAuth();
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash password with salt (wrapper for bcrypt)
 */
export async function hashPassword(password: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bcrypt = require('bcryptjs');
    return bcrypt.hash(password, 12); // Increased from 10 to 12 rounds
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hash);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Unauthorized response helper
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
    return { error: message, status: 401 };
}

/**
 * Forbidden response helper
 */
export function forbiddenResponse(message: string = 'Forbidden - Admin access required') {
    return { error: message, status: 403 };
}
