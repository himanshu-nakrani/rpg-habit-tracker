import { useEffect, useId, useRef } from "react";
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
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const isTopmostPanel = () => {
      const panels = document.querySelectorAll("[data-modal-panel='true']");
      return panels[panels.length - 1] === panel;
    };

    const focusable = getFocusableElements(panel);
    const initialTarget = focusable[1] || focusable[0] || panel;
    if (isTopmostPanel()) initialTarget?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (!isTopmostPanel()) return;
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      if (!isTopmostPanel()) return;

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
  }, []);

  return createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        aria-describedby={describedBy || (description ? descriptionId : undefined)}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={`modal-card ${className}`.trim()}
        data-modal-panel="true"
        ref={panelRef}
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
        {!title && !describedBy && description ? (
          <p
            id={descriptionId}
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>,
    document.body
  );
}
