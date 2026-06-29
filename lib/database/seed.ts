import inventoryRepository from "./repositories/InventoryRepository";
import journeyRepository from "./repositories/JourneyRepository";
import requestRepository from "./repositories/RequestRepository";
import userRepository from "./repositories/UserRepository";
import warehouseRepository from "./repositories/WarehouseRepository";

export async function seedDatabase() {
    // Seed Users and Journeys
    const journeys = await journeyRepository.getAll();

    if (journeys.length === 0) { // Only seed if journeys table is empty
        console.log("Seeding users and journeys...");

        const user1 = await userRepository.create({
            name: "Harsh",
            email: "harsh@test.com",
            phone: "9999999999",
            password: "123456",
        });

        const user2 = await userRepository.create({
            name: "Rahul",
            email: "rahul@test.com",
            phone: "8888888888",
            password: "123456",
        });

        const user3 = await userRepository.create({
            name: "Amit",
            email: "amit@test.com",
            phone: "7777777777",
            password: "123456",
        });

        await journeyRepository.create({
            userId: user1.id,
            source: "Delhi",
            destination: "Jaipur",
            date: "2026-06-30",
            status: "Pending",
        });

        await journeyRepository.create({
            userId: user1.id,
            source: "Delhi",
            destination: "Agra",
            date: "2026-07-01",
            status: "Visited",
        });

        await journeyRepository.create({
            userId: user2.id,
            source: "Mumbai",
            destination: "Pune",
            date: "2026-07-02",
            status: "Pending",
        });

        await journeyRepository.create({
            userId: user3.id,
            source: "Bangalore",
            destination: "Chennai",
            date: "2026-07-03",
            status: "Visited",
        });

        console.log("Database seeded with users and journeys.");
    }

    // Seed Warehouses
    const warehouses = await warehouseRepository.getAll();
    if (warehouses.length === 0) {
        console.log("Seeding warehouses...");
        const centralWarehouse = await warehouseRepository.create({ name: "Central Warehouse", location: "Delhi" });
        const northWarehouse = await warehouseRepository.create({ name: "North Region Hub", location: "Chandigarh" });
        await warehouseRepository.create({ name: "West Region Hub", location: "Mumbai" });

        console.log("Seeding inventory for warehouses...");
        // Central Warehouse Inventory
        await inventoryRepository.create({ name: "Cement Bags (50kg)", sku: "CEM-50KG-DEL", price: 350.50, quantity: 150, warehouseId: centralWarehouse.id });
        await inventoryRepository.create({ name: "Steel Rods (12mm)", sku: "STL-12MM-DEL", price: 65.00, quantity: 300, warehouseId: centralWarehouse.id });

        // North Region Hub Inventory
        await inventoryRepository.create({ name: "Cement Bags (50kg)", sku: "CEM-50KG-CHD", price: 360.00, quantity: 50, warehouseId: northWarehouse.id });
        await inventoryRepository.create({ name: "Bricks (Red Clay)", sku: "BRK-RED-CHD", price: 8.75, quantity: 8000, warehouseId: northWarehouse.id });

        console.log("Database seeded with warehouses and inventory.");
    }

    // Seed Requests
    const requests = await requestRepository.getAllWithInventoryDetails();
    if (requests.length === 0) {
        console.log("Seeding requests...");
        const allInventory = await inventoryRepository.getAll();
        const allWarehouses = await warehouseRepository.getAll();

        const cementDelhi = allInventory.find(i => i.sku === 'CEM-50KG-DEL');
        const bricksChandigarh = allInventory.find(i => i.sku === 'BRK-RED-CHD');
        const westWarehouse = allWarehouses.find(w => w.name === 'West Region Hub');

        if (cementDelhi && bricksChandigarh && westWarehouse) {
            // Create a pending request
            await requestRepository.create({ inventoryId: cementDelhi.id, warehouseId: westWarehouse.id, quantity: 20 });
            // Create another pending request
            await requestRepository.create({ inventoryId: bricksChandigarh.id, warehouseId: westWarehouse.id, quantity: 500 });
        }
        console.log("Database seeded with initial requests.");
    }
}