"use client";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UploadCloud, X, Loader2, CheckCircle2 } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FormField = ({ label, name, value, onChange, onBlur, error, success, textarea, ...rest }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-white mb-2">
      {label}
    </label>
    <div className="relative">
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full min-h-18 resize-y bg-white/5 text-slate-100 placeholder-slate-500 border rounded-lg px-4 py-3 outline-none transition-colors ${
            error ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-accent"
          }`}
          {...rest}
        />
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full h-12 bg-white/5 text-slate-100 placeholder-slate-500 border rounded-lg px-4 outline-none transition-colors ${
            error ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-accent"
          } ${success ? "pr-10" : ""}`}
          {...rest}
        />
      )}
      {success && !textarea && (
        <CheckCircle2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
      )}
    </div>
    {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
  </div>
);

export default function CreateStore() {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({});

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    image: "",
  });

  const logoPreview = useMemo(
    () => (storeInfo.image ? URL.createObjectURL(storeInfo.image) : null),
    [storeInfo.image]
  );

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const onBlurHandler = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const errors = {
    username: !storeInfo.username ? "Username is required" : "",
    name: !storeInfo.name ? "Store name is required" : "",
    description: !storeInfo.description ? "Description is required" : "",
    email: !storeInfo.email
      ? "Email is required"
      : !emailRegex.test(storeInfo.email)
      ? "Enter a valid email address"
      : "",
    contact: !storeInfo.contact ? "Contact number is required" : "",
    address: !storeInfo.address ? "Address is required" : "",
  };

  const isFormValid =
    Object.values(errors).every((error) => !error) && !!storeInfo.image && agreed;

  const fetchSellerStatus = async () => {
    const token = await getToken();
    try {
      const { data } = await axios.get("/api/store/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (["approved", "rejected", "pending"].includes(data.status)) {
        setStatus(data.status);
        setAlreadySubmitted(true);
        switch (data.status) {
          case "approved":
            setMessage(
              "Your store has been approved, you can now add product to your store from dashboard"
            );
            setTimeout(() => router.push("/store"), 5000);
            break;
          case "rejected":
            setMessage(
              "Your store has been rejected, contact the admin for more details"
            );
            break;
          case "pending":
            setMessage(
              "Your store request is pending, please wait for admin to approve your store"
            );
            break;
        }
      } else {
        setAlreadySubmitted(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }

    setLoading(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setTouched({
      username: true,
      name: true,
      description: true,
      email: true,
      contact: true,
      address: true,
    });

    if (!user) {
      return toast.error(
        "You are not logged in, please login to create a store"
      );
    }

    if (!isFormValid) {
      return toast.error("Please fill all required fields correctly");
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", storeInfo.name);
      formData.append("description", storeInfo.description);
      formData.append("username", storeInfo.username);
      formData.append("email", storeInfo.email);
      formData.append("contact", storeInfo.contact);
      formData.append("address", storeInfo.address);
      formData.append("image", storeInfo.image);

      const data = await axios.post("/api/store/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      await fetchSellerStatus();
    } catch (error) {
      console.log(error?.response?.data?.error || error.message);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerStatus();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Please <span className="text-slate-200">login</span> to continue..
        </h1>
      </div>
    );
  }

  return !loading ? (
    <>
      {!alreadySubmitted ? (
        <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-[900px] bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-10">

            {/* Brand mark + Header */}
            <div className="flex items-start justify-between flex-wrap gap-2 mb-6">
              <div>
                <h1 className="text-[28px] sm:text-[32px] font-bold leading-tight">
                  <span className="text-muted font-medium">Add Your</span> <span className="text-white">Store</span>
                </h1>
                <p className="text-muted text-sm mt-2 max-w-[480px] leading-relaxed">
                  To become a seller on NexBuy, submit your store details for review.
                  Your store will be activated after admin verification.
                </p>
              </div>
              <div className="flex items-center gap-1 text-2xl font-semibold text-white shrink-0">
                <span className="text-accent">Nex</span>Buy<span className="text-accent">.</span>
              </div>
            </div>

            <form
              onSubmit={(e) =>
                toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })
              }
              className="flex flex-col gap-6"
            >
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                {/* Left column */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Store Logo</label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="logo-upload"
                        className="group relative flex flex-col items-center justify-center size-20 rounded-2xl border-2 border-dashed border-accent/40 hover:border-accent bg-white/5 cursor-pointer transition-colors overflow-hidden shrink-0"
                      >
                        {logoPreview ? (
                          <>
                            <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setStoreInfo({ ...storeInfo, image: "" });
                              }}
                              className="absolute top-1 right-1 size-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <UploadCloud size={22} className="text-accent/70 group-hover:text-accent transition-colors" />
                        )}
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                          hidden
                        />
                      </label>
                      <p className="text-xs text-muted">PNG or JPG,<br />up to 2MB</p>
                    </div>
                  </div>

                  <FormField
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="Enter your store username"
                    value={storeInfo.username}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    error={touched.username && errors.username}
                    success={touched.username && !errors.username}
                  />

                  <FormField
                    label="Store Name"
                    name="name"
                    type="text"
                    placeholder="Enter your store name"
                    value={storeInfo.name}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    error={touched.name && errors.name}
                    success={touched.name && !errors.name}
                  />

                  <FormField
                    label="Contact Number"
                    name="contact"
                    type="text"
                    placeholder="Enter your store contact number"
                    value={storeInfo.contact}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    error={touched.contact && errors.contact}
                    success={touched.contact && !errors.contact}
                  />
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-5">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your store email"
                    value={storeInfo.email}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    error={touched.email && errors.email}
                    success={touched.email && !errors.email}
                  />

                  <FormField
                    label="Description"
                    name="description"
                    placeholder="Enter your store description"
                    value={storeInfo.description}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    error={touched.description && errors.description}
                    textarea
                    rows={2}
                  />

                  <FormField
                    label="Address"
                    name="address"
                    placeholder="Enter your store address"
                    value={storeInfo.address}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    error={touched.address && errors.address}
                    textarea
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 mt-1">
                <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-4 accent-accent rounded shrink-0"
                  />
                  I agree that my store will be reviewed before activation.
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold px-10 py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {submitting ? "Submitting..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-16">
          <div className="w-full max-w-[560px] bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-10 sm:p-12 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 mb-8 text-2xl font-semibold text-white">
              <span className="text-accent">Nex</span>Buy<span className="text-accent">.</span>
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-white max-w-md">
              {message}
            </p>
            {status === "approved" && (
              <p className="mt-5 text-muted text-sm">
                redirecting to dashboard in{" "}
                <span className="font-semibold text-white">5 seconds</span>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
}
