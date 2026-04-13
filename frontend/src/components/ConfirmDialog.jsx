import ModalShell from "./ModalShell";

export default function ConfirmDialog({
  confirmLabel = "Confirm",
  description,
  isDestructive = false,
  onCancel,
  onConfirm,
  title,
}) {
  return (
    <ModalShell
      className="confirm-dialog"
      closeLabel="Close confirmation dialog"
      description={description}
      onClose={onCancel}
      title={title}
    >
      <div className="confirm-dialog-actions">
        <button className="secondary-btn" onClick={onCancel} type="button">
          Cancel
        </button>
        <button
          className={isDestructive ? "danger-btn" : "primary-btn"}
          onClick={onConfirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}
