"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const CustomSelect = ({ options, value, onChange, placeholder = "Select an option" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full h-12 flex items-center justify-between bg-white/5 border border-white/10 hover:border-accent/60 rounded-lg px-4 text-sm text-slate-100 transition-colors outline-none"
      >
        <span className={value ? "text-slate-100" : "text-slate-500"}>
          {value || placeholder}
        </span>
        <ChevronDownIcon
          size={16}
          className={`text-muted transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-panel border border-white/10 rounded-lg p-1.5 shadow-xl shadow-black/40 max-h-60 overflow-y-auto no-scrollbar">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                option === value
                  ? "bg-accent text-slate-900 font-semibold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
