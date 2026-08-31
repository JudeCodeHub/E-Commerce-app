'use client'
import Image from "next/image";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import { orderStatusConfig } from "./store/OrderStatusSelect";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    const statusConfig = orderStatusConfig[order.status] || {
        label: order.status,
        badge: "bg-white/5 text-muted",
    };

    return (
        <div className="bg-panel border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-white/10">
                <div>
                    <p className="text-xs text-muted uppercase tracking-wide">Order Placed</p>
                    <p className="text-sm text-slate-200 font-medium">{new Date(order.createdAt).toDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig.badge}`}>
                    {statusConfig.label}
                </span>
            </div>

            <div className="flex flex-col gap-5">
                {order.orderItems.map((item, index) => {
                    const userRating = ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId);
                    return (
                        <div key={index} className="flex items-center gap-4">
                            <div className="size-16 shrink-0 bg-surface-light rounded-lg flex items-center justify-center overflow-hidden">
                                <Image
                                    className="h-12 w-auto object-contain"
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    width={60}
                                    height={60}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-100 truncate">{item.product.name}</p>
                                <p className="text-sm text-muted">{currency}{item.price} &times; {item.quantity}</p>
                            </div>
                            <div className="shrink-0">
                                {userRating ? (
                                    <Rating value={userRating.rating} />
                                ) : order.status === "DELIVERED" && (
                                    <button
                                        onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })}
                                        className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                                    >
                                        Rate Product
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-5 pt-5 border-t border-white/10">
                <div className="text-sm">
                    <p className="text-xs text-muted uppercase tracking-wide mb-1">Shipping Address</p>
                    <p className="text-slate-300">
                        {order.address.name}, {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}, {order.address.country}
                    </p>
                    <p className="text-muted">{order.address.phone}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xs text-muted uppercase tracking-wide">Total</p>
                    <p className="text-xl font-bold text-white">{currency}{order.total}</p>
                </div>
            </div>
        </div>
    )
}

export default OrderItem
