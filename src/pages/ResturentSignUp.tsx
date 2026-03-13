import hero from "/Images/Home/hero.webp";
import logo from "/Images/NavBar/logo.webp?url";
import { useState } from "react";
import CustomButton from "@/components/UI/Button";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { signUp, signIn } from "../api/user.api";
import { createRestaurant } from "../api/restaurant.api";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    contactPerson: "",
    restaurantName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    businessType: "",
    cuisineType: "",
    operatingHours: "",
    deliveryRadius: "",
    taxId: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({
    contactPerson: "",
    restaurantName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    businessType: "",
    cuisineType: "",
    operatingHours: "",
    deliveryRadius: "",
    taxId: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    agreeTerms: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Basic required validator
    const requiredFields = [
      "contactPerson",
      "restaurantName",
      "businessType",
      "cuisineType",
      "operatingHours",
      "deliveryRadius",
      "taxId",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field as keyof typeof newErrors] = "This field is required";
        isValid = false;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^0[0-9]{9}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number starting with 0";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Register User as Restaurant Owner
      const authResponse = await signUp({
        fullName: formData.contactPerson,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
        address: `${formData.streetAddress}, ${formData.city}, ${formData.state}, ${formData.country}`,
        role: "resturent owner"
      });

      let token = authResponse?.token;

      // If registration doesn't automatically return a token, login to get it
      if (!token) {
        const loginResponse = await signIn({
          email: formData.email,
          password: formData.password
        });
        token = loginResponse?.token;
        if (loginResponse?.user) {
          localStorage.setItem("user", JSON.stringify(loginResponse.user));
        }
      } else if (authResponse.user) {
        localStorage.setItem("user", JSON.stringify(authResponse.user));
      }

      if (token) {
        // Save token to localStorage so user is authenticated
        localStorage.setItem("token", token);

        // 2. Create Restaurant with the token
        const restaurantData = {
          name: formData.restaurantName,
          contactPerson: formData.contactPerson,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          businessType: formData.businessType,
          cuisineType: formData.cuisineType,
          operatingHours: formData.operatingHours,
          deliveryRadius: formData.deliveryRadius || "10",
          taxId: formData.taxId,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          agreeTerms: formData.agreeTerms
        };

        const restaurantResponse = await createRestaurant(restaurantData);

        if (restaurantResponse) {
          toast.success("Restaurant registered successfully!");
          setTimeout(() => {
            navigate("/restaurant-dashboard"); // Redirecting to restaurant dashboard
            window.location.reload();
          }, 1500);
        }
      } else {
        toast.error("User registered, but failed to log in automatically.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.msg || "Registration failed";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto w-full flex lg:flex-row flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="lg:w-1/2 lg:block hidden">
        <img
          src={hero}
          alt="Laptop Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex flex-col w-full lg:w-[45%] px-[20px] pt-[20px] sm:px-[30px] sm:pt-[30px] md:px-20 lg:pt-[80px] lg:px-[60px] 2xl:pt-[154px] 2xl:px-[165px]">
        <div className="w-full lg:block hidden">
          <Link to="/">
            <img src={logo} alt="logo" className="w-[112px] h-[54px]" />
          </Link>
        </div>

        {/* Sign Up Section */}
        <div className="flex flex-col w-full lg:mt-10">
          <h2 className="font-PlusSans text-[24px] font-bold text-[#000] leading-[32px] lg:text-[36px] ">
            Sign Up
          </h2>
          <span className="mt-5 lg:leading-8 lg:text-base text-black font-PlusSans text-sm leading-6 font-medium">
            Create your account to get started.
          </span>

          {/* Main Form Fields Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-[32px]">
            {/* Restaurant Name */}
            <div>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                placeholder="Restaurant Name"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.restaurantName ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.restaurantName ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.restaurantName && <p className="text-red-500 text-xs mt-1">{errors.restaurantName}</p>}
            </div>

            {/* Contact Person */}
            <div>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Contact Person (Full Name)"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.contactPerson ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.contactPerson ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.email ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.email ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.phoneNumber ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.phoneNumber ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Business Type */}
            <div>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                placeholder="Business Type (e.g. LLC, Sole Proprietor)"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.businessType ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.businessType ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
            </div>

            {/* Cuisine Type */}
            <div>
              <input
                type="text"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                placeholder="Cuisine Type"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.cuisineType ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.cuisineType ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.cuisineType && <p className="text-red-500 text-xs mt-1">{errors.cuisineType}</p>}
            </div>

            {/* Operating Hours */}
            <div>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleInputChange}
                placeholder="Operating Hours (e.g. 9 AM - 10 PM)"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.operatingHours ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.operatingHours ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.operatingHours && <p className="text-red-500 text-xs mt-1">{errors.operatingHours}</p>}
            </div>

            {/* Delivery Radius */}
            <div>
              <input
                type="text"
                name="deliveryRadius"
                value={formData.deliveryRadius}
                onChange={handleInputChange}
                placeholder="Delivery Radius (e.g. 5km)"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.deliveryRadius ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.deliveryRadius ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.deliveryRadius && <p className="text-red-500 text-xs mt-1">{errors.deliveryRadius}</p>}
            </div>

            {/* Tax ID */}
            <div>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="Tax ID"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.taxId ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.taxId ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="Street Address"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.streetAddress ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.streetAddress ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
            </div>

            {/* City */}
            <div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.city ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.city ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.state ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.state ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            {/* Zip Code */}
            <div>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.zipCode ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.zipCode ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
            </div>

            {/* Country */}
            <div>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.country ? "text-red-500" : ""}`}
              />
              <div className={`h-[1px] w-full ${errors.country ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* Password Text box and underline */}
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.password ? "text-red-500" : ""}`}
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <IoEyeOutline size={20} color={errors.password ? "#ef4444" : "#646464"} />
                ) : (
                  <IoEyeOffOutline size={20} color={errors.password ? "#ef4444" : "#646464"} />
                )}
              </div>
              <div className={`h-[1px] w-full ${errors.password ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Text box and underline */}
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.confirmPassword ? "text-red-500" : ""}`}
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? (
                  <IoEyeOutline size={20} color={errors.confirmPassword ? "#ef4444" : "#646464"} />
                ) : (
                  <IoEyeOffOutline size={20} color={errors.confirmPassword ? "#ef4444" : "#646464"} />
                )}
              </div>
              <div className={`h-[1px] w-full ${errors.confirmPassword ? "bg-red-500" : "bg-[#000]"} mt-[4px]`}></div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Agree to terms */}
            <div className="md:col-span-2 flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 mr-2"
              />
              <label htmlFor="agreeTerms" className="text-[14px] font-PlusSans text-[#646464]">
                I agree to the Terms of Service and Privacy Policy
              </label>
              <div className="w-full">
                {errors.agreeTerms && <p className="text-red-500 text-xs ml-2 mt-1">{errors.agreeTerms}</p>}
              </div>
            </div>
          </div>

          {/* Sign up Button */}
          <div className="font-PlusSans mt-[24px] lg:mt-[32px] w-full">
            <CustomButton
              title={isLoading ? "Signing Up..." : "Sign Up"}
              onClick={handleFormSubmit}
              disabled={isLoading}
              icon={
                isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : null
              }
              iconPosition="left"
            />
          </div>
          <div className="font-PlusSans text-xs leading-6 text-[#646464] w-full mt-3">
            This site is protected by recaptcha and the Google Privacy Policy
            and Terms of Service apply.
          </div>
          <h1 className="flex items-center justify-center mt-[12px] font-PlusSans text-[#646464] text-sm leading-6 ">
            If you have an account?{" "}
            <span
              className="text-event-navy font-semibold hover:text-[#000] ml-2.5 hover:underline cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </h1>
          <h1 className="flex items-center justify-center mt-[12px] font-PlusSans text-[#646464] text-sm leading-6 ">
            Register?{" "}
            <span
              className="text-event-navy font-semibold hover:text-[#000] ml-2.5 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              As a customer
            </span>
          </h1>
        </div>
        <div className="flex justify-center items-center text-xs text-black leading-6 mt-auto font-PlusSans lg:py-7 py-3">
          2025 © All rights reserved
        </div>
      </div>
    </div>
  );
};

export default SignUp;
