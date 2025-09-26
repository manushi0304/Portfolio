import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    const raw = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
    const { name, email, message, botField } = raw as { name?: string; email?: string; message?: string; botField?: string };

    if (botField) return res.status(200).json({ ok: true }); // honeypot

    if (!name?.trim() || !emailRe.test(email ?? "") || !message?.trim()) {
      return res.status(400).json({ ok: false, error: "Invalid input." });
    }

    const resend = new Resend(process.env.RESEND_API_KEY as string);

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL as string, // e.g. 'Portfolio <onboarding@resend.dev>'
      to: [process.env.CONTACT_TO_EMAIL as string],
      subject: `New message from ${name}`,
      replyTo: email, // snake_case for resend@6
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>New portfolio message</h2>
          <p><b>Name:</b> ${esc(name)}</p>
          <p><b>Email:</b> ${esc(email)}</p>
          <p><b>Message:</b></p>
          <pre style="white-space:pre-wrap">${esc(message)}</pre>
        </div>`
    });

    if (error) {
      console.error("RESEND_ERROR:", error);
      return res.status(500).json({ ok: false, error: error.message ?? "Email send failed." });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("CONTACT_HANDLER_ERROR:", e);
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error." });
  }
}

function esc(s?: string) {
  return String(s ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
