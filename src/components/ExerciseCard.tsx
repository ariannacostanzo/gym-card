import { ArrowDownIcon, ArrowUpIcon, CheckIcon, TrashIcon } from "./Icons";
import type { Exercise } from "../lib/types";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  onChange: (patch: Partial<Exercise>) => void;
  onToggleSet: (setIndex: number) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}

const clampInt = (value: string, min: number, max: number, fallback: number): number => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  total,
  onChange,
  onToggleSet,
  onMove,
  onDelete,
}) => {
  const complete = exercise.done >= exercise.sets;

  return (
    <article className={`exercise${complete ? " exercise--complete" : ""}`}>
      <div className="exercise__top">
        <span className="exercise__index">{complete ? <CheckIcon /> : index + 1}</span>
        <input
          className="input exercise__name"
          type="text"
          value={exercise.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nome esercizio"
          aria-label="Nome esercizio"
        />
        <div className="exercise__actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Sposta su"
          >
            <ArrowUpIcon />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Sposta giù"
          >
            <ArrowDownIcon />
          </button>
          <button
            type="button"
            className="icon-button icon-button--danger"
            onClick={onDelete}
            aria-label="Elimina esercizio"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="exercise__fields">
        <label className="field field--sets">
          <span className="field__label">Serie</span>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={exercise.sets}
            onChange={(e) => {
              const sets = clampInt(e.target.value, 1, 20, exercise.sets);
              onChange({ sets, done: Math.min(exercise.done, sets) });
            }}
          />
        </label>
        <label className="field field--reps">
          <span className="field__label">Rip.</span>
          <input
            className="input"
            type="text"
            value={exercise.reps}
            onChange={(e) => onChange({ reps: e.target.value })}
            placeholder="10"
          />
        </label>
        <label className="field field--kg">
          <span className="field__label">Kg</span>
          <input
            className="input"
            type="text"
            inputMode="decimal"
            value={exercise.weight}
            onChange={(e) => onChange({ weight: e.target.value })}
            placeholder="—"
          />
        </label>
        <label className="field field--rest">
          <span className="field__label">Rec. (s)</span>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            min={0}
            max={3600}
            step={15}
            value={exercise.rest}
            onChange={(e) => onChange({ rest: clampInt(e.target.value, 0, 3600, 0) })}
          />
        </label>
      </div>

      <div className="exercise__sets" role="group" aria-label="Serie completate">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`set${i < exercise.done ? " set--done" : ""}`}
            onClick={() => onToggleSet(i)}
            aria-pressed={i < exercise.done}
            aria-label={`Serie ${i + 1}`}
          >
            {i < exercise.done ? <CheckIcon /> : i + 1}
          </button>
        ))}
      </div>
    </article>
  );
};

export default ExerciseCard;
