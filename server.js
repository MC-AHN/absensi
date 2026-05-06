import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { auth } from "./api/auth.js";
import { admin } from "./api/admin.js";
import { user } from "./api/user.js";

const app = new Hono();


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
app.route("/user", user);

const PORT = 8000;

console.log(`Server run at http://localhost:${PORT}`);

app.get("/*", serveStatic({ root: "./public" }));

serve({
    fetch: app.fetch,
    port: PORT
});