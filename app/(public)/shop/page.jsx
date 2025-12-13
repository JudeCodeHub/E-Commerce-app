"use client";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MailIcon, MapPinIcon, Store } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

export default function ShopPage() {
  const searchParams = useSearchParams();

  const username = searchParams.get("username");

  const [products, setProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (username) {
        const { data } = await axios.get(
          `/api/store/data?username=${username}`
        );
        setStoreInfo(data.store);
        setProducts(data.products || data.store?.products || []);
      } else {
        const { data } = await axios.get("/api/products");
        setProducts(data.products || data);
      }
    } catch (error) {
      console.error(error);

      if (username) toast.error("Failed to load store");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-[70vh] mx-6">
      {/* HEADER: Only show Store Info if we are viewing a specific store */}
      {username && storeInfo && (
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
          {storeInfo.logo ? (
            <Image
              src={storeInfo.logo}
              alt={storeInfo.name}
              className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
              width={200}
              height={200}
            />
          ) : (
            <div className="size-32 sm:size-38 border-2 border-slate-100 rounded-md bg-white flex items-center justify-center text-slate-300">
              <Store size={60} strokeWidth={1.5} />
            </div>
          )}

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-slate-800">
              {storeInfo.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-lg">
              {storeInfo.description}
            </p>
            <div className="space-y-2 text-sm text-slate-500 mt-4">
              <div className="flex items-center justify-center md:justify-start">
                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto mb-40">
        <h1 className="text-2xl mt-12 mb-6">
          {username ? "Store" : "All"}{" "}
          <span className="text-slate-800 font-medium">Products</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
