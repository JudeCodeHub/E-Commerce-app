"use client";
import Image from "next/image";
import { X } from "lucide-react";

const ProductViewModal = ({ product, onClose }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40 max-w-2xl w-full p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 size-8 flex items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">
          Product Details
        </h2>

        <div className="flex gap-3 mb-6">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="size-24 rounded-lg bg-surface-light border border-white/10 flex items-center justify-center overflow-hidden shrink-0"
            >
              <Image
                width={100}
                height={100}
                className="w-full h-full object-contain p-1"
                src={image}
                alt=""
              />
            </div>
          ))}
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
              Name
            </h3>
            <p className="text-slate-100">{product.name}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
              Description
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-8">
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                Actual Price
              </h3>
              <p className="text-slate-300 line-through">
                {currency} {product.mrp.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                Offer Price
              </h3>
              <p className="text-accent font-semibold">
                {currency} {product.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                Category
              </h3>
              <p className="text-slate-300">{product.category}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                Stock Status
              </h3>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  product.inStock
                    ? "bg-green-500/15 text-green-400"
                    : "bg-slate-500/15 text-slate-400"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
