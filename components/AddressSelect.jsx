"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, PlusIcon, SquarePenIcon, StarIcon, Trash2Icon } from "lucide-react";

const summarize = (address) =>
  `${address.name}, ${address.city}, ${address.state}, ${address.zip}`;

const AddressSelect = ({ addresses, value, onChange, onEdit, onSetDefault, onDelete, onAddNew }) => {
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
        className="w-full min-h-12 flex items-center justify-between gap-2 bg-white/5 border border-white/10 hover:border-accent/60 rounded-lg px-4 py-2.5 text-sm text-slate-100 transition-colors outline-none text-left"
      >
        <span className={value ? "text-slate-100" : "text-slate-500"}>
          {value ? summarize(value) : "Select Address"}
        </span>
        <ChevronDownIcon
          size={16}
          className={`text-muted transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-panel border border-white/10 rounded-lg p-1.5 shadow-xl shadow-black/40 max-h-72 overflow-y-auto no-scrollbar">
          {addresses.map((address) => {
            const selected = value?.id === address.id;
            return (
              <div
                key={address.id}
                onClick={() => {
                  onChange(address);
                  setOpen(false);
                }}
                className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                  selected
                    ? "bg-accent text-slate-900 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate flex items-center gap-1.5">
                    {summarize(address)}
                    {address.isDefault && (
                      <StarIcon
                        size={12}
                        className={selected ? "text-slate-900" : "text-accent"}
                        fill="currentColor"
                      />
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!address.isDefault && (
                    <StarIcon
                      size={14}
                      aria-label="Set as default"
                      className={`${selected ? "text-slate-900" : "text-muted"} hover:text-accent transition-colors`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                        onSetDefault(address);
                      }}
                    />
                  )}
                  <SquarePenIcon
                    size={14}
                    aria-label="Edit"
                    className={`${selected ? "text-slate-900" : "text-muted"} hover:text-accent transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      onEdit(address);
                    }}
                  />
                  <Trash2Icon
                    size={14}
                    aria-label="Delete"
                    className={`${selected ? "text-slate-900" : "text-muted"} hover:text-red-400 transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      onDelete(address);
                    }}
                  />
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onAddNew();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-accent hover:bg-white/5 transition-colors mt-1 border-t border-white/10 pt-3"
          >
            <PlusIcon size={14} /> Add New Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSelect;
