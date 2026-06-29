/**
 * Database Schema
 * Minimal schema for user login/signup
 */

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    password: string; // hashed
    createdAt: string;
    updatedAt: string;
}

export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;
