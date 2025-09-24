import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, message, botField } = req.body || {};
      if (botField) return res.json({ ok: true }); // honeypot

      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return res.status(400).json({ error: "Missing fields" });
      }
      if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY not set" });
      if (!process.env.CONTACT_TO_EMAIL) return res.status(500).json({ error: "CONTACT_TO_EMAIL not set" });
      if (!resend) return res.status(500).json({ error: "Email service not configured" });

      const TO = process.env.CONTACT_TO_EMAIL!;
      const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>"; // good for testing

      const escapeHTML = (s: string) =>
        s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!));

      const text = `New message from ${name} <${email}>\n\n${message}`;
      const html = `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
          <h2>New Quick-Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHTML(name)}</p>
          <p><strong>Email:</strong> ${escapeHTML(email)}</p>
          <pre style="white-space:pre-wrap;background:#0b1020;padding:12px;border-radius:8px;border:1px solid #1f2937;color:#e5e7eb">${escapeHTML(message)}</pre>
        </div>`;

      const { data, error } = await resend.emails.send({
        from: FROM,
        to: [TO],
        subject: `New message from ${name}`,
        replyTo: email, // camelCase
        html,
        text,
      });

      if (error) {
        console.error("[resend] send error:", error);
        // Resend error objects usually have statusCode; fall back to status or 500
        const status =
          (error as { statusCode?: number; status?: number }).statusCode ??
          (error as { statusCode?: number; status?: number }).status ??
          500;

        return res.status(status).json({
          error: (error as { message?: string }).message ?? "Resend send failed",
          code: (error as { name?: string }).name ?? "UnknownError",
        });

      }

      return res.json({ ok: true, id: data?.id });
    } catch (err) {
      next(err);
    }
  });

  return createServer(app);
}
