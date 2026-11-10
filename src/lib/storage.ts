import type { Day, Exercise, Settings, ThemeMode, Workout } from "./types";

export const WORKOUT_KEY = "gymcard.workout.v2";
export const SETTINGS_KEY = "gymcard.settings.v2";
export const DEFAULT_ACCENT = "#7c5cff";

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const newExercise = (): Exercise => ({
  id: uid(),
  name: "",
  sets: 3,
  reps: "",
  weight: "",
  rest: 90,
  note: "",
  done: 0,
});

export const newDay = (name: string): Day => ({ id: uid(), name, exercises: [] });

export const defaultWorkout = (): Workout => {
  const day = newDay("Giorno 1");
  return { days: [day], activeDayId: day.id };
};

export const defaultSettings = (): Settings => ({
  theme: "auto",
  accent: DEFAULT_ACCENT,
  autoRest: true,
  sound: true,
});

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

const toInt = (value: unknown, fallback: number, min: number, max: number): number => {
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};

const str = (value: unknown): string => (typeof value === "string" ? value : "");

/** "90", "1:30", "2 min", "45s" → secondi. Testo non riconosciuto → fallback. */
export function parseRest(text: string, fallback = 90): number {
  const t = text.trim().toLowerCase().replace(",", ".");
  if (!t) return fallback;
  const clock = t.match(/^(\d+):(\d{1,2})$/);
  if (clock) return parseInt(clock[1], 10) * 60 + parseInt(clock[2], 10);
  const num = t.match(/(\d+(?:\.\d+)?)/);
  if (!num) return fallback;
  const value = parseFloat(num[1]);
  return /(m|min|')/.test(t.slice(num.index! + num[1].length)) ? Math.round(value * 60) : Math.round(value);
}

function sanitizeExercise(raw: unknown): Exercise | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const sets = toInt(r.sets, 3, 1, 20);
  return {
    id: str(r.id) || uid(),
    name: str(r.name),
    sets,
    reps: str(r.reps),
    weight: str(r.weight),
    rest: toInt(r.rest, 90, 0, 3600),
    note: str(r.note),
    done: toInt(r.done, 0, 0, sets),
  };
}

export function sanitizeWorkout(raw: unknown): Workout | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { days?: unknown; activeDayId?: unknown };
  if (!Array.isArray(r.days)) return null;
  const days: Day[] = r.days
    .map((d): Day | null => {
      if (!d || typeof d !== "object") return null;
      const dd = d as { id?: unknown; name?: unknown; exercises?: unknown };
      return {
        id: str(dd.id) || uid(),
        name: str(dd.name) || "Giorno",
        exercises: Array.isArray(dd.exercises)
          ? dd.exercises.map(sanitizeExercise).filter((e): e is Exercise => e !== null)
          : [],
      };
    })
    .filter((d): d is Day => d !== null);
  if (days.length === 0) return null;
  const active = days.some((d) => d.id === r.activeDayId) ? (r.activeDayId as string) : days[0].id;
  return { days, activeDayId: active };
}

export function sanitizeSettings(raw: unknown): Settings {
  const base = defaultSettings();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;
  const theme: ThemeMode = r.theme === "light" || r.theme === "dark" || r.theme === "auto" ? r.theme : base.theme;
  return {
    theme,
    accent: isHexColor(r.accent) ? r.accent : base.accent,
    autoRest: typeof r.autoRest === "boolean" ? r.autoRest : base.autoRest,
    sound: typeof r.sound === "boolean" ? r.sound : base.sound,
  };
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Dati della vecchia versione dell'app (chiavi `tableData`, `colorTheme`, `primaryColor`). */
function migrateLegacyWorkout(): Workout | null {
  const legacy = readJson("tableData");
  if (!Array.isArray(legacy)) return null;
  const exercises: Exercise[] = legacy
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const r = row as { nome?: unknown; ripetizioni?: unknown; recupero?: unknown };
      return { nome: str(r.nome), ripetizioni: str(r.ripetizioni), recupero: str(r.recupero) };
    })
    .filter((row) => row.nome || row.ripetizioni || row.recupero)
    .map((row) => ({
      ...newExercise(),
      name: row.nome,
      reps: row.ripetizioni,
      rest: parseRest(row.recupero),
    }));
  if (exercises.length === 0) return null;
  const day: Day = { id: uid(), name: "Giorno 1", exercises };
  return { days: [day], activeDayId: day.id };
}

function migrateLegacySettings(): Settings | null {
  const theme = readJson("colorTheme");
  const accent = readJson("primaryColor");
  if (theme === null && accent === null) return null;
  const base = defaultSettings();
  return {
    ...base,
    theme: theme === "light" ? "light" : theme === "dark" ? "dark" : base.theme,
    accent: isHexColor(accent) ? accent : base.accent,
  };
}

export const loadWorkout = (): Workout =>
  sanitizeWorkout(readJson(WORKOUT_KEY)) ?? migrateLegacyWorkout() ?? defaultWorkout();

export const loadSettings = (): Settings => {
  const saved = readJson(SETTINGS_KEY);
  return saved ? sanitizeSettings(saved) : (migrateLegacySettings() ?? defaultSettings());
};

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota piena o storage disabilitato: l'app continua a funzionare, senza salvataggio.
  }
}
