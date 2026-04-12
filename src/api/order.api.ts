import customFetch from "../utils/customFetch";
import { Menu } from "./restaurant.api";

export interface OrderItem {
    id: string;
    menuId: string;
    name: string;
    quantity: number;
    price: number;
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
    restaurantId?: string;
    restaurantName?: string;
    items: OrderItem[];
    totalAmount: number;
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    shippingAddress: ShippingAddress;
    createdAt: string;
    updatedAt: string;
}

export interface OrderApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface CreateOrderRequest {
    items: {
        menuId: string;
        productId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    restaurantId?: string;
    shippingAddress: ShippingAddress;
}

// Create a new order
export const createOrder = async (data: CreateOrderRequest, token?: string): Promise<OrderApiResponse<Order>> => {
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    // Transform the request to match backend API format
    const orderData = {
        items: data.items.map(item => ({
            productId: item.productId || item.menuId,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
        })),
        restaurantId: data.restaurantId,
        shippingAddress: data.shippingAddress,
    };
    
    const response = await customFetch.post("/orders", orderData, {
        headers: authToken ? {
            Authorization: `Bearer ${authToken}`
        } : {}
    });
    return response.data;
};

// Get user's orders
export const getUserOrders = async (userId?: string, token?: string): Promise<OrderApiResponse<Order[]>> => {
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    const uid = userId || localStorage.getItem("userId") || "user-123";
    
    const response = await customFetch.get(`/orders/user/${uid}`, {
        headers: authToken ? {
            Authorization: `Bearer ${authToken}`
        } : {}
    });
    return response.data;
};

// Get order by ID
export const getOrderById = async (id: string, token?: string): Promise<OrderApiResponse<Order>> => {
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    const response = await customFetch.get(`/orders/${id}`, {
        headers: authToken ? {
            Authorization: `Bearer ${authToken}`
        } : {}
    });
    return response.data;
};

// Cancel an order
export const cancelOrder = async (id: string, token?: string): Promise<OrderApiResponse<Order>> => {
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    const response = await customFetch.delete(`/orders/${id}`, {
        headers: authToken ? {
            Authorization: `Bearer ${authToken}`
        } : {}
    });
    return response.data;
};

// Update order status
export const updateOrderStatus = async (id: string, status: string, token?: string): Promise<OrderApiResponse<Order>> => {
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    const response = await customFetch.put(`/orders/${id}/status`, { status }, {
        headers: authToken ? {
            Authorization: `Bearer ${authToken}`
        } : {}
    });
    return response.data;
};

// Get orders by restaurant ID
export const getRestaurantOrders = async (restaurantId: string, token?: string): Promise<OrderApiResponse<Order[]>> => {
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    const response = await customFetch.get(`/orders/restaurant/${restaurantId}`, {
        headers: authToken ? {
            Authorization: `Bearer ${authToken}`
        } : {}
    });
    return response.data;
};

// Create order from menu items
export const createOrderFromMenu = async (
    menuItems: { menu: Menu; quantity: number }[],
    restaurantId: string,
    shippingAddress: ShippingAddress,
    token?: string
): Promise<OrderApiResponse<Order>> => {
    const orderData: CreateOrderRequest = {
        items: menuItems.map(({ menu, quantity }) => ({
            menuId: menu.id,
            productId: menu.id,
            name: menu.name,
            quantity,
            price: menu.price,
        })),
        restaurantId,
        shippingAddress,
    };
    
    return await createOrder(orderData, token);
};
