"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { DeleteIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function AdminCoupons() {
  const { getToken } = useAuth();

  const [coupons, setCoupons] = useState([]);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    forNewUser: false,
    forMember: false,
    isPublic: false,
    expiresAt: new Date(),
  });

  const fetchCoupons = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/coupon", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(data);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      newCoupon.discount = Number(newCoupon.discount);
      newCoupon.expiresAt = new Date(newCoupon.expiresAt);
      const { data } = await axios.post(
        "/api/admin/coupon",
        { newCoupon },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      await fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const deleteCoupon = async (code) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this coupon?"
      );
      if (!confirm) return;
      const token = await getToken();
      const { data } = await axios.delete(`/api/admin/coupon?code=${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCoupons();
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const inputClass =
    "w-full h-11 bg-white/5 border border-white/10 focus:border-accent text-slate-100 placeholder-slate-500 rounded-lg px-3.5 outline-none transition-colors";

  return (
    <div className="w-full mb-20">
      {/* Add Coupon */}
      <div className="bg-panel border border-white/10 rounded-2xl p-6 max-w-2xl">
        <h2 className="text-2xl text-muted">
          Add <span className="text-white font-semibold">Coupon</span>
        </h2>

        <form
          onSubmit={(e) =>
            toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })
          }
          className="flex flex-col gap-4 mt-5 text-sm"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Coupon Code
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER25"
                className={inputClass}
                name="code"
                value={newCoupon.code}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Discount (%)
              </label>
              <input
                type="number"
                placeholder="10"
                min={1}
                max={100}
                className={inputClass}
                name="discount"
                value={newCoupon.discount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="Coupon description"
              className={inputClass}
              name="description"
              value={newCoupon.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              placeholder="Coupon Expires At"
              className={inputClass}
              name="expiresAt"
              value={format(newCoupon.expiresAt, "yyyy-MM-dd")}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap gap-6 mt-1">
            <label className="flex items-center gap-3 cursor-pointer text-slate-300">
              <span className="relative inline-flex items-center shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="forNewUser"
                  checked={newCoupon.forNewUser}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })
                  }
                />
                <span className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-accent transition-colors duration-200"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
              </span>
              For New User
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-slate-300">
              <span className="relative inline-flex items-center shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="forMember"
                  checked={newCoupon.forMember}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, forMember: e.target.checked })
                  }
                />
                <span className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-accent transition-colors duration-200"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
              </span>
              For Member
            </label>
          </div>

          <button className="self-start mt-2 px-8 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-slate-900 font-bold transition-all active:scale-[0.98]">
            Add Coupon
          </button>
        </form>
      </div>

      {/* List Coupons */}
      <div className="mt-10 w-full">
        <h2 className="text-2xl text-muted">
          All <span className="text-white font-semibold">Coupons</span>
        </h2>
        <div className="w-full overflow-x-auto mt-4 rounded-2xl border border-white/10 bg-panel">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Code
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Description
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Discount
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Expires At
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  New User
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  For Member
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {coupon.code}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {coupon.description}
                  </td>
                  <td className="py-3.5 px-4 text-accent font-semibold">
                    {coupon.discount}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {format(coupon.expiresAt, "yyyy-MM-dd")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        coupon.forNewUser
                          ? "bg-green-500/15 text-green-400"
                          : "bg-white/5 text-muted"
                      }`}
                    >
                      {coupon.forNewUser ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        coupon.forMember
                          ? "bg-green-500/15 text-green-400"
                          : "bg-white/5 text-muted"
                      }`}
                    >
                      {coupon.forMember ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        toast.promise(deleteCoupon(coupon.code), {
                          loading: "Deleting coupon...",
                        })
                      }
                      aria-label="Delete coupon"
                      className="size-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <DeleteIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
