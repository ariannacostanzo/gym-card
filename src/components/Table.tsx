import ExerciseCard from "./ExerciseCard";
import { PlusIcon } from "./Icons";
import type { Day, Exercise } from "../lib/types";

interface TableProps {
  day: Day;
  onChange: (exerciseId: string, patch: Partial<Exercise>) => void;
  onToggleSet: (exercise: Exercise, setIndex: number) => void;
  onMove: (exerciseId: string, direction: -1 | 1) => void;
  onDelete: (exerciseId: string) => void;
  onAdd: () => void;
  onResetProgress: () => void;
}

const Table: React.FC<TableProps> = ({ day, onChange, onToggleSet, onMove, onDelete, onAdd, onResetProgress }) => {
  const totalSets = day.exercises.reduce((sum, e) => sum + e.sets, 0);
  const doneSets = day.exercises.reduce((sum, e) => sum + e.done, 0);
  const percent = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <section className="table" aria-label="Esercizi">
      {day.exercises.length > 0 && (
        <div className="progress">
          <div className="progress__row">
            <span>
              {doneSets} / {totalSets} serie
            </span>
            <button type="button" className="link-button" onClick={onResetProgress} disabled={doneSets === 0}>
              Nuovo allenamento
            </button>
          </div>
          <div
            className="progress__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div className="progress__fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      {day.exercises.length === 0 && (
        <div className="empty">
          <p>Nessun esercizio in questo giorno.</p>
          <p className="empty__hint">Aggiungi il primo per iniziare a compilare la scheda.</p>
        </div>
      )}

      <div className="table__list">
        {day.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            total={day.exercises.length}
            onChange={(patch) => onChange(exercise.id, patch)}
            onToggleSet={(setIndex) => onToggleSet(exercise, setIndex)}
            onMove={(direction) => onMove(exercise.id, direction)}
            onDelete={() => onDelete(exercise.id)}
          />
        ))}
      </div>

      <button type="button" className="button button--ghost table__add" onClick={onAdd}>
        <PlusIcon /> Aggiungi esercizio
      </button>
    </section>
  );
};

export default Table;
