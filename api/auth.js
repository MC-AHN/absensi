import { Hono } from "hono";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createToken, verifyToken } from "../lib/jwt.js";

const auth = new Hono();

auth.post("/login", async (c) => {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
        return c.json({ message: 'Email and Password wajib diisi' }, 400);
    }

    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    const user = result[0];

    if (!user) {
        return c.json({ message: "User is not found" }, 401);
    }

    if (!user.is_active) {
        return c.json({ message: 'account is not active' }, 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return c.json({ message: "Wrong Password" }, 401);
    }

    const token = await createToken({
        id: user.id,
        name: user.name,
        role: user.role,
    });

    setCookie(c, 'session_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: 'Lax',
    });

    return c.json({
        message: "Login succesed",
        role: user.role,
    });
});

auth.post("/logout", async (c) => {
    deleteCookie(c, 'session_token', { path: '/' });
    return c.json({
        message: "Logout succeed"
    });
});

auth.get("/me", async (c) => {
    const token = getCookie(c, 'session_token');

    if (!token) {
        return c.json({ message: "Unauthorized " }, 401);
    }

    try {
        const user = await verifyToken(token);
        return c.json({ user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return c.json({ message: 'Session invalid or expired' }, 401);
    }
});

export { auth };