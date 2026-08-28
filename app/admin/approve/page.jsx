"use client";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function AdminApprove() {
  const { user } = useUser();

  const { getToken } = useAuth();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/approve-store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(data)) {
        setStores(data);
      } else {
        setStores([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    }
    setLoading(false);
  };

  const handleApprove = async ({ storeId, status }) => {
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/admin/approve-store", {
        storeId,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message);
      await fetchStores()
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStores();
    }
  }, [user]);

  return !loading ? (
    <div className="w-full mb-20">
      <h1 className="text-2xl text-muted">
        Approve <span className="text-white font-semibold">Stores</span>
      </h1>

      {stores.length ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
            >
              {/* Store Info */}
              <StoreInfo store={store} />

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t border-white/10 flex-wrap">
                <button
                  onClick={() =>
                    toast.promise(
                      handleApprove({ storeId: store.id, status: "approved" }),
                      { loading: "approving" }
                    )
                  }
                  className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-slate-900 font-bold rounded-lg text-sm transition-all active:scale-[0.98]"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    toast.promise(
                      handleApprove({ storeId: store.id, status: "rejected" }),
                      { loading: "rejecting" }
                    )
                  }
                  className="px-5 py-2.5 border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg text-sm font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-2xl text-muted font-medium">
            No Application Pending
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}
