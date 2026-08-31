'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { HeartIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product?.list || []);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const createCartArray = () => {
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    const toggleSelectItem = (productId) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    }

    const selectedCartArray = cartArray.filter(item => selectedIds.has(item.id));
    const selectedTotalPrice = selectedCartArray.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    const prevCartIdsRef = useRef(new Set());

    useEffect(() => {
        const currentIds = new Set(cartArray.map(item => item.id));
        setSelectedIds(prev => {
            const next = new Set();
            for (const id of currentIds) {
                if (prevCartIdsRef.current.has(id)) {
                    if (prev.has(id)) next.add(id);
                } else {
                    next.add(id);
                }
            }
            return next;
        });
        prevCartIdsRef.current = currentIds;
    }, [cartArray]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-100">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <div className="flex items-center justify-between gap-4">
                    <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" path="/shop" />
                    <Link
                        href="/wishlist"
                        className="flex items-center gap-2 text-sm text-slate-300 hover:text-accent border border-white/10 hover:border-accent/60 rounded-full px-4 py-2 transition-colors shrink-0"
                    >
                        <HeartIcon size={16} /> Wishlist
                    </Link>
                </div>

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-300 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="w-8"></th>
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr key={index} className={`space-x-2 ${!selectedIds.has(item.id) ? 'opacity-50' : ''}`}>
                                        <td className="text-center align-middle">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                className="accent-amber-500 size-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                            </div>
                                            <div>
                                                <p className="max-sm:text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-400">{item.category}</p>
                                                <p>{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Counter productId={item.id} />
                                        </td>
                                        <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} className=" text-red-500 hover:bg-red-500/10 p-2.5 rounded-full active:scale-95 transition-all">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <OrderSummary totalPrice={selectedTotalPrice} items={selectedCartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}