/**
 * Core Database Service
 * Minimal SQLite wrapper
 */

import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

class DatabaseService {
    private static instance: DatabaseService;
    private db: SQLite.SQLiteDatabase | null = null;

    private constructor() { }

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    /**
     * Initialize database and create tables
     */
    async initialize(): Promise<void> {
        try {
            this.db = await SQLite.openDatabaseAsync('loadmanagement.db');

            // Enable foreign keys
            await this.db.execAsync('PRAGMA foreign_keys = ON;');

            // Create tables
            await this.db.execAsync(CREATE_TABLES_SQL);

            console.log('[DB] Database initialized');
        } catch (error) {
            console.error('[DB] Error initializing database:', error);
            throw error;
        }
    }

    /**
     * Execute a query
     */
    async run(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
        if (!this.db) throw new Error('Database not initialized');
        try {
            return await this.db.runAsync(sql, params);
        } catch (error) {
            console.error('[DB] Error running query:', error);
            throw error;
        }
    }

    /**
     * Get a single row
     */
    async get<T>(sql: string, params: any[] = []): Promise<T | null> {
        if (!this.db) throw new Error('Database not initialized');
        try {
            const result = await this.db.getFirstAsync<T>(sql, params);
            return result || null;
        } catch (error) {
            console.error('[DB] Error getting row:', error);
            throw error;
        }
    }

    /**
     * Get all rows
     */
    async all<T>(sql: string, params: any[] = []): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');
        try {
            return await this.db.getAllAsync<T>(sql, params);
        } catch (error) {
            console.error('[DB] Error getting rows:', error);
            throw error;
        }
    }

    /**
     * Begin transaction
     */
    async beginTransaction(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.execAsync('BEGIN TRANSACTION;');
    }

    /**
     * Commit transaction
     */
    async commit(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.execAsync('COMMIT;');
    }

    /**
     * Rollback transaction
     */
    async rollback(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.execAsync('ROLLBACK;');
    }

    /**
     * Close database connection
     */
    async close(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
        }
    }
}

export default DatabaseService.getInstance();
