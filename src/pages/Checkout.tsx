// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "@/context/CartContext";
// import { createOrder, ShippingAddress } from "@/api/order.api";
// import { toast } from "react-hot-toast";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { items, getTotalAmount, clearCart } = useCart();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
//     street: "",
//     city: "",
//     postalCode: "",
//     country: "Sri Lanka",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     // Validate shipping address
//     if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
//       toast.error("Please fill in all shipping address fields");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Prepare order items
//       const orderItems = items.map((item) => ({
//         productId: item.productId,
//         quantity: item.quantity,
//       }));

//       console.log("Sending order with items:", orderItems);
//       console.log("Shipping address:", shippingAddress);

//       // Create order
//       const response = await createOrder({
//         items: orderItems,
//         shippingAddress,
//       });

//       console.log("Order response:", response);

//       if (response.success) {
//         toast.success("Order placed successfully!");
//         clearCart();
//         navigate("/user-dashboard/orders");
//       } else {
//         toast.error(response.error || "Failed to create order");
//       }
//     } catch (error: any) {
//       console.error("Order creation error:", error);
//       console.error("Error response:", error.response?.data);
//       toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to create order");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
//           <button
//             onClick={() => navigate("/")}
//             className="py-2 px-6 bg-event-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-event-navy mb-8">Checkout</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Order Summary */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
//             <div className="space-y-4 mb-6">
//               {items.map((item) => (
//                 <div key={item.productId} className="flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold text-gray-800">{item.name}</p>
//                     <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
//                   </div>
//                   <p className="font-bold text-event-red">
//                     Rs {(item.price * item.quantity).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="border-t pt-4">
//               <div className="flex justify-between items-center text-lg font-bold">
//                 <span>Total:</span>
//                 <span className="text-event-red">Rs {getTotalAmount().toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           {/* Shipping Address Form */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Street Address *
//                 </label>
//                 <input
//                   type="text"
//                   name="street"
//                   value={shippingAddress.street}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-navy focus:border-transparent"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={shippingAddress.city}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-navy focus:border-transparent"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Postal Code *
//                 </label>
//                 <input
//                   type="text"
//                   name="postalCode"
//                   value={shippingAddress.postalCode}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-navy focus:border-transparent"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
//                 <input
//                   type="text"
//                   name="country"
//                   value={shippingAddress.country}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-navy focus:border-transparent"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full py-3 bg-event-navy text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Placing Order..." : "Place Order"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { createOrder, ShippingAddress } from "@/api/order.api";
import { toast } from "react-hot-toast";
import { MapPin, Package, CreditCard, Truck, ShoppingBag, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const response = await createOrder({
        items: orderItems,
        shippingAddress,
      });

      if (response.success) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/user-dashboard/orders");
      } else {
        toast.error(response.error || "Failed to create order");
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <button
            onClick={() => navigate("/")}
            className="py-3 px-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your purchase and secure your items</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-sm font-medium text-gray-700">Cart</span>
            </div>
            <div className="w-12 h-0.5 bg-amber-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm font-medium text-amber-600 font-bold">Checkout</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-sm font-medium text-gray-500">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-amber-600">Rs {item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                      <p className="font-bold text-lg text-amber-600">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs {getTotalAmount().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-800">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Rs {getTotalAmount().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                    readOnly
                  />
                </div>

                {/* Payment Method Section */}
                <div className="border-t pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 border border-amber-200 rounded-xl bg-amber-50">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Secure Checkout</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-600">100% Buyer Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;