import { db } from "@/db";
import { enquiries } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { name?: unknown; phone?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return Response.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
    return Response.json({ ok: false, error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (message.length < 5 || message.length > 1000) {
    return Response.json({ ok: false, error: "Please tell us a little more (5–1000 characters)." }, { status: 400 });
  }

  try {
    await db.insert(enquiries).values({ name, phone, message });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[enquiries] insert failed", error);
    return Response.json(
      { ok: false, error: "We couldn't save your message right now. Please call or WhatsApp us." },
      { status: 500 },
    );
  }
}
