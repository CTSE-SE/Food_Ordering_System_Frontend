import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import customFetch from "@/utils/customFetch";
import { BounceLoader } from "react-spinners";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // Fetch user profile
  // GET /users/profile returns the user object directly (no wrapper)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await customFetch.get("/users/profile");
        setProfile(data);
        setFormData({
          fullName: data.fullName ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        });
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", phone: "", address: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      // PUT /users/profile returns { message, user: { ... } }
      const { data } = await customFetch.put("/users/profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      });
      setProfile(data.user);
      setFormData({
        fullName: data.user.fullName ?? "",
        phone: data.user.phone ?? "",
        address: data.user.address ?? "",
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-20 backdrop-blur-md">
        <BounceLoader size={50} color="#EE1133" />
      </div>
    );
  }

  // Avatar initials fallback
  const initials = profile.fullName
    ? profile.fullName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const inputCls =
    "w-full px-4 py-2 rounded-md border border-gray-300 focus:border-event-red focus:ring-1 focus:ring-event-red outline-none";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 font-Mainfront">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-event-red hover:text-red-700 font-semibold"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4 pb-8 border-b border-gray-200">
          <div className="w-32 h-32 rounded-full bg-event-red flex items-center justify-center border-4 border-gray-100 shadow-lg">
            <span className="text-white text-4xl font-bold">{initials}</span>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">{profile.fullName}</h3>
            <p className="text-gray-500 text-lg capitalize">{profile.role}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  disabled
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 text-lg">{profile.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-gray-800 text-lg">{profile.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputCls}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 text-lg">{profile.phone || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={inputCls}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 text-lg">{profile.address || "—"}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-event-red hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition duration-200 disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  fullName: profile.fullName,
                  phone: profile.phone ?? "",
                  address: profile.address ?? "",
                });
                setErrors({ fullName: "", phone: "", address: "" });
              }}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
