/**
 * User Repository
 * Minimal user database operations
 */

import { generateId, getCurrentTimestamp } from "../utils/helpers";
import db from "./db";
import { User } from "./schema";



class UserRepository {
    private static instance: UserRepository;

    private constructor() { }

    static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    /**
     * Create a new user
     */
    async create(
        data: Omit<User, "id" | "createdAt" | "updatedAt">
    ): Promise<User> {
        const id = generateId();
        const now = getCurrentTimestamp();

        const user: User = {
            ...data,
            id,
            email: data.email.toLowerCase(),
            createdAt: now,
            updatedAt: now,
        };

        await db.run(
            `INSERT INTO users
            (id, name, email, phone, password, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                user.name,
                user.email,
                user.phone ?? "",
                user.password!,
                user.createdAt,
                user.updatedAt,
            ]
        );

        return user;
    }

    /**
     * Get user by email
     */
    async getByEmail(email: string): Promise<User | null> {
        return await db.get<User>(
            "SELECT * FROM users WHERE email = ?",
            [email.toLowerCase()]
        );
    }

    /**
     * Get user by ID
     */
    async getById(id: string): Promise<User | null> {
        return await db.get<User>(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
    }

    /**
     * Get all users
     */
    async getAll(): Promise<User[]> {
        return await db.all<User>(
            "SELECT * FROM users ORDER BY createdAt DESC"
        );
    }

    /**
     * Update user
     */
    async update(
        id: string,
        updates: Partial<Omit<User, "id" | "createdAt">>
    ): Promise<User | null> {
        const existing = await this.getById(id);

        if (!existing) {
            return null;
        }

        if (Object.keys(updates).length === 0) {
            return existing;
        }

        const now = getCurrentTimestamp();

        if (updates.email) {
            updates.email = updates.email.toLowerCase();
        }

        const keys = Object.keys(updates);
        const values = Object.values(updates);

        const setClause = keys
            .map((key) => `${key} = ?`)
            .join(", ");

        await db.run(
            `UPDATE users
             SET ${setClause}, updatedAt = ?
             WHERE id = ?`,
            [...values, now, id]
        );

        return await this.getById(id);
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<boolean> {
        const result = await db.run(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        return result.changes > 0;
    }
}

export default UserRepository.getInstance();