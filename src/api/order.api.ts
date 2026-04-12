// Order API - Clean version without restaurant integration
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders';

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    menuId: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    token?: string;
}

export interface UpdateOrderStatusRequest {
    status: string;
    reason?: string;
}

export interface Order {
    orderId: string;
    orderDate: string;
    items: OrderItem[];
    status: string;
    shippingAddress: ShippingAddress;
    totalAmount: number;
    paymentStatus: string;
}

export interface OrderApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const getOrders = async (
    page: number = 0,
    size: number = 10,
    status?: string,
    token?: string
): Promise<PaginatedResponse<Order>> => {
    try {
        const params: any = { page, size };
        if (status && status !== 'All') params.status = status;

        const response = await axios.get(`${API_BASE_URL}/all`, { params });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getOrderById = async (orderId: string): Promise<OrderApiResponse<Order>> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orderId}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const createOrder = async (
    orderData: CreateOrderRequest
): Promise<OrderApiResponse<Order>> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/place-order`, orderData);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const updateOrderStatus = async (
    orderId: string,
    statusData: UpdateOrderStatusRequest,
    token?: string
): Promise<OrderApiResponse<Order>> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${orderId}/status`, statusData);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const cancelOrder = async (
    orderId: string,
    reason: string,
    token?: string
): Promise<OrderApiResponse<Order>> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${orderId}/cancel`, { reason });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const getUserOrders = async (
    page: number = 0,
    size: number = 10
): Promise<PaginatedResponse<Order>> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my-orders`, {
            params: { page, size },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
