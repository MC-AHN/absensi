import { db } from "./index.js";
import { users } from "./schema.js";
import bcrypt from "bcryptjs";

const seed = async () => {
    try {
        console.log("Sedding data...");

        const hashedPassword = await bcrypt.hash("123456", 10);

        await db.insert(users).values([{
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            is_active: true,
        },
        {
            name: "Budi",
            email: "budi@gmail.com",
            password: hashedPassword,
            role: "user",
            is_active: true,
        },
    ]);

    console.log("Seed Completed");
    process.exit(0);
    } catch (err) {
        console.error("Seed Error:", err);
        process.exit(1);
    }
};

seed()