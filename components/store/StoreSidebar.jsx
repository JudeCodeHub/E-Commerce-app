"use client";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutListIcon,
  SquarePenIcon,
  SquarePlusIcon,
  StoreIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StoreSidebar = ({ storeInfo }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/store", icon: HomeIcon },
    { name: "Add Product", href: "/store/add-product", icon: SquarePlusIcon },
    {
      name: "Manage Product",
      href: "/store/manage-product",
      icon: SquarePenIcon,
    },
    { name: "Orders", href: "/store/orders", icon: LayoutListIcon },
  ];

  return (
    <div className="flex h-full flex-col gap-6 border-r border-white/10 bg-panel/40 sm:min-w-60 shrink-0">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 px-4 max-sm:hidden">
        {storeInfo?.logo ? (
          <Image
            className="size-14 rounded-full ring-2 ring-white/10 object-cover"
            src={storeInfo.logo}
            alt={storeInfo?.name || "Store"}
            width={80}
            height={80}
          />
        ) : (
          <div className="size-14 rounded-full ring-2 ring-white/10 bg-white/5 flex items-center justify-center text-muted">
            <StoreIcon size={22} />
          </div>
        )}
        <p className="text-sm text-slate-300 text-center">
          <span className="text-slate-100 font-medium">{storeInfo?.name}</span>
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

export default StoreSidebar;
