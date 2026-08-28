'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product?.list || []);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products?.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="px-6 lg:px-20">
            <div className="max-w-6xl mx-auto py-8 lg:py-12">

                {/* Breadcrumbs */}
                <nav className="text-sm text-muted mb-8">
                    <Link href="/" className="hover:text-slate-200 transition-colors">Home</Link>
                    <span className="mx-2 text-slate-700">/</span>
                    <Link href="/shop" className="hover:text-slate-200 transition-colors">Products</Link>
                    {product?.category && (
                        <>
                            <span className="mx-2 text-slate-700">/</span>
                            <span className="text-slate-300">{product.category}</span>
                        </>
                    )}
                </nav>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}
