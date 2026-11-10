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

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel?: string;
  /** `null` = nessun pulsante "Annulla" (finestra solo informativa). */
  cancelLabel?: string | null;
  /** Pulsante di conferma rosso, per le azioni distruttive. */
  danger?: boolean;
  onConfirm?: () => void;
}
