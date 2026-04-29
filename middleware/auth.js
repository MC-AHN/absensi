import { getCookie } from "hono/cookie";
import { verifyToken } from "../lib/jwt.js"

export const authMiddleware = async (c, next) => {
    const token = getCookie(c, 'session_token');

    if (!token) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    try {
        const user = await verifyToken(token);
    
        if (!user) {
            return c.json({ message: "Invalid Token" }, 401);
        }
    
        c.set("user", { id: user.id, name: user.name, role: user.role });
    
        await next();
    } catch (err) {
        console.error('JWT Verification Error:', e.message);
        return c.json({ message: 'Session invalid or expired' }, 401);
    }
};