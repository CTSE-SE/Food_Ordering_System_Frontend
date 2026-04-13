import customFetch from "../utils/customFetch";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
}

export interface UpdateStatusRequest {
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export interface OrderApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createOrder = async (data: CreateOrderRequest): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.post("/orders", data);
  return response.data;
};

export const getOrderById = async (id: string): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.get(`/orders/${id}`);
  return response.data;
};

export const getUserOrders = async (userId: string): Promise<OrderApiResponse<Order[]>> => {
  const response = await customFetch.get(`/orders/user/${userId}`);
  return response.data;
};

export const cancelOrder = async (id: string): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.delete(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: UpdateStatusRequest): Promise<OrderApiResponse<Order>> => {
  const response = await customFetch.put(`/orders/${id}/status`, status);
  return response.data;
};

export const checkHealth = async (): Promise<any> => {
  const response = await customFetch.get("/orders/health");
  return response.data;
};
