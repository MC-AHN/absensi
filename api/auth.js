import { Hono } from "hono";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const auth = new Hono();

const sessions = new Map();

auth.post("/login", async (c) => {
    const body = await c.req.json();
    const {email, password} = body;

    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    const user = result[0];

    if (!user) {
        return c.json({ message: "User is not found" }, 401);    
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return c.json({ message: "Wrong Password" }, 401);
    }

    const token = uuidv4();

    sessions.ser(token, user);

    return c.json({
        message: "Login succesed",
        token,
    });
});

auth.post("/logout", async (c) => {
    const token = c.req.header("Authorization");

    sessions.delete(token);

    return c.json({
        message: "Logout succeed"
    });
});

export { auth, sessions };