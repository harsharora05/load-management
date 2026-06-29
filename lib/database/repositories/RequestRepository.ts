import { generateId, getCurrentTimestamp } from "../../utils/helpers";
import db from "../db";
import { Request } from "../schema";

class RequestRepository {
    private static instance: RequestRepository;

    private constructor() { }

    static getInstance(): RequestRepository {
        if (!RequestRepository.instance) {
            RequestRepository.instance = new RequestRepository();
        }
        return RequestRepository.instance;
    }

    /**
     * Create a new inventory request
     */
    async create(
        data: Omit<Request, "id" | "createdAt" | "status">
    ): Promise<Request> {
        const request: Request = {
            ...data,
            id: generateId(),
            status: "Pending",
            createdAt: getCurrentTimestamp(),
        };

        await db.run(
            `INSERT INTO requests (id, inventoryId, warehouseId, quantity, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
            [request.id, request.inventoryId, request.warehouseId, request.quantity, request.status, request.createdAt]
        );

        return request;
    }

    /**
     * Get all requests with inventory item details
     */
    async getAllWithInventoryDetails(): Promise<(Request & { itemName: string; itemSku: string; warehouseName: string; })[]> {
        return await db.all<any>(
            `SELECT
                r.*,
                i.name as itemName,
                i.sku as itemSku,
                w.name as warehouseName
             FROM requests r
             JOIN inventory i ON r.inventoryId = i.id
             JOIN warehouses w ON r.warehouseId = w.id
             ORDER BY r.createdAt DESC`
        );
    }
}

export default RequestRepository.getInstance();