"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/features/cart/cartSlice";
import WishlistButton from "@/components/WishlistButton";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const { list } = useSelector((state) => state.wishlist);

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId }));
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-[70vh] max-w-6xl mx-auto px-6 xl:px-0 py-10">
      <h1 className="text-2xl text-muted">
        My <span className="text-white font-semibold">Wishlist</span>
      </h1>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <div className="size-14 rounded-2xl bg-panel border border-white/10 flex items-center justify-center">
            <HeartIcon size={24} className="text-muted" />
          </div>
          <h2 className="text-xl text-muted font-medium">
            Your wishlist is empty
          </h2>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-slate-900 font-bold transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
          {list.map(({ productId, product }) => {
            const unavailable = !product.inStock || product.archived;

            return (
              <div
                key={productId}
                className={`bg-panel border border-white/10 rounded-2xl p-3 transition-opacity ${
                  unavailable ? "opacity-50" : ""
                }`}
              >
                <Link href={`/product/${productId}`} className="block">
                  <div className="relative bg-surface-light h-40 rounded-xl flex items-center justify-center overflow-hidden">
                    {unavailable && (
                      <span className="absolute top-3 left-3 bg-black/70 text-white text-[11px] font-medium px-3 py-1 rounded-full z-10">
                        Out of stock
                      </span>
                    )}
                    <WishlistButton
                      product={product}
                      className="absolute top-3 right-3 bg-white/90 size-7 rounded-full flex items-center justify-center z-10"
                    />
                    <Image
                      width={200}
                      height={200}
                      className="max-h-32 w-auto"
                      src={product.images[0]}
                      alt={product.name}
                    />
                  </div>
                  <p className="text-slate-100 font-medium truncate mt-3">
                    {product.name}
                  </p>
                  <p className="text-accent font-semibold mt-1">
                    {currency}
                    {product.price}
                  </p>
                </Link>

                <button
                  onClick={() => !unavailable && handleAddToCart(productId)}
                  disabled={unavailable}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:bg-white/5 disabled:text-muted disabled:cursor-not-allowed text-slate-900 font-semibold text-sm py-2.5 rounded-lg transition-colors"
                >
                  <ShoppingCartIcon size={15} />
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
