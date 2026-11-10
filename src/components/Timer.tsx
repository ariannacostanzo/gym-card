import { useEffect, useRef, useState } from "react";
import { formatTime } from "../lib/format";
import type { RestState } from "../lib/types";

const PRESETS = [30, 60, 90, 120];

interface TimerProps {
  rest: RestState | null;
  onStart: (seconds: number, label: string) => void;
  onAdjust: (deltaSeconds: number) => void;
  onClose: () => void;
  onFinish: () => void;
}

const Timer: React.FC<TimerProps> = ({ rest, onStart, onAdjust, onClose, onFinish }) => {
  const [now, setNow] = useState(() => Date.now());
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!rest) return;
    finishedRef.current = false;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= rest.endsAt && !finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [rest, onFinish]);

  if (!rest) {
    return (
      <div className="timer timer--idle" role="group" aria-label="Recupero libero">
        <span className="timer__label">Recupero libero</span>
        <div className="timer__presets">
          {PRESETS.map((seconds) => (
            <button key={seconds} type="button" className="chip" onClick={() => onStart(seconds, "Recupero")}>
              {formatTime(seconds)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Il tempo si calcola dall'istante di fine (non contando i tick): resta esatto anche se il
  // browser rallenta i timer con la pagina in background.
  const remaining = Math.min(rest.total, Math.max(0, Math.ceil((rest.endsAt - now) / 1000)));
  const finished = remaining === 0;
  const progress = rest.total > 0 ? ((rest.total - remaining) / rest.total) * 100 : 100;

  return (
    <div className={`timer${finished ? " timer--finished" : ""}`} role="timer" aria-live="polite">
      <div className="timer__info">
        <span className="timer__label">{finished ? "Recupero finito" : rest.label || "Recupero"}</span>
        <span className="timer__time">{formatTime(remaining)}</span>
      </div>
      <div className="timer__bar">
        <div className="timer__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="timer__actions">
        <button type="button" className="chip" onClick={() => onAdjust(-15)} disabled={finished}>
          −15s
        </button>
        <button type="button" className="chip" onClick={() => onAdjust(15)}>
          +15s
        </button>
        <button type="button" className="chip chip--strong" onClick={onClose}>
          {finished ? "Chiudi" : "Salta"}
        </button>
      </div>
    </div>
  );
};

export default Timer;
