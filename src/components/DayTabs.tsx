import { PlusIcon, TrashIcon } from "./Icons";
import type { Day } from "../lib/types";

interface DayTabsProps {
  days: Day[];
  activeDayId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

const DayTabs: React.FC<DayTabsProps> = ({ days, activeDayId, onSelect, onAdd, onRename, onDelete }) => {
  const active = days.find((d) => d.id === activeDayId) ?? days[0];

  return (
    <section className="days" aria-label="Giorni di allenamento">
      <div className="days__tabs" role="tablist">
        {days.map((day) => (
          <button
            key={day.id}
            type="button"
            role="tab"
            aria-selected={day.id === active.id}
            className={`days__tab${day.id === active.id ? " days__tab--active" : ""}`}
            onClick={() => onSelect(day.id)}
          >
            {day.name || "Giorno"}
          </button>
        ))}
        <button type="button" className="days__tab days__tab--add" onClick={onAdd} aria-label="Aggiungi giorno">
          <PlusIcon />
        </button>
      </div>

      <div className="days__edit">
        <input
          className="input days__name"
          type="text"
          value={active.name}
          onChange={(e) => onRename(e.target.value)}
          placeholder="Nome del giorno"
          aria-label="Nome del giorno"
        />
        {days.length > 1 && (
          <button
            type="button"
            className="icon-button icon-button--danger"
            onClick={onDelete}
            aria-label="Elimina giorno"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </section>
  );
};

export default DayTabs;
