"use client";

import { useEffect } from "react";
import { AlertTriangleIcon } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="size-16 rounded-2xl bg-panel border border-white/10 flex items-center justify-center mb-6">
        <AlertTriangleIcon size={28} className="text-red-400" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-white">
        Something went wrong
      </h1>
      <p className="text-muted mt-3 max-w-sm">
        An unexpected error occurred. Please try again, and if the problem
        continues, come back a little later.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-slate-900 font-bold transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
