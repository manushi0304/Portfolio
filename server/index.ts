import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------- Tiny API logger with safe res.json wrapper ----------
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let captured: unknown;

  // Keep original json and its exact signature: (body?: any) => this
  const origJson = res.json.bind(res) as typeof res.json;

  // Reassign with same signature so TS is happy
  res.json = ((body?: any) => {
    captured = body;
    return origJson(body);
  }) as typeof res.json;

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;
    const duration = Date.now() - start;
    let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (captured !== undefined) {
      const s = JSON.stringify(captured);
      line += ` :: ${s.length > 300 ? s.slice(0, 297) + "…" : s}`;
    }
    log(line);
  });

  next();
});

// ---------- Bootstrap ----------
(async () => {
  // registerRoutes should attach routes and return an http.Server
  const server = await registerRoutes(app);

  // Central error handler (after routes/middleware)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    log(`error ${status}: ${message}`);
    res.status(status).json({ message });
  });

  // Dev uses Vite middleware; Prod serves prebuilt assets
  const isDev = app.get("env") === "development" || process.env.NODE_ENV === "development";
  if (isDev) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Bind to all interfaces for cloud; default port 3001 (works with your Vite proxy)
  const port = parseInt(process.env.PORT ?? "3001", 10);
  const host = (process.env.HOST ?? "0.0.0.0").trim();

  server.on("error", (err: any) => {
    log(`listen error: ${err?.code || ""} ${err?.message || err}`);
  });

  // Listen ONCE
  server.listen({ port, host }, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
