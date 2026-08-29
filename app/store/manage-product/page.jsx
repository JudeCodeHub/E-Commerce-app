"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { ArchiveRestoreIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import ProductViewModal from "@/components/store/ProductViewModal";
import ProductEditModal from "@/components/store/ProductEditModal";
import ConfirmModal from "@/components/store/ConfirmModal";

export default function StoreManageProducts() {
  const { getToken } = useAuth();

  const { user } = useUser();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [archivePrompt, setArchivePrompt] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(
        data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const toggleStock = async (productId) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        "/api/store/stock-toggle",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, inStock: !product.inStock }
            : product
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const deleteProduct = async (product) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete("/api/store/product", {
        params: { productId: product.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== product.id)
      );
      return data.message;
    } catch (error) {
      const message = error?.response?.data?.error || error.message;
      if (message.includes("existing orders")) {
        setArchivePrompt(product);
      }
      throw new Error(message);
    }
  };

  const confirmDelete = () => {
    const product = deleteTarget;
    setDeleteTarget(null);
    toast.promise(deleteProduct(product), {
      loading: "Deleting product...",
      success: (message) => message,
      error: (error) => error.message,
    });
  };

  const toggleArchive = async (productId) => {
    const token = await getToken();
    const { data } = await axios.put(
      "/api/store/archive-toggle",
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? data.product : product
      )
    );
    return data.message;
  };

  const confirmArchive = () => {
    const product = archivePrompt;
    setArchivePrompt(null);
    toast.promise(toggleArchive(product.id), {
      loading: "Archiving product...",
      success: (message) => message,
      error: (error) => error?.response?.data?.error || error.message,
    });
  };

  const confirmRestore = () => {
    const product = restoreTarget;
    setRestoreTarget(null);
    toast.promise(toggleArchive(product.id), {
      loading: "Restoring product...",
      success: (message) => message,
      error: (error) => error?.response?.data?.error || error.message,
    });
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  if (loading) return <Loading />;

  const visibleProducts = products.filter((product) =>
    activeTab === "archived" ? product.archived : !product.archived
  );

  return (
    <div className="w-full mb-20">
      <h1 className="text-2xl text-muted">
        Manage <span className="text-white font-semibold">Products</span>
      </h1>

      <div className="flex items-center gap-3 mt-5">
        {["active", "archived"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-slate-900 font-semibold"
                : "bg-white/5 border border-white/10 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {tab === "active" ? "Active" : "Archived"}
          </button>
        ))}
      </div>

      {visibleProducts.length ? (
        <div className="w-full overflow-x-auto no-scrollbar mt-6 rounded-2xl border border-white/10 bg-panel">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Name
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted hidden md:table-cell">
                  Description
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted hidden md:table-cell">
                  MRP
                </th>
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Price
                </th>
                {activeTab === "active" && (
                  <th className="py-3.5 px-4 text-left font-semibold text-muted">
                    In Stock
                  </th>
                )}
                <th className="py-3.5 px-4 text-left font-semibold text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex gap-3 items-center">
                      <Image
                        width={40}
                        height={40}
                        className="size-12 object-contain rounded-lg bg-surface-light border border-white/10 p-1"
                        src={product.images[0]}
                        alt=""
                      />
                      <p className="font-medium text-white">{product.name}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-slate-300 hidden md:table-cell truncate">
                    {product.description}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 hidden md:table-cell">
                    {currency} {product.mrp.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-accent font-semibold">
                    {currency} {product.price.toLocaleString()}
                  </td>
                  {activeTab === "active" && (
                    <td className="py-3.5 px-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          onChange={() =>
                            toast.promise(toggleStock(product.id), {
                              loading: "Updating data...",
                            })
                          }
                          checked={product.inStock}
                        />
                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-accent transition-colors duration-200"></div>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                  )}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewProduct(product)}
                        className="p-2 rounded-lg text-muted hover:text-accent hover:bg-white/5 transition-colors"
                        title="View product"
                      >
                        <EyeIcon size={16} />
                      </button>
                      {activeTab === "active" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditProduct(product)}
                            className="p-2 rounded-lg text-muted hover:text-accent hover:bg-white/5 transition-colors"
                            title="Edit product"
                          >
                            <PencilIcon size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete product"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRestoreTarget(product)}
                          className="p-2 rounded-lg text-muted hover:text-accent hover:bg-white/5 transition-colors"
                          title="Restore product"
                        >
                          <ArchiveRestoreIcon size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-2xl text-muted font-medium">
            {activeTab === "archived" ? "No archived products" : "No products yet"}
          </h1>
        </div>
      )}

      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {editProduct && (
        <ProductEditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={(updatedProduct) => {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
              )
            );
            setEditProduct(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete this product?"
          message={`"${deleteTarget.name}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {archivePrompt && (
        <ConfirmModal
          title="Can't delete this product"
          message={`"${archivePrompt.name}" has existing orders and can't be deleted. Archive it instead? It'll be hidden from your storefront and active product list, but its order history stays intact.`}
          confirmLabel="Archive"
          variant="default"
          onConfirm={confirmArchive}
          onCancel={() => setArchivePrompt(null)}
        />
      )}

      {restoreTarget && (
        <ConfirmModal
          title="Restore this product?"
          message={`"${restoreTarget.name}" will become active again and reappear in your storefront.`}
          confirmLabel="Restore"
          variant="default"
          onConfirm={confirmRestore}
          onCancel={() => setRestoreTarget(null)}
        />
      )}
    </div>
  );
}
