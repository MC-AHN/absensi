import { Hono } from "hono";
import { db } from "../db/index.js";
import { attendances, users } from "../db/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";

const user = new Hono();

// helper: find user
async function findUser(identifier) {
    // can ID or email
    if (Number(identifier)) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, Number(identifier)));

        return result[0];
    }

    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, identifier));

    return result[0];
}

user.post('/check-in', async (c) => {
    const body = await c.req.json();
    const { identifier } = body;

    if (!identifier) {
        return c.json({ message: 'identifier required' }, 400);
    }

    const user = await findUser(identifier);

    if (!user) {
        return c.json({ message: 'User not foud' }, 404);
    }

    if (!user.is_active) {
        return c.json({ message: 'User is not active' }, 403);
    }

    const now = new Date();

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // check-in
    const existing = await db
        .select()
        .from(attendances)
        .where(
            and(
                eq(attendances.user_id, user.id),
                gte(attendances.check_in, start),
                lte(attendances.check_in, end),
            ),
        );

    if (existing.length > 0) {
        return c.json({ message: 'finally Check-in Today' }, 400);
    }

    await db.insert(attendances).values({
        user_id: user.id,
        check_in: now,
    });

    return c.json({
        message: `Check-in Complete (${user.name})`,
    });
});

user.post('/check-out', async (c) => {
    const body = await c.req.json();
    const { identifier } = body;

    if (!identifier) {
        return c.json({ message: 'identifier required!' }, 400);
    }

    const user = await findUser(identifier);

    const now = new Date();

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const exisiting = await db
        .select()
        .from(attendances)
        .where(
            and(
                eq(attendances.user_id, user.id),
                gte(attendances.check_in, start),
                lte(attendances.check_in, end),
            ),
        );

    const attendance = exisiting[0];

    if (!attendance) {
        return c.json({ message: "haven't checked in yet" }, 400);
    }

    if (attendance.check_out) {
        return c.json({ message: "already check out" }, 400);
    }

    await db
        .update(attendances)
        .set({ check_out: now })
        .where(eq(attendances.id, attendance.id));

    return c.json({
        message: `Check-out Complete (${user.name})`,
    });
});

export { user };