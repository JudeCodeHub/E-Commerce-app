"use client";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowRightIcon, ShieldAlertIcon } from "lucide-react";
import StoreNavbar from "./StoreNavbar";
import StoreSidebar from "./StoreSidebar";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const StoreLayout = ({ children }) => {
  const { getToken } = useAuth();

  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);

  const fetchIsSeller = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/is-seller", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSeller(data.isSeller);
      setStoreInfo(data.storeInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIsSeller();
  }, []);

  return loading ? (
    <div className="min-h-screen bg-neutral-950">
      <Loading />
    </div>
  ) : isSeller ? (
    <div className="flex flex-col h-screen bg-neutral-950">
      <StoreNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <StoreSidebar storeInfo={storeInfo} />
        <div className="flex-1 h-full p-6 lg:p-10 overflow-y-scroll no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-6">
      <div className="bg-panel border border-white/10 rounded-2xl p-10 max-w-md flex flex-col items-center">
        <div className="size-14 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
          <ShieldAlertIcon size={26} className="text-red-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          Not authorized
        </h1>
        <p className="text-muted text-sm mt-2 leading-relaxed">
          You don&apos;t have permission to access the seller dashboard.
        </p>
        <Link
          href="/"
          className="bg-accent hover:bg-accent-hover text-slate-900 font-bold flex items-center gap-2 mt-6 px-6 py-2.5 rounded-lg transition-all active:scale-[0.98]"
        >
          Go to home <ArrowRightIcon size={18} />
        </Link>
      </div>
    </div>
  );
};

export default StoreLayout;
