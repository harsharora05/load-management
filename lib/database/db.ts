/**
 * Core Database Service
 * SQLite wrapper for Expo
 */

import * as SQLite from "expo-sqlite";
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
     * Initialize database
     */
    async initialize(): Promise<void> {
        if (this.isInitialized()) return;

        try {
            this.db = await SQLite.openDatabaseAsync("loadmanagement.v2.db");

            await this.db.execAsync("PRAGMA foreign_keys = ON;");
            await this.db.execAsync(CREATE_TABLES_SQL);

            console.log("[DB] Database initialized successfully.");
        } catch (error) {
            console.error("[DB] Failed to initialize database:", error);
            throw error;
        }
    }

    /**
     * Ensure database has been initialized
     */
    private get database(): SQLite.SQLiteDatabase {
        if (!this.db) {
            throw new Error(
                "Database not initialized. Call db.initialize() before using the database."
            );
        }

        return this.db;
    }

    /**
     * Execute INSERT / UPDATE / DELETE
     */
    async run(
        sql: string,
        params: SQLite.SQLiteBindParams = []
    ): Promise<SQLite.SQLiteRunResult> {
        try {
            return await this.database.runAsync(sql, params);
        } catch (error) {
            console.error("[DB] Run Error:", error);
            console.error(sql);
            throw error;
        }
    }

    /**
     * Get first row
     */
    async get<T>(
        sql: string,
        params: SQLite.SQLiteBindParams = []
    ): Promise<T | null> {
        try {
            const result = await this.database.getFirstAsync<T>(sql, params);
            return result ?? null;
        } catch (error) {
            console.error("[DB] Get Error:", error);
            console.error(sql);
            throw error;
        }
    }

    /**
     * Get all rows
     */
    async all<T>(
        sql: string,
        params: SQLite.SQLiteBindParams = []
    ): Promise<T[]> {
        try {
            return await this.database.getAllAsync<T>(sql, params);
        } catch (error) {
            console.error("[DB] All Error:", error);
            console.error(sql);
            throw error;
        }
    }

    /**
     * Execute raw SQL (CREATE TABLE, PRAGMA, etc.)
     */
    async exec(sql: string): Promise<void> {
        try {
            await this.database.execAsync(sql);
        } catch (error) {
            console.error("[DB] Exec Error:", error);
            throw error;
        }
    }

    /**
     * Begin transaction
     */
    async beginTransaction(): Promise<void> {
        await this.exec("BEGIN TRANSACTION;");
    }

    /**
     * Commit transaction
     */
    async commit(): Promise<void> {
        await this.exec("COMMIT;");
    }

    /**
     * Rollback transaction
     */
    async rollback(): Promise<void> {
        await this.exec("ROLLBACK;");
    }

    /**
     * Close database
     */
    async close(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
            console.log("[DB] Database closed.");
        }
    }

    /**
     * Check if initialized
     */
    isInitialized(): boolean {
        return this.db !== null;
    }
}

const db = DatabaseService.getInstance();

export default db;