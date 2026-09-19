export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  maxCombo: number;
  date: string;
}

const KEY = "rmm-festive-catch-scores-v1";
const NAME_KEY = "rmm-festive-catch-name";
export const MAX_ENTRIES = 10;

function safeParse(raw: string | null): ScoreEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is ScoreEntry =>
        !!e && typeof e === "object" && typeof (e as ScoreEntry).score === "number" && typeof (e as ScoreEntry).name === "string",
    );
  } catch {
    return [];
  }
}

function sortEntries(list: ScoreEntry[]) {
  return [...list].sort((a, b) => b.score - a.score || b.maxCombo - a.maxCombo || a.date.localeCompare(b.date)).slice(0, MAX_ENTRIES);
}

export function loadScores(): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  return sortEntries(safeParse(window.localStorage.getItem(KEY)));
}

function persist(list: ScoreEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore quota / privacy mode errors */
  }
}

export function saveScore(entry: Omit<ScoreEntry, "id" | "date">): { list: ScoreEntry[]; id: string; rank: number } {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const full: ScoreEntry = { ...entry, id, date: new Date().toISOString() };
  const list = sortEntries([...loadScores(), full]);
  persist(list);
  return { list, id, rank: list.findIndex((e) => e.id === id) };
}

export function renameScore(id: string, name: string): ScoreEntry[] {
  const list = loadScores().map((e) => (e.id === id ? { ...e, name } : e));
  persist(list);
  return list;
}

export function bestScore(): number {
  return loadScores()[0]?.score ?? 0;
}

export function loadName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function saveName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}
