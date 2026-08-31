import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddressModal from "./AddressModal";
import AddressSelect from "./AddressSelect";
import ConfirmModal from "./store/ConfirmModal";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Protect, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { fetchCart } from "@/lib/features/cart/cartSlice";
import { removeAddress, setDefaultAddress } from "@/lib/features/address/addressSlice";

const OrderSummary = ({ totalPrice, items }) => {
  const { user } = useUser();

  const { getToken } = useAuth();

  const dispatch = useDispatch()

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const router = useRouter();

  const addressList = useSelector((state) => state.address.list);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (!addressList?.length) {
      setSelectedAddress(null);
      return;
    }
    if (!selectedAddress || !addressList.some((a) => a.id === selectedAddress.id)) {
      setSelectedAddress(addressList.find((a) => a.isDefault) || addressList[0]);
    }
  }, [addressList]);

  const handleCouponCode = async (event) => {
    event.preventDefault();
    try {
      if (!user) {
        return toast("Please login to apply coupon");
      }

      const token = await getToken()

      const {data} = await axios.post('/api/coupon', {code: couponCodeInput}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      })

      setCoupon(data.coupon)
      toast.success("Coupon applied successfully")
    } catch (error) {
        toast.error(error?.response?.data?.error || error.message)
    }
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSetDefaultAddress = async (address) => {
    try {
      const token = await getToken();
      await axios.patch(
        "/api/address",
        { addressId: address.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setDefaultAddress(address.id));
      toast.success("Default address updated");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const confirmDeleteAddress = async () => {
    try {
      const token = await getToken();
      await axios.delete("/api/address", {
        data: { addressId: deletingAddress.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeAddress(deletingAddress.id));
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setDeletingAddress(null);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
        if (!user) {
            return toast("Please login to place an order");
        }

        if(!selectedAddress) {
            return toast("Please select an address")
        }

        if(!items || items.length === 0) {
            return toast("Please select at least one item")
        }

        const token = await getToken()

        const orderData = {
            addressId: selectedAddress.id,
            items,
            paymentMethod
        }

        if(coupon) {
            orderData.couponCode = coupon.code
        }

        const {data} = await axios.post('/api/orders', orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(paymentMethod === "STRIPE") {
            window.location.href = data.session.url;
        }else{
            toast.success(data.message)
            router.push("/orders")
            dispatch(fetchCart({getToken}))
        }
    } catch (error) {
        toast.error(error?.response?.data?.error || error.message)
    }


  };

  return (
    <div className="w-full max-w-lg lg:max-w-[400px] bg-panel border border-white/10 text-muted text-sm rounded-2xl p-7">
      <h2 className="text-xl font-medium text-white">Payment Summary</h2>
      <p className="text-muted text-xs my-4">Payment Method</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          id="COD"
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className="accent-amber-500"
        />
        <label htmlFor="COD" className="cursor-pointer">
          COD
        </label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input
          type="radio"
          id="STRIPE"
          name="payment"
          onChange={() => setPaymentMethod("STRIPE")}
          checked={paymentMethod === "STRIPE"}
          className="accent-amber-500"
        />
        <label htmlFor="STRIPE" className="cursor-pointer">
          Stripe Payment
        </label>
      </div>
      <div className="my-4 py-4 border-y border-white/10 text-muted">
        <p className="mb-3">Address</p>
        {addressList?.length > 0 ? (
          <AddressSelect
            addresses={addressList}
            value={selectedAddress}
            onChange={setSelectedAddress}
            onEdit={handleEditAddress}
            onSetDefault={handleSetDefaultAddress}
            onDelete={setDeletingAddress}
            onAddNew={handleOpenAddModal}
          />
        ) : (
          <button
            className="flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
            onClick={handleOpenAddModal}
          >
            + Add Address
          </button>
        )}
      </div>
      <div className="pb-4 border-b border-white/10">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-muted">
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right text-slate-100">
            <p>
              {currency}
              {totalPrice.toLocaleString()}
            </p>
            <p>
              <Protect plan={"plus"} fallback={`${currency}5`}>
                free
              </Protect>
            </p>
            {coupon && (
              <p>{`-${currency}${((coupon.discount / 100) * totalPrice).toFixed(
                2
              )}`}</p>
            )}
          </div>
        </div>
        {!coupon ? (
          <form
            onSubmit={(e) =>
              toast.promise(handleCouponCode(e), {
                loading: "Checking Coupon...",
              })
            }
            className="flex justify-center gap-3 mt-3"
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder="Coupon Code"
              className="border border-white/10 bg-white/5 text-slate-100 placeholder-slate-500 focus:border-accent p-1.5 rounded-lg w-full outline-none transition-colors"
            />
            <button className="bg-accent hover:bg-accent-hover text-slate-900 font-semibold px-3 rounded-lg active:scale-95 transition-all">
              Apply
            </button>
          </form>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>
              Code:{" "}
              <span className="font-semibold ml-1">
                {coupon.code.toUpperCase()}
              </span>
            </p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon("")}
              className="hover:text-red-400 transition cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>Total:</p>
        <p className="font-medium text-right text-slate-100">
          <Protect
            plan={"plus"}
            fallback={`${currency}
            ${
              coupon
                ? (
                    totalPrice +
                    5 -
                    (coupon.discount / 100) * totalPrice
                  ).toFixed(2)
                : (totalPrice + 5).toLocaleString()
            }`}
          >
            {currency}
            {coupon
              ? (totalPrice - (coupon.discount / 100) * totalPrice).toFixed(2)
              : totalPrice.toLocaleString()}
          </Protect>
        </p>
      </div>
      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: "placing Order..." })
        }
        className="w-full bg-accent hover:bg-accent-hover text-slate-900 font-bold py-2.5 rounded-lg active:scale-95 transition-all"
      >
        Place Order
      </button>

      {showAddressModal && (
        <AddressModal
          setShowAddressModal={setShowAddressModal}
          editingAddress={editingAddress}
        />
      )}

      {deletingAddress && (
        <ConfirmModal
          title="Delete Address"
          message={`Delete the address for ${deletingAddress.name}? This can't be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDeleteAddress}
          onCancel={() => setDeletingAddress(null)}
        />
      )}
    </div>
  );
};

export default OrderSummary;
