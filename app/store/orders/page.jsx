"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

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
    <>
      <h1 className="text-2xl text-slate-400 mb-5">
        Store <span className="text-slate-100 font-medium">Orders</span>
      </h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl rounded-md shadow border border-slate-800">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider">
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
                  <th key={i} className="px-4 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800 transition-colors duration-150 cursor-pointer"
                  onClick={() => openModal(order)}
                >
                  <td className="pl-6 text-amber-500">{index + 1}</td>
                  <td className="px-4 py-3">{order.user?.name}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">
                    ${order.total}
                  </td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    {order.isCouponUsed ? (
                      <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full">
                        {order.coupon?.code}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border border-slate-700 bg-slate-800 text-slate-100 rounded-md text-sm focus:ring focus:ring-blue-500/40"
                    >
                      <option value="ORDER_PLACED">ORDER_PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
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
          className="fixed inset-0 flex items-center justify-center bg-black/60 text-slate-100 text-sm backdrop-blur-xs z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-w-2xl w-full p-6 relative"
          >
            <h2 className="text-xl font-semibold text-slate-100 mb-4 text-center">
              Order Details
            </h2>

            {/* Customer Details */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <p>
                <span className="text-amber-500">Name:</span>{" "}
                {selectedOrder.user?.name}
              </p>
              <p>
                <span className="text-amber-500">Email:</span>{" "}
                {selectedOrder.user?.email}
              </p>
              <p>
                <span className="text-amber-500">Phone:</span>{" "}
                {selectedOrder.address?.phone}
              </p>
              <p>
                <span className="text-amber-500">Address:</span>{" "}
                {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}
              </p>
            </div>

            {/* Products */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products</h3>
              <div className="space-y-2">
                {selectedOrder.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-slate-800 shadow rounded p-2"
                  >
                    <img
                      src={
                        item.product.images?.[0].src || item.product.images?.[0]
                      }
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-slate-100">{item.product?.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status */}
            <div className="mb-4">
              <p>
                <span className="text-amber-500">Payment Method:</span>{" "}
                {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="text-amber-500">Paid:</span>{" "}
                {selectedOrder.isPaid ? "Yes" : "No"}
              </p>
              {selectedOrder.isCouponUsed && (
                <p>
                  <span className="text-amber-500">Coupon:</span>{" "}
                  {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}%
                  off)
                </p>
              )}
              <p>
                <span className="text-amber-500">Status:</span>{" "}
                {selectedOrder.status}
              </p>
              <p>
                <span className="text-amber-500">Order Date:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
