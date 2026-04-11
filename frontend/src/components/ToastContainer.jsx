import useToastStore from "../stores/toastStore";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: { bg: "rgba(34,197,94,0.15)", border: "#22c55e", text: "#86efac", icon: "#22c55e" },
  error: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", text: "#fca5a5", icon: "#ef4444" },
  warning: { bg: "rgba(245,158,11,0.15)", border: "#f59e0b", text: "#fde68a", icon: "#f59e0b" },
  info: { bg: "rgba(139,92,246,0.15)", border: "#8b5cf6", text: "#c4b5fd", icon: "#8b5cf6" },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || ICONS.info;
        const colors = COLORS[toast.type] || COLORS.info;
        return (
          <div
            key={toast.id}
            className="toast-item"
            style={{
              background: colors.bg,
              borderColor: colors.border,
            }}
          >
            <Icon size={18} style={{ color: colors.icon, flexShrink: 0 }} />
            <span className="toast-message" style={{ color: colors.text }}>
              {toast.message}
            </span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              style={{ color: colors.text }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

    </div>
  );
}
