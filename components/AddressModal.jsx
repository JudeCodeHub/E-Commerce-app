"use client";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addAddress, updateAddress } from "@/lib/features/address/addressSlice";

const FormField = ({ label, name, ...rest }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-white mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      className="w-full h-11 bg-white/5 text-slate-100 placeholder-slate-500 border border-white/10 focus:border-accent rounded-lg px-4 outline-none transition-colors"
      {...rest}
    />
  </div>
);

const emptyAddress = {
  name: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
};

const AddressModal = ({ setShowAddressModal, editingAddress }) => {
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  const [address, setAddress] = useState(
    editingAddress
      ? {
          name: editingAddress.name,
          email: editingAddress.email,
          street: editingAddress.street,
          city: editingAddress.city,
          state: editingAddress.state,
          zip: editingAddress.zip,
          country: editingAddress.country,
          phone: editingAddress.phone,
        }
      : emptyAddress
  );

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      if (editingAddress) {
        const { data } = await axios.put(
          "/api/address",
          { addressId: editingAddress.id, address },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(updateAddress(data.updatedAddress));
        toast.success(data.message);
      } else {
        const { data } = await axios.post(
          "/api/address",
          { address },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(addAddress(data.newAddress));
        toast.success(data.message);
      }

      setShowAddressModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        toast.promise(handleSubmit(e), {
          loading: editingAddress ? "Saving changes..." : "Adding Address...",
        })
      }
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col gap-5 w-full max-w-sm mx-auto bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={() => setShowAddressModal(false)}
          className="absolute top-5 right-5 size-8 flex items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors"
        >
          <XIcon size={18} />
        </button>

        <h2 className="text-xl font-semibold text-white">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>

        <FormField
          label="Name"
          name="name"
          type="text"
          onChange={handleAddressChange}
          value={address.name}
          placeholder="Enter your name"
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          onChange={handleAddressChange}
          value={address.email}
          placeholder="Email address"
          required
        />
        <FormField
          label="Street"
          name="street"
          type="text"
          onChange={handleAddressChange}
          value={address.street}
          placeholder="Street"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="City"
            name="city"
            type="text"
            onChange={handleAddressChange}
            value={address.city}
            placeholder="City"
            required
          />
          <FormField
            label="State"
            name="state"
            type="text"
            onChange={handleAddressChange}
            value={address.state}
            placeholder="State"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Zip Code"
            name="zip"
            type="number"
            onChange={handleAddressChange}
            value={address.zip}
            placeholder="Zip code"
            required
          />
          <FormField
            label="Country"
            name="country"
            type="text"
            onChange={handleAddressChange}
            value={address.country}
            placeholder="Country"
            required
          />
        </div>
        <FormField
          label="Phone"
          name="phone"
          type="text"
          onChange={handleAddressChange}
          value={address.phone}
          placeholder="Phone"
          required
        />

        <button className="w-full bg-accent hover:bg-accent-hover text-slate-900 font-bold text-sm py-3 rounded-lg transition-colors active:scale-[0.98]">
          {editingAddress ? "SAVE CHANGES" : "SAVE ADDRESS"}
        </button>
      </div>
    </form>
  );
};

export default AddressModal;
