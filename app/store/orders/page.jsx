"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import OrderStatusSelect, { orderStatusConfig } from "@/components/store/OrderStatusSelect";

export default function StoreOrders() {
  const { getToken } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data.orders);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = await getToken();
      await axios.post(
        `/api/store/orders`,
        {
          orderId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast.success("Order status updated!");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full mb-20">
      <h1 className="text-2xl text-muted">
        Store <span className="text-white font-semibold">Orders</span>
      </h1>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-2xl text-muted font-medium">No orders found</h1>
        </div>
      ) : (
        <div className="w-full overflow-x-auto mt-6 rounded-2xl border border-white/10 bg-panel">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {[
                  "Sr. No.",
                  "Customer",
                  "Total",
                  "Payment",
                  "Coupon",
                  "Status",
                  "Date",
                ].map((heading, i) => (
                  <th
                    key={i}
                    className="py-3.5 px-4 text-left font-semibold text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => openModal(order)}
                >
                  <td className="py-3.5 px-4 text-accent font-medium">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    {order.user?.name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    ${order.total}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4">
                    {order.isCouponUsed ? (
                      <span className="bg-accent/15 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                        {order.coupon?.code}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td
                    className="py-3.5 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <OrderStatusSelect
                      value={order.status}
                      onChange={(status) => updateOrderStatus(order.id, status)}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40 max-w-2xl w-full p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 size-8 flex items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold text-white mb-6">
              Order Details
            </h2>

            {/* Customer Details */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                Customer Details
              </h3>
              <div className="text-sm text-slate-300 space-y-1.5">
                <p>
                  <span className="text-muted">Name:</span>{" "}
                  <span className="text-slate-100">
                    {selectedOrder.user?.name}
                  </span>
                </p>
                <p>
                  <span className="text-muted">Email:</span>{" "}
                  <span className="text-slate-100">
                    {selectedOrder.user?.email}
                  </span>
                </p>
                <p>
                  <span className="text-muted">Phone:</span>{" "}
                  <span className="text-slate-100">
                    {selectedOrder.address?.phone}
                  </span>
                </p>
                <p>
                  <span className="text-muted">Address:</span>{" "}
                  <span className="text-slate-100">
                    {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}
                  </span>
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                Products
              </h3>
              <div className="space-y-2.5">
                {selectedOrder.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-white/10 rounded-lg p-3"
                  >
                    <img
                      src={
                        item.product.images?.[0].src ||
                        item.product.images?.[0]
                      }
                      alt={item.product?.name}
                      className="size-14 object-cover rounded-lg bg-white/5"
                    />
                    <div className="flex-1 text-sm">
                      <p className="text-slate-100 font-medium">
                        {item.product?.name}
                      </p>
                      <p className="text-muted">Qty: {item.quantity}</p>
                      <p className="text-muted">Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status */}
            <div className="text-sm text-slate-300 space-y-1.5 border-t border-white/10 pt-4">
              <p>
                <span className="text-muted">Payment Method:</span>{" "}
                <span className="text-slate-100">
                  {selectedOrder.paymentMethod}
                </span>
              </p>
              <p>
                <span className="text-muted">Paid:</span>{" "}
                <span className="text-slate-100">
                  {selectedOrder.isPaid ? "Yes" : "No"}
                </span>
              </p>
              {selectedOrder.isCouponUsed && (
                <p>
                  <span className="text-muted">Coupon:</span>{" "}
                  <span className="text-slate-100">
                    {selectedOrder.coupon.code} (
                    {selectedOrder.coupon.discount}% off)
                  </span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <span className="text-muted">Status:</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    orderStatusConfig[selectedOrder.status]?.badge ||
                    "bg-white/5 text-muted"
                  }`}
                >
                  {orderStatusConfig[selectedOrder.status]?.label ||
                    selectedOrder.status}
                </span>
              </p>
              <p>
                <span className="text-muted">Order Date:</span>{" "}
                <span className="text-slate-100">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 rounded-lg border border-white/10 text-slate-200 hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
