"use client";
import { House, PackageIcon, PackageSearch, ShoppingCart, StoreIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const cartCount = useSelector((state) => state.cart.total);

  return (
    <nav className="relative bg-neutral-950">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto py-4  transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-100"
          >
            <span className="text-amber-600">Nex</span>Buy
            <span className="text-amber-600 text-5xl leading-0">.</span>
            <Protect plan='plus'>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-amber-500">
              plus
            </p>
            </Protect>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-300 text-[17px]">
            <Link href="/" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
              <House size={18} />
              Home
            </Link>
            <Link href="/shop" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
              <PackageSearch size={18} />
              Shop
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-300 hover:text-amber-500 transition-colors"
            >
              <ShoppingCart size={18} />
              Cart
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            <Link
              href="/create-store"
              className="border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition px-4 py-1.5 rounded-full text-sm"
            >
              Sell on NexBuy
            </Link>

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-amber-500 hover:bg-amber-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile User Button  */}
          <div className="sm:hidden">
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<ShoppingCart size={16} />}
                    label="Cart"
                    onClick={() => router.push("/cart")}
                  />
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                  <UserButton.Action
                    labelIcon={<StoreIcon size={16} />}
                    label="Sell on NexBuy"
                    onClick={() => router.push("/create-store")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={openSignIn}
                className="px-7 py-1.5 bg-amber-500 hover:bg-amber-600 text-sm transition text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-slate-800" />
    </nav>
  );
};

export default Navbar;
