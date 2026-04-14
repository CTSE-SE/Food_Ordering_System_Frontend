import customFetch from "../utils/customFetch";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderId: string;           // e.g. ORD-20260326-001
  userId: string;
  userEmail: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getCurrentUserId(): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    return user._id ?? user.id ?? "";
  } catch {
    return "";
  }
}

// ── Endpoints ──────────────────────────────────────────────────────────────

/** POST /api/orders — items + shippingAddress only */
export const createOrder = async (
  data: CreateOrderRequest
): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.post("/orders", data);
  return response.data;
};

/** GET /api/orders/user/{userId} */
export const getUserOrders = async (): Promise<OrderApiResponse<Order[]>> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("No user ID found — please log in again");
  const response = await customFetch.get(`/orders/user/${userId}`);
  return response.data;
};

/** GET /api/orders/{id} */
export const getOrderById = async (
  id: string
): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.get(`/orders/${id}`);
  return response.data;
};

/** DELETE /api/orders/{id} */
export const cancelOrder = async (
  id: string
): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.delete(`/orders/${id}`);
  return response.data;
};

/** PUT /api/orders/{id}/status */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.put(`/orders/${id}/status`, { status });
  return response.data;
};
