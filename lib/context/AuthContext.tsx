/**
 * Auth Context
 * Manages authentication state and operations
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { userRepository } from '../database';
import authService, { AuthSession } from '../services/AuthService';

interface AuthContextType {
    user: AuthSession | null;
    isLoading: boolean;
    isSignedIn: boolean;
    signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    restoreToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Restore token on app launch
     */
    const restoreToken = async () => {
        try {
            setIsLoading(true);
            const session = await authService.getSession();
            if (session) {
                setUser(session);
                console.log('[Auth] Session restored');
            }
        } catch (error) {
            console.error('[Auth] Error restoring token:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign up new user
     */
    const signUp = async (name: string, email: string, password: string, phone?: string) => {
        try {
            setIsLoading(true);

            // Check if user exists
            const existing = await userRepository.getByEmail(email);
            if (existing) {
                throw new Error('Email already registered');
            }

            // In production, hash the password before storing
            // For now, storing as-is (UNSAFE - only for demo)
            if (!phone) {
                throw new Error('Phone number is required');
            }
            const newUser = await userRepository.create({
                name,
                email: email.toLowerCase(),
                password,
                phone,
            });

            const session: AuthSession = {
                userId: newUser.id,
                email: newUser.email,
                name: newUser.name,
                timestamp: Date.now(),
            };

            await authService.saveSession(session);
            setUser(session);
            console.log('[Auth] Sign up successful');
        } catch (error) {
            console.error('[Auth] Sign up error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign in user
     */
    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            const existingUser = await userRepository.getByEmail(email);
            if (!existingUser) {
                throw new Error('User not found');
            }

            // In production, verify hashed password
            // For now, checking plain text (UNSAFE - only for demo)
            if (existingUser.password !== password) {
                throw new Error('Invalid password');
            }

            const session: AuthSession = {
                userId: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                timestamp: Date.now(),
            };

            await authService.saveSession(session);
            setUser(session);
            console.log('[Auth] Sign in successful');
        } catch (error) {
            console.error('[Auth] Sign in error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign out user
     */
    const signOut = async () => {
        try {
            setIsLoading(true);
            await authService.clearSession();
            setUser(null);
            console.log('[Auth] Sign out successful');
        } catch (error) {
            console.error('[Auth] Sign out error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Restore token on mount
    useEffect(() => {
        restoreToken();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isSignedIn: !!user,
                signUp,
                signIn,
                signOut,
                restoreToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
