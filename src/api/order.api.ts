// import customFetch from "../utils/customFetch";

// export interface OrderItem {
//     id: string;
//     menuId: string;
//     name: string;
//     quantity: number;
//     price: number;
// }

// export interface Order {
//     id: string;
//     userId: string;
//     restaurantId: string;
//     items: OrderItem[];
//     totalAmount: number;
//     status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
//     deliveryAddress: string;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface OrderApiResponse<T> {
//     success: boolean;
//     message: string;
//     data: T;
// }

// export const createOrder = async (data: Partial<Order>): Promise<OrderApiResponse<Order>> => {
//     const response = await customFetch.post("/orders", data);
//     return response.data;
// };

// export const getUserOrders = async (): Promise<OrderApiResponse<Order[]>> => {
//     const response = await customFetch.get("/orders/user");
//     return response.data;
// };

// export const getOrderById = async (id: string): Promise<OrderApiResponse<Order>> => {
//     const response = await customFetch.get(`/orders/${id}`);
//     return response.data;
// };
