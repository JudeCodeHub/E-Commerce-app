'use client'
import { ArrowRight, StarIcon, Store } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Description')

    return (
        <div className="mt-16 lg:mt-20 text-sm text-slate-300">

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === selectedTab ? 'border-accent text-white' : 'border-transparent text-muted hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="py-6">
                {/* Description */}
                {selectedTab === "Description" && (
                    <p className="max-w-xl text-muted leading-relaxed">{product.description}</p>
                )}

                {/* Reviews */}
                {selectedTab === "Reviews" && (
                    product.rating.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {product.rating.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <Image src={item.user.image} alt="" className="size-10 rounded-full shrink-0" width={100} height={100} />
                                    <div>
                                        <div className="flex items-center gap-0.5">
                                            {Array(5).fill('').map((_, index) => (
                                                <StarIcon key={index} size={16} className='text-transparent' fill={item.rating >= index + 1 ? "#00C950" : "#14532D"} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-300 mt-3 max-w-lg">{item.review}</p>
                                        <p className="font-medium text-white mt-3">{item.user.name}</p>
                                        <p className="text-xs text-muted mt-1">{new Date(item.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No reviews yet.</p>
                    )
                )}
            </div>

            {/* Store info */}
            <div className="flex items-center gap-4 mt-6 pt-8 border-t border-white/10">
                {product.store.logo ? (
                    <Image
                        src={product.store.logo}
                        alt=""
                        className="size-12 rounded-full ring-2 ring-white/10 object-cover shrink-0"
                        width={100}
                        height={100}
                    />
                ) : (
                    <div className="size-12 rounded-full ring-2 ring-white/10 flex items-center justify-center bg-slate-800 shrink-0">
                        <Store className="text-slate-500" size={22} />
                    </div>
                )}

                <div className="flex-1">
                    <p className="text-xs text-muted">Product by</p>
                    <p className="font-semibold text-white">{product.store.name}</p>
                </div>

                <Link
                    href={`/shop/${product.store.username}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover border border-accent/40 hover:border-accent px-4 py-2 rounded-lg transition-colors"
                >
                    View Store <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    )
}

export default ProductDescription
