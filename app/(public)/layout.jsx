"use client";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { useAuth } from "@clerk/nextjs";
import { fetchAddress } from "@/lib/features/address/addressSlice";

export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ getToken }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
      dispatch(fetchAddress({ getToken }));
    }
  }, [cartItems]);

  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
