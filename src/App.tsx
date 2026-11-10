import { useCallback, useEffect, useState } from "react";
import "./App.scss";
import Header from "./components/Header";
import DayTabs from "./components/DayTabs";
import Table from "./components/Table";
import Timer from "./components/Timer";
import Settings from "./components/Settings";
import ConfirmDialog from "./components/ConfirmDialog";
import { alarm, unlockAudio } from "./lib/audio";
import { contrastColor } from "./lib/color";
import {
  SETTINGS_KEY,
  WORKOUT_KEY,
  defaultSettings,
  defaultWorkout,
  loadSettings,
  loadWorkout,
  newDay,
  newExercise,
  sanitizeSettings,
  sanitizeWorkout,
} from "./lib/storage";
import { useStoredState } from "./lib/useStoredState";
import type { ConfirmRequest, Day, Exercise, RestState, Settings as SettingsData, Workout } from "./lib/types";

function App() {
  const [workout, setWorkout] = useStoredState<Workout>(WORKOUT_KEY, loadWorkout);
  const [settings, setSettings] = useStoredState<SettingsData>(SETTINGS_KEY, loadSettings);
  const [rest, setRest] = useState<RestState | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const activeDay = workout.days.find((d) => d.id === workout.activeDayId) ?? workout.days[0];

  // Tema e colore: sul <html> così valgono anche per dialog e sfondo della pagina.
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", settings.theme);
    root.style.setProperty("--accent", settings.accent);
    root.style.setProperty("--accent-contrast", contrastColor(settings.accent));
  }, [settings.theme, settings.accent]);

  // --- giorni ---

  const updateDay = (dayId: string, fn: (day: Day) => Day) =>
    setWorkout((w) => ({ ...w, days: w.days.map((d) => (d.id === dayId ? fn(d) : d)) }));

  const selectDay = (id: string) => setWorkout((w) => ({ ...w, activeDayId: id }));

  const addDay = () =>
    setWorkout((w) => {
      const day = newDay(`Giorno ${w.days.length + 1}`);
      return { days: [...w.days, day], activeDayId: day.id };
    });

  const deleteDay = () =>
    setWorkout((w) => {
      if (w.days.length <= 1) return w;
      const index = w.days.findIndex((d) => d.id === activeDay.id);
      const days = w.days.filter((d) => d.id !== activeDay.id);
      return { days, activeDayId: days[Math.max(0, index - 1)].id };
    });

  // --- esercizi ---

  const patchExercise = (exerciseId: string, patch: Partial<Exercise>) =>
    updateDay(activeDay.id, (d) => ({
      ...d,
      exercises: d.exercises.map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)),
    }));

  const addExercise = () =>
    updateDay(activeDay.id, (d) => {
      // Il nuovo esercizio eredita il recupero dell'ultimo: di solito è lo stesso per tutta la scheda.
      const last = d.exercises[d.exercises.length - 1];
      return { ...d, exercises: [...d.exercises, { ...newExercise(), rest: last?.rest ?? 90 }] };
    });

  const deleteExercise = (exerciseId: string) =>
    updateDay(activeDay.id, (d) => ({ ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }));

  const moveExercise = (exerciseId: string, direction: -1 | 1) =>
    updateDay(activeDay.id, (d) => {
      const from = d.exercises.findIndex((e) => e.id === exerciseId);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= d.exercises.length) return d;
      const exercises = [...d.exercises];
      [exercises[from], exercises[to]] = [exercises[to], exercises[from]];
      return { ...d, exercises };
    });

  const resetProgress = () =>
    updateDay(activeDay.id, (d) => ({ ...d, exercises: d.exercises.map((e) => ({ ...e, done: 0 })) }));

  // --- recupero ---

  const startRest = useCallback((seconds: number, label: string) => {
    unlockAudio();
    setRest({ endsAt: Date.now() + seconds * 1000, total: seconds, label });
  }, []);

  const adjustRest = useCallback((delta: number) => {
    setRest((r) => (r ? { ...r, endsAt: r.endsAt + delta * 1000, total: Math.max(1, r.total + delta) } : r));
  }, []);

  const closeRest = useCallback(() => setRest(null), []);

  const finishRest = useCallback(() => alarm(settings.sound), [settings.sound]);

  const toggleSet = (exercise: Exercise, setIndex: number) => {
    const marking = setIndex >= exercise.done;
    patchExercise(exercise.id, { done: marking ? setIndex + 1 : setIndex });
    if (marking && settings.autoRest && exercise.rest > 0) {
      startRest(exercise.rest, exercise.name || "Recupero");
    }
  };

  // --- impostazioni e dati ---

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ app: "gym-card", version: 2, workout, settings }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scheda-palestra-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    let imported: Workout | null = null;
    let importedSettings: unknown;
    try {
      const data: unknown = JSON.parse(await file.text());
      const source = data && typeof data === "object" ? (data as { workout?: unknown; settings?: unknown }) : {};
      imported = sanitizeWorkout(source.workout);
      importedSettings = source.settings;
    } catch {
      imported = null;
    }

    if (!imported) {
      setConfirm({
        title: "File non valido",
        message: "Scegli un backup esportato da questa app (file .json).",
        confirmLabel: "Ok",
        cancelLabel: null,
      });
      return;
    }

    const workoutToImport = imported;
    setConfirm({
      title: "Importare il backup?",
      message: "La scheda attuale verrà sostituita da quella del file.",
      confirmLabel: "Importa",
      onConfirm: () => {
        setWorkout(workoutToImport);
        if (importedSettings) setSettings(sanitizeSettings(importedSettings));
        setRest(null);
        setSettingsOpen(false);
      },
    });
  };

  const resetAll = () => {
    setWorkout(defaultWorkout());
    setSettings(defaultSettings());
    setRest(null);
    setSettingsOpen(false);
  };

  // --- richieste di conferma (al posto di window.confirm) ---

  const requestDeleteDay = () =>
    setConfirm({
      title: "Eliminare il giorno?",
      message: `"${activeDay.name || "Giorno"}" e tutti i suoi esercizi verranno eliminati.`,
      confirmLabel: "Elimina",
      danger: true,
      onConfirm: deleteDay,
    });

  const requestDeleteExercise = (exerciseId: string) => {
    const exercise = activeDay.exercises.find((e) => e.id === exerciseId);
    setConfirm({
      title: "Eliminare l'esercizio?",
      message: `"${exercise?.name || "Esercizio senza nome"}" verrà rimosso dalla scheda.`,
      confirmLabel: "Elimina",
      danger: true,
      onConfirm: () => deleteExercise(exerciseId),
    });
  };

  const requestResetAll = () =>
    setConfirm({
      title: "Cancellare tutto?",
      message: "Scheda e impostazioni verranno eliminate da questo dispositivo. L'azione non si può annullare.",
      confirmLabel: "Cancella tutto",
      danger: true,
      onConfirm: resetAll,
    });

  const closeConfirm = () => setConfirm(null);

  const acceptConfirm = () => {
    const action = confirm?.onConfirm;
    setConfirm(null);
    action?.();
  };

  return (
    <div className="app">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="app__main">
        <DayTabs
          days={workout.days}
          activeDayId={activeDay.id}
          onSelect={selectDay}
          onAdd={addDay}
          onRename={(name) => updateDay(activeDay.id, (d) => ({ ...d, name }))}
          onDelete={requestDeleteDay}
        />
        <Table
          day={activeDay}
          onChange={patchExercise}
          onToggleSet={toggleSet}
          onMove={moveExercise}
          onDelete={requestDeleteExercise}
          onAdd={addExercise}
          onResetProgress={resetProgress}
        />
      </main>
      <Timer rest={rest} onStart={startRest} onAdjust={adjustRest} onClose={closeRest} onFinish={finishRest} />
      <Settings
        open={settingsOpen}
        settings={settings}
        onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
        onClose={() => setSettingsOpen(false)}
        onExport={exportData}
        onImport={importData}
        onReset={requestResetAll}
      />
      {confirm && <ConfirmDialog request={confirm} onCancel={closeConfirm} onConfirm={acceptConfirm} />}
    </div>
  );
}

export default App;
