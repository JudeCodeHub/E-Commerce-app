'use client'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { HugeiconsIcon } from '@hugeicons/react'
import { ShoppingCartAdd01Icon } from '@hugeicons/core-free-icons'
import { HeartIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const router = useRouter()
    const [liked, setLiked] = useState(false)

    const rating = product?.rating?.length
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0;

    const isBestSeller = rating >= 4

    const toggleLike = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setLiked((prev) => !prev)
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
        toast.success('Added to cart')
    }

    const handleBuyNow = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
        router.push('/cart')
    }

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto block w-full sm:w-60 bg-slate-900 border border-slate-800 rounded-2xl p-3 hover:border-slate-700 transition'>
            <div className='relative bg-[#F5F5F5] h-40 sm:h-60 rounded-xl flex items-center justify-center overflow-hidden'>
                {isBestSeller && (
                    <span className='absolute top-3 left-3 bg-white/90 text-slate-800 text-[11px] font-medium px-3 py-1 rounded-full'>Best Seller</span>
                )}
                <button onClick={toggleLike} className='absolute top-3 right-3 bg-white/90 size-7 rounded-full flex items-center justify-center'>
                    <HeartIcon size={14} className={liked ? 'text-red-500' : 'text-slate-400'} fill={liked ? '#EF4444' : 'none'} />
                </button>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition duration-300' src={product.images[0]} alt="" />
            </div>

            {product.images.length > 1 && (
                <div className='flex items-center justify-center gap-1 mt-2'>
                    {product.images.map((_, index) => (
                        <span key={index} className={`size-1.5 rounded-full ${index === 0 ? 'bg-amber-500' : 'bg-slate-700'}`} />
                    ))}
                </div>
            )}

            <p className='text-amber-500 text-xs mt-3'>{product.category}</p>
            <p className='text-slate-100 font-medium truncate'>{product.name}</p>

            <div className='flex items-center justify-between mt-1'>
                <div className='flex'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent' fill={rating >= index + 1 ? "#00C950" : "#14532D"} />
                    ))}
                </div>
                <p className='text-slate-100 font-medium'>{currency}{product.price}</p>
            </div>

            <div className='flex items-center gap-2 mt-3'>
                <button onClick={handleBuyNow} className='flex-1 bg-slate-100 text-slate-900 text-sm font-medium py-2.5 rounded-full hover:bg-white active:scale-95 transition'>Buy Now</button>
                <button onClick={handleAddToCart} aria-label="Add to cart" className='shrink-0 size-10 flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-100 rounded-full hover:bg-slate-700 active:scale-95 transition '>
                    <HugeiconsIcon icon={ShoppingCartAdd01Icon} size={20} />
                </button>
            </div>
        </Link>
    )
}

export default ProductCard
