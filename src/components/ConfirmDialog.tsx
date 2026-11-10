import { useEffect, useRef } from "react";
import type { ConfirmRequest } from "../lib/types";

interface ConfirmDialogProps {
  request: ConfirmRequest;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Sostituisce window.confirm / window.alert. Va montata solo quando c'è una richiesta. */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ request, onCancel, onConfirm }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      // Esc → annulla.
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        // Click sullo sfondo (il <dialog> stesso, non il contenuto) → annulla.
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="confirm__content">
        <h2 id="confirm-title" className="confirm__title">
          {request.title}
        </h2>
        <p id="confirm-message" className="confirm__message">
          {request.message}
        </p>
        <div className="confirm__actions">
          {request.cancelLabel !== null && (
            <button type="button" className="button button--ghost" onClick={onCancel} autoFocus={request.danger}>
              {request.cancelLabel ?? "Annulla"}
            </button>
          )}
          <button
            type="button"
            className={`button${request.danger ? " button--danger-solid" : ""}`}
            onClick={onConfirm}
            autoFocus={!request.danger}
          >
            {request.confirmLabel ?? "Conferma"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
