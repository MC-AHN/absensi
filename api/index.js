import { Hono } from "hono";

import { auth } from "./auth.js";
import { admin } from "./admin.js";
import { user } from "./user.js";
import { serveStatic } from "hono/serve-static";

const app = new Hono();

app.route("/api/auth", auth);
app.route("/api/admin", admin);
app.route("/api/user", user);

app.use("/*", serveStatic({ root:"./public"  }))

export default app;