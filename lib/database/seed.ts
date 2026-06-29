import inventoryRepository from "./repositories/InventoryRepository";
import journeyRepository from "./repositories/JourneyRepository";
import userRepository from "./repositories/UserRepository";

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

    // Seed Inventory
    const inventoryItems = await inventoryRepository.getAll();
    if (inventoryItems.length === 0) { // Only seed if inventory table is empty
        console.log("Seeding inventory...");
        await inventoryRepository.create({ name: "Cement Bags (50kg)", sku: "CEM-50KG", quantity: 200, price: 350.50 });
        await inventoryRepository.create({ name: "Steel Rods (12mm)", sku: "STL-12MM", quantity: 500, price: 65.00 });
        await inventoryRepository.create({ name: "Bricks (Red Clay)", sku: "BRK-RED", quantity: 10000, price: 8.75 });
        await inventoryRepository.create({ name: "Sand (per Tonne)", sku: "SND-TNE", quantity: 50, price: 1200.00 });
        console.log("Database seeded with inventory items.");
    }
}