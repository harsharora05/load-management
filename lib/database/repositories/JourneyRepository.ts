import db from "../db";
import { Journey } from "../schema";
import { generateId, getCurrentTimestamp } from "../../utils/helpers";

class JourneyRepository {
    private static instance: JourneyRepository;

    private constructor() { }

    static getInstance(): JourneyRepository {
        if (!JourneyRepository.instance) {
            JourneyRepository.instance = new JourneyRepository();
        }

        return JourneyRepository.instance;
    }

    /**
     * Create Journey
     */
    async create(
        data: Omit<Journey, "id" | "createdAt">
    ): Promise<Journey> {
        const journey: Journey = {
            ...data,
            id: generateId(),
            createdAt: getCurrentTimestamp(),
        };

        await db.run(
            `INSERT INTO journeys
            (id, userId, source, destination, date, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                journey.id,
                journey.userId,
                journey.source,
                journey.destination,
                journey.date,
                journey.createdAt,
            ]
        );

        return journey;
    }

    /**
     * Get all journeys
     */
    async getAll(): Promise<Journey[]> {
        return await db.all<Journey>(
            `SELECT * FROM journeys ORDER BY createdAt DESC`
        );
    }

    /**
     * Get journey by id
     */
    async getById(id: string): Promise<Journey | null> {
        return await db.get<Journey>(
            `SELECT * FROM journeys WHERE id = ?`,
            [id]
        );
    }

    /**
     * Get journeys by user
     */
    async getByUser(userId: string): Promise<Journey[]> {
        return await db.all<Journey>(
            `SELECT * FROM journeys
             WHERE userId = ?
             ORDER BY createdAt DESC`,
            [userId]
        );
    }

    /**
     * Update journey
     */
    async update(
        id: string,
        updates: Partial<Omit<Journey, "id" | "createdAt">>
    ): Promise<Journey | null> {
        const existing = await this.getById(id);

        if (!existing) {
            return null;
        }

        if (Object.keys(updates).length === 0) {
            return existing;
        }

        const keys = Object.keys(updates);
        const values = Object.values(updates);

        const setClause = keys
            .map((key) => `${key} = ?`)
            .join(", ");

        await db.run(
            `UPDATE journeys
             SET ${setClause}
             WHERE id = ?`,
            [...values, id]
        );

        return await this.getById(id);
    }

    /**
     * Delete journey
     */
    async delete(id: string): Promise<boolean> {
        const result = await db.run(
            `DELETE FROM journeys WHERE id = ?`,
            [id]
        );

        return result.changes > 0;
    }
}

export default JourneyRepository.getInstance();