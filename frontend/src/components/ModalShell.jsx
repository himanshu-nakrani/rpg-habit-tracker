import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function getFocusableElements(container) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function ModalShell({
  children,
  className = "",
  closeLabel = "Close dialog",
  description,
  describedBy,
  onClose,
  title,
}) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const panel = document.querySelector("[data-modal-panel='true']");
    if (!panel) return undefined;

    const focusable = getFocusableElements(panel);
    const initialTarget = focusable[1] || focusable[0] || panel;
    initialTarget?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const currentFocusable = getFocusableElements(panel);
      if (currentFocusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const firstElement = currentFocusable[0];
      const lastElement = currentFocusable[currentFocusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        aria-describedby={describedBy || (description ? descriptionId : undefined)}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={`modal-card ${className}`.trim()}
        data-modal-panel="true"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        <button
          aria-label={closeLabel}
          className="modal-close"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
        {title ? (
          <div className="modal-heading">
            <h2 className="modal-title" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="modal-subtitle" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body
  );
}
