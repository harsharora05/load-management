/**
 * Auth Service
 * Secure storage for authentication sessions
 */

import * as SecureStore from 'expo-secure-store';

export interface AuthSession {
    userId: string;
    email: string;
    name: string;
    token?: string;
    timestamp: number;
}

const AUTH_KEY = 'auth_session';

class AuthService {
    private static instance: AuthService;

    private constructor() { }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Save session to secure storage
     */
    async saveSession(session: AuthSession): Promise<void> {
        try {
            await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(session));
            console.log('[AuthService] Session saved');
        } catch (error) {
            console.error('[AuthService] Error saving session:', error);
            throw error;
        }
    }

    /**
     * Get session from secure storage
     */
    async getSession(): Promise<AuthSession | null> {
        try {
            const sessionStr = await SecureStore.getItemAsync(AUTH_KEY);
            if (!sessionStr) return null;
            return JSON.parse(sessionStr) as AuthSession;
        } catch (error) {
            console.error('[AuthService] Error getting session:', error);
            return null;
        }
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        const session = await this.getSession();
        return !!session;
    }

    /**
     * Clear session
     */
    async clearSession(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(AUTH_KEY);
            console.log('[AuthService] Session cleared');
        } catch (error) {
            console.error('[AuthService] Error clearing session:', error);
            throw error;
        }
    }
}

export default AuthService.getInstance();
