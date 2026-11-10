export interface Exercise {
  id: string;
  name: string;
  /** Numero di serie previste. */
  sets: number;
  /** Testo libero ("10", "8-10", "30s"). */
  reps: string;
  /** Carico in kg, testo libero ("20", "12.5", "corpo libero"). */
  weight: string;
  /** Recupero tra le serie, in secondi (0 = nessun recupero automatico). */
  rest: number;
  note: string;
  /** Serie già completate nell'allenamento in corso. */
  done: number;
}

export interface Day {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Workout {
  days: Day[];
  activeDayId: string;
}

export type ThemeMode = "auto" | "light" | "dark";

export interface Settings {
  theme: ThemeMode;
  accent: string;
  /** Avvia il recupero quando si completa una serie. */
  autoRest: boolean;
  /** Suono + vibrazione a fine recupero. */
  sound: boolean;
}

export interface RestState {
  endsAt: number;
  total: number;
  label: string;
}
