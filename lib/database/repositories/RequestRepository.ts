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
            `INSERT INTO requests (id, inventoryId, quantity, status, createdAt) VALUES (?, ?, ?, ?, ?)`,
            [request.id, request.inventoryId, request.quantity, request.status, request.createdAt]
        );

        return request;
    }

    /**
     * Get all requests with inventory item details
     */
    async getAllWithInventoryDetails(): Promise<(Request & { itemName: string; itemSku: string; })[]> {
        return await db.all<any>(
            `SELECT
                r.*,
                i.name as itemName,
                i.sku as itemSku
             FROM requests r
             JOIN inventory i ON r.inventoryId = i.id
             ORDER BY r.createdAt DESC`
        );
    }
}

export default RequestRepository.getInstance();