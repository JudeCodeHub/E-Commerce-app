import Link from "next/link";
import { CompassIcon } from "lucide-react";

export const metadata = {
  title: "Page Not Found - NexBuy.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="size-16 rounded-2xl bg-panel border border-white/10 flex items-center justify-center mb-6">
        <CompassIcon size={28} className="text-accent" />
      </div>
      <p className="text-sm font-semibold text-accent tracking-wide">404</p>
      <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-2">
        This page doesn&apos;t exist
      </h1>
      <p className="text-muted mt-3 max-w-sm">
        The page you&apos;re looking for may have been moved or removed.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-slate-900 font-bold transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
