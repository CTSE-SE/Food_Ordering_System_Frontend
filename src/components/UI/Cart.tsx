import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

const Cart = ({ onClose, onCheckout }: CartProps) => {
  const { items, removeFromCart, updateQuantity, getTotalAmount } = useCart();
  const [isCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Please add items to your cart before checking out.");
      return;
    }

    // Navigate to checkout page with cart items
    onCheckout();
  };

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-event-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  {item.restaurantName && (
                    <p className="text-sm text-gray-500">{item.restaurantName}</p>
                  )}
                  <p className="text-event-red font-bold">Rs {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-event-red">Rs {getTotalAmount().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="flex-1 py-2 bg-event-navy text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
