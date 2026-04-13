import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import customFetch from "@/utils/customFetch";
import { BounceLoader } from "react-spinners";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await customFetch.get("/users/profile");

        setProfile(data);
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    let isValid = true;

    const newErrors = {
      fullName: "",
      phone: "",
      address: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await customFetch.put("/users/profile", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });

      localStorage.setItem("user", JSON.stringify(data));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;

    setIsEditing(false);
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setErrors({
      fullName: "",
      phone: "",
      address: "",
    });
  };

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <BounceLoader size={55} color="#EE1133" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 lg:px-10 py-8 font-Mainfront">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        <div className="rounded-[28px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100">
          <div className="h-40 bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] relative">
            <div className="absolute -bottom-16 left-8 flex items-end gap-5">
              <div className="w-32 h-32 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center text-[#1e3a8a] text-5xl font-bold">
                {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="mb-4 text-white">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {profile.fullName}
                </h1>
                <p className="text-white/90 text-base md:text-lg capitalize mt-1">
                  {profile.role || "customer"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-24 pb-10 px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  My Profile
                </h2>
                <p className="text-slate-500 mt-1">
                  Manage your personal information and keep your account updated.
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 bg-[#EE1133] hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#EE1133] hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md disabled:opacity-70"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3 text-slate-700">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
                    <FiUser />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p className="font-semibold text-slate-800">Personal name</p>
                  </div>
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
                    )}
                  </>
                ) : (
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.fullName}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3 text-slate-700">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl">
                    <FiMail />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold text-slate-800">Account email</p>
                  </div>
                </div>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter email"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.email}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3 text-slate-700">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-800">Contact number</p>
                  </div>
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                    )}
                  </>
                ) : (
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.phone || "-"}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3 text-slate-700">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                    <FiMapPin />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-semibold text-slate-800">Delivery location</p>
                  </div>
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                    )}
                  </>
                ) : (
                  <p className="text-lg font-semibold text-slate-900 break-words">
                    {profile.address || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;