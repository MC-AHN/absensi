import { Hono } from "hono";

import { auth } from "./auth.js";
import { admin } from "./admin.js";
import { user } from "./user.js";
import { serveStatic } from "hono/serve-static";

const app = new Hono();

app.route("/auth", auth);
app.route("/admin", admin);
app.route("/user", user);

app.use("/*", serveStatic({ root:"./public"  }))

export default app;