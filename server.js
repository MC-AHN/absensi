import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Word!");
});

const PORT = 8000;

console.log(`Server run at http://localhost:${PORT}`);

serve({
    fetch: app.fetch,
    port: PORT
});