import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiPackage, FiMapPin } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { Order, cancelOrder, getUserOrders } from "@/api/order.api";

// ── helpers ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { label: string; badge: string; dot: string }> = {
  pending:          { label: "Pending",          badge: "bg-yellow-100 text-yellow-700",  dot: "bg-yellow-400" },
  confirmed:        { label: "Confirmed",        badge: "bg-blue-100 text-blue-700",      dot: "bg-blue-400" },
  preparing:        { label: "Preparing",        badge: "bg-orange-100 text-orange-700",  dot: "bg-orange-400" },
  out_for_delivery: { label: "Out for Delivery", badge: "bg-purple-100 text-purple-700",  dot: "bg-purple-400" },
  delivered:        { label: "Delivered",        badge: "bg-green-100 text-green-700",    dot: "bg-green-500" },
  cancelled:        { label: "Cancelled",        badge: "bg-red-100 text-red-600",        dot: "bg-red-400" },
};

const PAYMENT_STYLES: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50",
  PAID:    "text-green-600 bg-green-50",
  FAILED:  "text-red-600 bg-red-50",
};

function formatAddress(addr: Order["shippingAddress"] | undefined): string {
  if (!addr) return "—";
  return [addr.street, addr.city, addr.postalCode, addr.country].filter(Boolean).join(", ");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── component ─────────────────────────────────────────────────────────────

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserOrders();
      if (res?.success) {
        setOrders(Array.isArray(res.data) ? res.data : []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await cancelOrder(orderId);
      if (res?.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
        );
        toast.success("Order cancelled");
      } else {
        toast.error(res?.message ?? "Failed to cancel order");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FiRefreshCw size={32} className="animate-spin mb-3 opacity-40" />
          <p className="text-sm">Loading orders…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FiPackage size={56} className="mb-3 opacity-25" />
          <p className="text-base font-medium">No orders yet</p>
          <p className="text-sm opacity-70 mt-1">Browse the menu and place your first order!</p>
          <a
            href="/"
            className="mt-4 px-5 py-2 bg-event-navy text-white text-sm font-semibold rounded-lg hover:bg-opacity-90"
          >
            Browse Menu
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = STATUS_STYLES[order.status] ?? {
              label: order.status,
              badge: "bg-gray-100 text-gray-600",
              dot: "bg-gray-400",
            };
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Card header — click to expand */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {order.orderId ?? `#${order.id.slice(-6).toUpperCase()}`}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Payment status */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PAYMENT_STYLES[order.paymentStatus] ?? "bg-gray-100 text-gray-500"}`}>
                      {order.paymentStatus}
                    </span>
                    {/* Order status */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
                      {s.label}
                    </span>
                    <span className="font-bold text-sm text-event-red">
                      Rs {order.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t px-5 py-4 space-y-4 bg-gray-50/50">
                    {/* Address */}
                    <div className="flex items-start gap-1.5 text-xs text-gray-500">
                      <FiMapPin size={12} className="mt-0.5 shrink-0" />
                      <span>{formatAddress(order.shippingAddress)}</span>
                    </div>

                    {/* Customer email */}
                    {order.userEmail && (
                      <p className="text-xs text-gray-400">Email: {order.userEmail}</p>
                    )}

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Items</p>
                      <div className="space-y-1.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name}
                              <span className="text-gray-400 ml-1">×{item.quantity}</span>
                            </span>
                            <span className="font-medium text-gray-800">
                              Rs {(item.totalPrice ?? item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between font-bold text-sm">
                        <span>Total</span>
                        <span className="text-event-red">Rs {order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Cancel */}
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancellingId === order.id}
                        className="text-sm text-red-500 border border-red-300 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order.id ? "Cancelling…" : "Cancel Order"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
