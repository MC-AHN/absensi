import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { auth } from "./api/auth.js";
import { admin } from "./api/admin.js";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Word!");
});

app.get("/about", (c) => {
    return c.text("this is about page")
})

app.get("/api", (c) => {
    return c.json({
        message: "API Is Running"
    })
})

app.route("/auth", auth);
app.route("/admin", admin);

const PORT = 8000;

console.log(`Server run at http://localhost:${PORT}`);

serve({
    fetch: app.fetch,
    port: PORT
});