"use client";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon, PackageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export default function Orders() {
  const { getToken } = useAuth();

  const { user, isLoaded } = useUser();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(data.orders);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      }
    };

    if (isLoaded) {
        if(user){
            fetchOrders();
        }else{
            router.push("/");
        }
    }
  }, [isLoaded,user,getToken,router]);

  if(!isLoaded || loading){
    return <Loading/>
  }

  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto px-6 xl:px-0 py-10">
      <div className="mb-6">
        <h1 className="text-2xl text-muted">
          My <span className="text-white font-semibold">Orders</span>
        </h1>
        {orders.length > 0 && (
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted">
              Showing total {orders.length} orders
            </p>
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Go to home <ArrowRightIcon size={14} />
            </Link>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <div className="size-14 rounded-2xl bg-panel border border-white/10 flex items-center justify-center">
            <PackageIcon size={24} className="text-muted" />
          </div>
          <h2 className="text-xl text-muted font-medium">
            You have no orders yet
          </h2>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-slate-900 font-bold transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <OrderItem order={order} key={order.id} />
          ))}
        </div>
      )}
    </div>
  );
}
