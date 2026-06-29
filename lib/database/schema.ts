export type User = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    password?: string | null; // The password hash, optional on the client-side user object
    createdAt: string;
    updatedAt: string;
};

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
    CREATE TABLE IF NOT EXISTS journeys (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    createdAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL,
    createdAt TEXT NOT NULL,
    warehouseId TEXT NOT NULL,
    FOREIGN KEY(warehouseId) REFERENCES warehouses(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    createdAt TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    inventoryId TEXT NOT NULL,
    warehouseId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    createdAt TEXT NOT NULL,
    FOREIGN KEY(inventoryId) REFERENCES inventory(id),
    FOREIGN KEY(warehouseId) REFERENCES warehouses(id)
);
`;

export interface Journey {
    id: string;
    userId: string;
    source: string;
    destination: string;
    date: string;
    status: "Pending" | "Visited";
    createdAt: string;
}

export interface Inventory {
    id: string;
    name: string;
    sku: string;
    price: number | null;
    quantity: number;
    warehouseId: string;
    createdAt: string;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string | null;
    createdAt: string;
}

export interface Request {
    id: string;
    inventoryId: string;
    warehouseId: string;
    quantity: number;
    status: "Pending" | "Confirmed";
    createdAt: string;
}