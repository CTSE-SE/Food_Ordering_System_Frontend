import { useState } from "react";
import { FiMapPin, FiFileText, FiLoader, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { createOrder, ShippingAddress } from "@/api/order.api";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

const EMPTY_ADDRESS: ShippingAddress = {
  street: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, restaurantId, restaurantName, totalAmount, clearCart } = useCartStore();
  const [addr, setAddr] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [instructions, setInstructions] = useState("");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  if (!isOpen) return null;

  const total = totalAmount();

  const setField = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!addr.street.trim() || !addr.city.trim() || !addr.country.trim()) {
      toast.error("Please fill in Street, City and Country");
      return;
    }
    if (!restaurantId) return;

    setPlacing(true);
    try {
      // 1. Create order
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.menuId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          street:     addr.street.trim(),
          city:       addr.city.trim(),
          postalCode: addr.postalCode.trim(),
          country:    addr.country.trim(),
        },
      };
      console.log("Order payload being sent:", JSON.stringify(orderPayload, null, 2));

      const orderRes = await createOrder({
        items: items.map((i) => ({
          productId: i.menuId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          street:     addr.street.trim(),
          city:       addr.city.trim(),
          postalCode: addr.postalCode.trim(),
          country:    addr.country.trim(),
        },
      });

      if (!orderRes.success) {
        toast.error(orderRes.message || "Failed to place order");
        return;
      }

      const orderId = orderRes.data?.id ?? orderRes.data?.orderId ?? "N/A";
      setPlacedOrderId(orderId);

      // Email + in-app notification are handled automatically by the
      // notification service's SQS consumer when it processes order.placed.

      clearCart();
      setDone(true);
      onSuccess(orderId);
    } catch (err: any) {
      const serverData = err?.response?.data;
      const msg =
        serverData?.message ??
        serverData?.error ??
        (typeof serverData === "string" ? serverData : null) ??
        "Something went wrong. Please try again.";
      console.error("Order error response:", serverData);
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const handleClose = () => {
    setDone(false);
    setAddr(EMPTY_ADDRESS);
    setInstructions("");
    onClose();
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-event-red/30 focus:border-event-red";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* ── Success state ── */}
        {done ? (
          <div className="flex flex-col items-center justify-center py-14 px-8 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Order Placed!</h3>
            <p className="text-gray-500 text-sm">
              Your order{" "}
              <span className="font-bold text-event-navy">
                {placedOrderId}
              </span>{" "}
              has been received. You'll get a confirmation email shortly.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="/user-dashboard/orders"
                className="px-5 py-2 bg-event-navy text-white text-sm font-semibold rounded-lg hover:bg-opacity-90"
              >
                Track Order
              </a>
              <button
                onClick={handleClose}
                className="px-5 py-2 border border-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Confirm Order</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Order summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Order Summary — {restaurantName}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.menuId} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-400">×{item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-800">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-event-red">Rs {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-3">
                  <FiMapPin size={14} className="text-event-red" />
                  Shipping Address *
                </label>
                <div className="space-y-2">
                  <input
                    className={inputCls}
                    placeholder="Street address *"
                    value={addr.street}
                    onChange={setField("street")}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className={inputCls}
                      placeholder="City *"
                      value={addr.city}
                      onChange={setField("city")}
                    />
                    <input
                      className={inputCls}
                      placeholder="Postal code *"
                      value={addr.postalCode}
                      onChange={setField("postalCode")}
                    />
                  </div>
                  <input
                    className={inputCls}
                    placeholder="Country *"
                    value={addr.country}
                    onChange={setField("country")}
                  />
                </div>
              </div>

              {/* Special instructions */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <FiFileText size={14} className="text-gray-500" />
                  Special Instructions <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. No onions, extra sauce, ring doorbell…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-event-red/30 focus:border-event-red resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="flex-1 py-2.5 bg-event-red text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><FiLoader size={15} className="animate-spin" /> Placing…</>
                ) : (
                  `Place Order — Rs ${total.toLocaleString()}`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
