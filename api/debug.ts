import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    runtime: process.env.VERCEL ? "vercel" : "local",
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasFrom: !!process.env.CONTACT_FROM_EMAIL,
    hasTo: !!process.env.CONTACT_TO_EMAIL,
    node: process.version
  });
}
