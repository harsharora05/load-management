import { generateId, getCurrentTimestamp } from "../../utils/helpers";
import db from "../db";
import { Inventory } from "../schema";

class InventoryRepository {
    private static instance: InventoryRepository;

    private constructor() { }

    static getInstance(): InventoryRepository {
        if (!InventoryRepository.instance) {
            InventoryRepository.instance = new InventoryRepository();
        }
        return InventoryRepository.instance;
    }

    /**
     * Create a new inventory item
     */
    async create(
        data: Omit<Inventory, "id" | "createdAt">
    ): Promise<Inventory> {
        const item: Inventory = {
            ...data,
            id: generateId(),
            createdAt: getCurrentTimestamp(),
        };

        await db.run(
            `INSERT INTO inventory (id, name, sku, quantity, price, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
            [item.id, item.name, item.sku, item.quantity, item.price, item.createdAt]
        );

        return item;
    }

    /**
     * Get all inventory items
     */
    async getAll(): Promise<Inventory[]> {
        return await db.all<Inventory>(
            `SELECT * FROM inventory ORDER BY name ASC`
        );
    }

    /**
     * Get inventory item by ID
     */
    async getById(id: string): Promise<Inventory | null> {
        return await db.get<Inventory>(
            `SELECT * FROM inventory WHERE id = ?`,
            [id]
        );
    }

    /**
     * Update inventory item
     */
    async update(
        id: string,
        updates: Partial<Omit<Inventory, "id" | "createdAt">>
    ): Promise<Inventory | null> {
        const existing = await this.getById(id);
        if (!existing) return null;

        if (Object.keys(updates).length === 0) return existing;

        const keys = Object.keys(updates);
        const values = Object.values(updates);

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

        await db.run(
            `UPDATE inventory SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        return await this.getById(id);
    }

    /**
     * Delete inventory item
     */
    async delete(id: string): Promise<boolean> {
        const result = await db.run(
            `DELETE FROM inventory WHERE id = ?`,
            [id]
        );
        return result.changes > 0;
    }
}

export default InventoryRepository.getInstance();