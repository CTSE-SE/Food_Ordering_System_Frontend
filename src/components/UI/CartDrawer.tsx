import { useEffect, useRef } from "react";
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    clearCart,
    restaurantName,
    totalItems,
    totalAmount,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeCart();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const count = totalItems();
  const total = totalAmount();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <FiShoppingCart size={20} className="text-event-red" />
            <h2 className="font-bold text-lg text-gray-800">Your Cart</h2>
            {count > 0 && (
              <span className="px-2 py-0.5 bg-event-red text-white text-xs rounded-full font-bold">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Restaurant label */}
        {restaurantName && (
          <div className="px-5 py-2 bg-orange-50 border-b text-sm text-orange-700 font-medium flex items-center justify-between">
            <span>From: {restaurantName}</span>
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:underline"
            >
              Clear cart
            </button>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <FiShoppingCart size={48} className="opacity-20" />
              <p className="text-sm">Your cart is empty</p>
              <p className="text-xs opacity-70">Add dishes from the menu to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.menuId}
                className="flex items-center gap-4 bg-gray-50 rounded-xl p-3"
              >
                {/* Image placeholder */}
                <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[9px] uppercase font-bold">
                      No img
                    </div>
                  )}
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Rs {item.price.toLocaleString()} each
                  </p>
                  <p className="text-xs font-bold text-event-red mt-0.5">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-event-red hover:text-event-red transition-colors"
                  >
                    {item.quantity === 1 ? <FiTrash2 size={12} /> : <FiMinus size={12} />}
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-event-red hover:text-event-red transition-colors"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3 bg-white">
            {/* Subtotal rows */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({count} item{count !== 1 ? "s" : ""})</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery fee</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-3">
              <span>Total</span>
              <span className="text-event-red">Rs {total.toLocaleString()}</span>
            </div>
            <button
              onClick={() => { closeCart(); onCheckout(); }}
              className="w-full py-3 bg-event-navy text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
