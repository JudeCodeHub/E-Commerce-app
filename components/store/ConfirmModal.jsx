"use client";
import { TriangleAlertIcon } from "lucide-react";

const ConfirmModal = ({ title, message, confirmLabel = "Delete", variant = "danger", onConfirm, onCancel }) => {
  const isDanger = variant === "danger";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40 max-w-sm w-full p-6"
      >
        <div
          className={`size-11 rounded-full flex items-center justify-center mb-4 ${
            isDanger ? "bg-red-500/15" : "bg-accent/15"
          }`}
        >
          <TriangleAlertIcon size={20} className={isDanger ? "text-red-400" : "text-accent"} />
        </div>

        <h2 className="text-lg font-semibold text-white mb-1.5">{title}</h2>
        <p className="text-sm text-muted mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors active:scale-[0.98] ${
              isDanger
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-accent hover:bg-accent-hover text-slate-900 font-semibold"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
