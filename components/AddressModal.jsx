"use client";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addAddress } from "@/lib/features/address/addressSlice";

const AddressModal = ({ setShowAddressModal }) => {
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

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
      const { data } = await axios.post(
        "/api/address",
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(addAddress(data.newAddress));
      toast.success(data.message);
      setShowAddressModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        toast.promise(handleSubmit(e), { loading: "Adding Address..." })
      }
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur h-screen flex items-center justify-center"
    >
      <div className="relative flex flex-col gap-5 text-slate-100 w-full max-w-sm mx-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setShowAddressModal(false)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-400 cursor-pointer"
        >
          <XIcon size={24} />
        </button>
        <h2 className="text-3xl ">
          Add New <span className="font-semibold">Address</span>
        </h2>
        <input
          name="name"
          onChange={handleAddressChange}
          value={address.name}
          className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
          type="text"
          placeholder="Enter your name"
          required
        />
        <input
          name="email"
          onChange={handleAddressChange}
          value={address.email}
          className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={handleAddressChange}
          value={address.street}
          className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
          type="text"
          placeholder="Street"
          required
        />
        <div className="flex gap-4">
          <input
            name="city"
            onChange={handleAddressChange}
            value={address.city}
            className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={handleAddressChange}
            value={address.state}
            className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="flex gap-4">
          <input
            name="zip"
            onChange={handleAddressChange}
            value={address.zip}
            className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
            type="number"
            placeholder="Zip code"
            required
          />
          <input
            name="country"
            onChange={handleAddressChange}
            value={address.country}
            className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={handleAddressChange}
          value={address.phone}
          className="p-2 px-4 outline-none border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded w-full"
          type="text"
          placeholder="Phone"
          required
        />
        <button className="bg-slate-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-700 active:scale-95 transition-all">
          SAVE ADDRESS
        </button>
      </div>
    </form>
  );
};

export default AddressModal;
