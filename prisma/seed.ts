import {
    PrismaClient,
    Role,
    DeliveryType,
    RequestStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

/* ---------------- Prisma v7 adapter setup ---------------- */

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

/* ---------------- Seed logic ---------------- */

async function main() {
    /* ---------- Seed Users ---------- */
    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
        {
            name: "Vijay",
            email: "ramukadam15@gmail.com",
            password: hashedPassword,
            role: Role.BUYER,
            location: "Bangalore, Karnataka",
            phone: "9876543210",
        },
        {
            name: "Dev",
            email: "maheshappa.me23@rvce.edu.in",
            password: hashedPassword,
            role: Role.BUYER,
            location: "Delhi",
            phone: "9876543211",
        },
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                name: u.name,
                password: u.password,
                role: u.role,
                location: u.location,
                phone: u.phone,
            },
            create: u,
        });

        console.log(`✅ Upserted user: ${user.name} (${user.email})`);
    }

    /* ---------- Fetch Buyers ---------- */
    const vijay = await prisma.user.findUnique({
        where: { email: "ramukadam15@gmail.com" },
    });
    const dev = await prisma.user.findUnique({
        where: { email: "maheshappa.me23@rvce.edu.in" },
    });

    if (!vijay || !dev) {
        throw new Error("Seed users not found");
    }

    /* ---------- Clear Existing Requests ---------- */
    await prisma.purchaseRequest.deleteMany({
        where: {
            buyerId: { in: [vijay.id, dev.id] },
        },
    });

    /* ---------- Seed Purchase Requests ---------- */
    const requests = [
        {
            buyerId: vijay.id,
            cropType: "Basmati Rice (Pusa 1121)",
            quantityRequired: 5000,
            quantityRemaining: 5000,
            pricePerKg: 85,
            location: "Karnal, Haryana",
            deliveryType: DeliveryType.BUYER_PICKUP,
            instructions: "Need moisture content below 12%. Output of 2024 harvest.",
        },
        {
            buyerId: vijay.id,
            cropType: "Nagpur Oranges",
            quantityRequired: 2000,
            quantityRemaining: 1500,
            pricePerKg: 45,
            location: "Pune, Maharashtra",
            deliveryType: DeliveryType.BUYER_PICKUP,
            instructions: "Need Grade A sweet oranges.",
        },
        {
            buyerId: dev.id,
            cropType: "Nashik Red Onions",
            quantityRequired: 10000,
            quantityRemaining: 10000,
            pricePerKg: 18,
            location: "Mumbai, Maharashtra",
            deliveryType: DeliveryType.FARMER_DELIVER,
            instructions: "Medium size bulbs preferred. No sprouting.",
        },
        {
            buyerId: dev.id,
            cropType: "Guntur Chilli (Teja)",
            quantityRequired: 1000,
            quantityRemaining: 1000,
            pricePerKg: 210,
            location: "Guntur, Andhra Pradesh",
            deliveryType: DeliveryType.BUYER_PICKUP,
            instructions: "High heat value required. Sun dried.",
        },
        {
            buyerId: dev.id,
            cropType: "Turmeric (Haldi)",
            quantityRequired: 500,
            quantityRemaining: 500,
            pricePerKg: 90,
            location: "Erode, Tamil Nadu",
            deliveryType: DeliveryType.FARMER_DELIVER,
            instructions:
                "Organic certification required. High curcumin content.",
        },
    ];

    for (const req of requests) {
        await prisma.purchaseRequest.create({
            data: {
                ...req,
                status: RequestStatus.ACTIVE,
            },
        });
    }

    console.log(`✅ Seeded ${requests.length} purchase requests`);
}

/* ---------------- Run safely ---------------- */

main()
    .catch((error) => {
        console.error("❌ Seed error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
