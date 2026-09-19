import { desc } from "drizzle-orm";
import { db } from "@/db";
import { gameScores } from "@/db/schema";

export const dynamic = "force-dynamic";

async function topScores(limit = 10) {
  return db
    .select({
      id: gameScores.id,
      playerName: gameScores.playerName,
      score: gameScores.score,
      maxCombo: gameScores.maxCombo,
      createdAt: gameScores.createdAt,
    })
    .from(gameScores)
    .orderBy(desc(gameScores.score), desc(gameScores.maxCombo), desc(gameScores.createdAt))
    .limit(limit);
}

export async function GET() {
  try {
    const scores = await topScores();
    return Response.json({ ok: true, scores });
  } catch (error) {
    console.error("[scores] fetch failed", error);
    return Response.json({ ok: false, scores: [] }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: { name?: unknown; score?: unknown; maxCombo?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const rawName = typeof body.name === "string" ? body.name : "";
  const name = rawName.replace(/[^\p{L}\p{N} _.-]/gu, "").trim().slice(0, 24) || "Guest";
  const score = Number(body.score);
  const maxCombo = Number(body.maxCombo ?? 0);

  if (!Number.isFinite(score) || score < 0 || score > 5_000_000) {
    return Response.json({ ok: false, error: "Invalid score." }, { status: 400 });
  }

  try {
    await db.insert(gameScores).values({
      playerName: name,
      score: Math.round(score),
      maxCombo: Number.isFinite(maxCombo) ? Math.max(0, Math.round(maxCombo)) : 0,
    });
    const scores = await topScores();
    return Response.json({ ok: true, scores });
  } catch (error) {
    console.error("[scores] insert failed", error);
    return Response.json({ ok: false, error: "Leaderboard unavailable." }, { status: 503 });
  }
}
