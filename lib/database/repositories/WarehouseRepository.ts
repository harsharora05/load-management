import { generateId, getCurrentTimestamp } from "../../utils/helpers";
import db from "../db";
import { Inventory, Warehouse } from "../schema";

class WarehouseRepository {
    private static instance: WarehouseRepository;

    private constructor() { }

    static getInstance(): WarehouseRepository {
        if (!WarehouseRepository.instance) {
            WarehouseRepository.instance = new WarehouseRepository();
        }
        return WarehouseRepository.instance;
    }

    async create(
        data: Omit<Warehouse, "id" | "createdAt">
    ): Promise<Warehouse> {
        const warehouse: Warehouse = {
            ...data,
            id: generateId(),
            createdAt: getCurrentTimestamp(),
        };

        await db.run(
            `INSERT INTO warehouses (id, name, location, createdAt) VALUES (?, ?, ?, ?)`,
            [warehouse.id, warehouse.name, warehouse.location, warehouse.createdAt]
        );

        return warehouse;
    }

    async getAll(): Promise<Warehouse[]> {
        return await db.all<Warehouse>(`SELECT * FROM warehouses ORDER BY name ASC`);
    }

    async getInventoryForWarehouse(warehouseId: string): Promise<Inventory[]> {
        return await db.all<Inventory>(
            `SELECT
                *
             FROM inventory
             WHERE warehouseId = ?
             ORDER BY name ASC`,
            [warehouseId]
        );
    }
}

export default WarehouseRepository.getInstance();