"use client";

import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShieldCheckIcon,
  StoreIcon,
  TicketPercentIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const AdminSidebar = () => {
  const { user } = useUser();

  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Stores", href: "/admin/stores", icon: StoreIcon },
    { name: "Approve Store", href: "/admin/approve", icon: ShieldCheckIcon },
    { name: "Coupons", href: "/admin/coupons", icon: TicketPercentIcon },
  ];

  return user && (
    <div className="flex h-full flex-col gap-6 border-r border-white/10 bg-panel/40 sm:min-w-60 shrink-0">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 px-4 max-sm:hidden">
        <Image
          className="size-14 rounded-full ring-2 ring-white/10"
          src={user?.imageUrl}
          alt=""
          width={80}
          height={80}
        />
        <p className="text-sm text-slate-300 text-center">
          Hi, <span className="text-slate-100 font-medium">{user?.fullName}</span>
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3 max-sm:mt-6 max-sm:px-2">
        {sidebarLinks.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={index}
              href={link.href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-accent" />
              )}
              <link.icon size={18} className="shrink-0 sm:ml-1" />
              <p className="max-sm:hidden">{link.name}</p>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
