"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDownIcon } from "lucide-react";

export const orderStatusConfig = {
  ORDER_PLACED: {
    label: "Order Placed",
    badge: "bg-blue-500/15 text-blue-400",
    dot: "bg-blue-400",
    text: "text-blue-400",
  },
  PROCESSING: {
    label: "Processing",
    badge: "bg-yellow-500/15 text-yellow-400",
    dot: "bg-yellow-400",
    text: "text-yellow-400",
  },
  SHIPPED: {
    label: "Shipped",
    badge: "bg-purple-500/15 text-purple-400",
    dot: "bg-purple-400",
    text: "text-purple-400",
  },
  DELIVERED: {
    label: "Delivered",
    badge: "bg-green-500/15 text-green-400",
    dot: "bg-green-400",
    text: "text-green-400",
  },
};

const OrderStatusSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  };

  const toggleOpen = () => {
    if (!open) updatePosition();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  const current = orderStatusConfig[value] || {
    label: value,
    badge: "bg-white/5 text-muted",
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        className={`flex items-center gap-1.5 text-xs font-semibold rounded-full pl-3 pr-2 py-1 transition-colors ${current.badge}`}
      >
        {current.label}
        <ChevronDownIcon
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && mounted && position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="z-[100] min-w-[170px] bg-panel border border-white/10 rounded-lg p-1.5 shadow-xl shadow-black/40"
          >
            {Object.keys(orderStatusConfig).map((status) => {
              const config = orderStatusConfig[status];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onChange(status);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-md text-xs font-medium transition-colors hover:bg-white/5 ${
                    status === value ? "bg-white/5" : ""
                  }`}
                >
                  <span className={`size-2 rounded-full shrink-0 ${config.dot}`} />
                  <span className={config.text}>{config.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};

export default OrderStatusSelect;
