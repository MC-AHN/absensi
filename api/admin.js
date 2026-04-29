import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const admin = new Hono();

admin.use("*", authMiddleware, adminOnly);

admin.get("/dashboard", (c) => {
    return c.json({
        message: "Welcome Admin",
    });
});

export { admin };