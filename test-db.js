import { db } from "./db/index.js";
import { users } from "./db/schema.js";

const run = async () => {
    const result = await db.select().from(users);
    console.log(result);
};

run();