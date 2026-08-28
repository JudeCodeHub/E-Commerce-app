"use client";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminStores() {
  const { user } = useUser();

  const { getToken } = useAuth();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(data);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const toggleIsActive = async (storeId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/toggle-store",
        { storeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchStores();
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
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
        Live <span className="text-white font-semibold">Stores</span>
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
              <div className="flex items-center gap-3 pt-3 border-t border-white/10 flex-wrap">
                <p className="text-sm text-muted">Active</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(toggleIsActive(store.id), {
                        loading: "Updating data...",
                      })
                    }
                    checked={store.isActive}
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-accent transition-colors duration-200"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-2xl text-muted font-medium">
            No stores Available
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}
