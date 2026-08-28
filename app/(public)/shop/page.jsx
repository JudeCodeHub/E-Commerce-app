"use client";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MailIcon, MapPinIcon, Search, Store } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const username = searchParams.get("username");

  const [products, setProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

  const fetchData = async () => {
    setLoading(true);
    try {
      if (username) {
        const { data } = await axios.get(`/api/store/data?username=${username}`);
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

  const categories = ["All", ...new Set(products.map((product) => product.category))].sort(
    (a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b))
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = products
    .filter((product) => username || !product.featured)
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <Loading />;

  return (
    <div className="min-h-[70vh] mx-6">
      {/* Store Header */}
      {username && storeInfo && (
        <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
          {storeInfo.logo ? (
            <Image
              src={storeInfo.logo}
              alt={storeInfo.name}
              className="size-32 sm:size-38 object-cover border-2 border-slate-800 rounded-md"
              width={200}
              height={200}
            />
          ) : (
            <div className="size-32 sm:size-38 border-2 border-slate-800 rounded-md bg-slate-800 flex items-center justify-center text-slate-500">
              <Store size={60} strokeWidth={1.5} />
            </div>
          )}

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-slate-100">
              {storeInfo.name}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-lg">
              {storeInfo.description}
            </p>
            <div className="space-y-2 text-sm text-slate-400 mt-4">
              <div className="flex items-center justify-center md:justify-start">
                <MapPinIcon className="w-4 h-4 text-slate-400 mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <MailIcon className="w-4 h-4 text-slate-400 mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-5xl mx-auto mb-40">
        <div className="mt-12 mb-6">
          <h1 className="text-2xl">
            {username ? "Store" : "All"} <span className="text-slate-100 font-medium">Products</span>
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 mt-5">
            {categories.length > 2 ? (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-accent text-slate-900 font-semibold shadow-md shadow-accent/30"
                        : "bg-[#232257] border border-[#33306e] text-slate-300 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full w-full sm:w-60">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
             <p className="col-span-full text-center text-slate-400 py-10">
               No products found.
             </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopContent />
    </Suspense>
  );
}
