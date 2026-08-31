"use client";
import { HeartIcon } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlist/wishlistSlice";

const WishlistButton = ({
  product,
  className = "",
  size = 14,
  variant = "icon",
}) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const list = useSelector((state) => state.wishlist.list);
  const saved = list.some((item) => item.productId === product.id);

  const saveToWishlist = async () => {
    dispatch(addToWishlist({ productId: product.id, product }));
    try {
      const token = await getToken();
      await axios.post(
        "/api/wishlist",
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to wishlist");
    } catch (error) {
      dispatch(removeFromWishlist(product.id));
      toast.error(error?.response?.data?.error || "Couldn't update wishlist");
    }
  };

  const removeFromWishlistRemote = async () => {
    dispatch(removeFromWishlist(product.id));
    try {
      const token = await getToken();
      await axios.delete("/api/wishlist", {
        data: { productId: product.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Removed from wishlist");
    } catch (error) {
      dispatch(addToWishlist({ productId: product.id, product }));
      toast.error(error?.response?.data?.error || "Couldn't update wishlist");
    }
  };

  const handleToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return openSignIn();
    saved ? removeFromWishlistRemote() : saveToWishlist();
  };

  const handleLabeledClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return openSignIn();
    saved ? router.push("/wishlist") : saveToWishlist();
  };

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleLabeledClick}
        className={`group cursor-pointer transition-colors duration-200 ${className}`}
      >
        {!saved && (
          <HeartIcon
            size={size}
            className="transition-colors duration-200 text-slate-400 group-hover:text-red-400"
          />
        )}
        {saved ? "View Wishlist" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`group cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90 ${className}`}
    >
      <HeartIcon
        size={size}
        className={`transition-colors duration-200 ${
          saved ? "text-red-500" : "text-slate-400 group-hover:text-red-400"
        }`}
        fill={saved ? "#EF4444" : "none"}
      />
    </button>
  );
};

export default WishlistButton;
