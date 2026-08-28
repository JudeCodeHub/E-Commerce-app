"use client";
import Image from "next/image";
import { MapPin, Mail, Phone, User } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-500/15 text-yellow-400",
  rejected: "bg-red-500/15 text-red-400",
  approved: "bg-green-500/15 text-green-400",
};

const StoreInfo = ({ store }) => {
  return (
    <div className="flex-1 space-y-3 text-sm">
      {/* FIX 1: SAFETY CHECK FOR LOGO */}
      {store.logo ? (
        <Image
          width={100}
          height={100}
          src={store.logo}
          alt={store.name}
          className="size-20 object-contain rounded-2xl bg-white/5 border border-white/10 p-2 max-sm:mx-auto"
        />
      ) : (
        // Fallback if no logo
        <div className="size-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center max-sm:mx-auto text-xs text-muted">
          No Logo
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
        <h3 className="text-lg font-semibold text-white">{store.name}</h3>
        <span className="text-sm text-muted">@{store.username}</span>

        {/* Status Badge */}
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
            statusStyles[store.status] || statusStyles.pending
          }`}
        >
          {store.status}
        </span>
      </div>

      <p className="text-slate-300 leading-relaxed max-w-2xl">{store.description}</p>

      <div className="flex flex-col gap-1.5 text-muted">
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-accent shrink-0" /> {store.address}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={16} className="text-accent shrink-0" /> {store.contact}
        </p>
        <p className="flex items-center gap-2">
          <Mail size={16} className="text-accent shrink-0" /> {store.email}
        </p>
      </div>

      <p className="text-muted pt-2">
        Applied on{" "}
        <span className="text-slate-300">
          {new Date(store.createdAt).toLocaleDateString()}
        </span>{" "}
        by
      </p>

      <div className="flex items-center gap-2.5">
        {/* FIX 2: SAFETY CHECK FOR USER IMAGE */}
        {store.user?.image ? (
          <Image
            width={36}
            height={36}
            src={store.user.image}
            alt={store.user.name}
            className="size-9 rounded-full"
          />
        ) : (
          // Fallback if no user image
          <div className="size-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
            <User size={16} className="text-muted" />
          </div>
        )}

        <div>
          <p className="text-slate-200 font-medium">{store.user.name}</p>
          <p className="text-muted">{store.user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
