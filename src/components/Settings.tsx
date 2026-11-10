import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";
import type { Settings as SettingsData, ThemeMode } from "../lib/types";

const ACCENTS = ["#7c5cff", "#2f80ed", "#16a085", "#f2994a", "#eb5757", "#e84393"];

const THEMES: { value: ThemeMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Chiaro" },
  { value: "dark", label: "Scuro" },
];

interface SettingsProps {
  open: boolean;
  settings: SettingsData;
  onChange: (patch: Partial<SettingsData>) => void;
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ open, settings, onChange, onClose, onExport, onImport, onReset }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="settings"
      onClose={onClose}
      onClick={(e) => {
        // Click sullo sfondo (il <dialog> stesso, non il contenuto) → chiude.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings__content">
        <div className="settings__head">
          <h2>Impostazioni</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Chiudi">
            <CloseIcon />
          </button>
        </div>

        <div className="settings__group">
          <span className="settings__label">Tema</span>
          <div className="segmented" role="radiogroup" aria-label="Tema">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={settings.theme === t.value}
                className={`segmented__item${settings.theme === t.value ? " segmented__item--active" : ""}`}
                onClick={() => onChange({ theme: t.value })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings__group">
          <span className="settings__label">Colore</span>
          <div className="swatches">
            {ACCENTS.map((color) => (
              <button
                key={color}
                type="button"
                className={`swatch${settings.accent === color ? " swatch--active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => onChange({ accent: color })}
                aria-label={`Colore ${color}`}
              />
            ))}
            <input
              className="swatch swatch--custom"
              type="color"
              value={settings.accent}
              onChange={(e) => onChange({ accent: e.target.value })}
              aria-label="Colore personalizzato"
            />
          </div>
        </div>

        <label className="settings__row">
          <span>
            Avvia il recupero a ogni serie
            <small>Parte da solo quando segni una serie come fatta.</small>
          </span>
          <input
            type="checkbox"
            className="toggle"
            checked={settings.autoRest}
            onChange={(e) => onChange({ autoRest: e.target.checked })}
          />
        </label>

        <label className="settings__row">
          <span>
            Suono e vibrazione
            <small>Avviso a fine recupero.</small>
          </span>
          <input
            type="checkbox"
            className="toggle"
            checked={settings.sound}
            onChange={(e) => onChange({ sound: e.target.checked })}
          />
        </label>

        <div className="settings__group">
          <span className="settings__label">Dati</span>
          <p className="settings__hint">
            La scheda è salvata solo su questo dispositivo. Esporta un backup per non perderla.
          </p>
          <div className="settings__buttons">
            <button type="button" className="button button--ghost" onClick={onExport}>
              Esporta
            </button>
            <button type="button" className="button button--ghost" onClick={() => fileRef.current?.click()}>
              Importa
            </button>
            <button
              type="button"
              className="button button--danger"
              onClick={() => {
                if (window.confirm("Cancellare tutta la scheda e le impostazioni? L'azione non si può annullare.")) onReset();
              }}
            >
              Cancella tutto
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </dialog>
  );
};

export default Settings;
