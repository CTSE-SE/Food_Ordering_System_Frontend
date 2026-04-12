// Order Service - Simplified version without restaurant integration
import {
    Order,
    CreateOrderRequest,
    UpdateOrderStatusRequest,
    getOrders,
    getOrderById,
    createOrder as createOrderAPI,
    updateOrderStatus,
    cancelOrder,
    getUserOrders,
} from '../api/order.api';
import { 
    mockOrders, 
    addMockOrder, 
    updateMockOrder 
} from './mockData';

// Demo mode is always enabled
const DEMO_MODE = true;

export interface OrdersResponse {
    data: Order[];
    total: number;
    page: number;
    totalPages: number;
}

export const fetchOrders = async (
    page: number = 0,
    size: number = 10,
    status?: string,
    token?: string
): Promise<OrdersResponse> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 300));
            let filteredOrders = [...mockOrders];

            if (status && status !== 'All') {
                filteredOrders = filteredOrders.filter(order => order.status === status);
            }

            const start = page * size;
            const end = start + size;
            const paginatedOrders = filteredOrders.slice(start, end);

            return {
                data: paginatedOrders,
                total: filteredOrders.length,
                page: page,
                totalPages: Math.ceil(filteredOrders.length / size),
            };
        }

        const response = await getOrders(page, size, status, token);
        return {
            data: response.data,
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
        };
    } catch (error: any) {
        if (DEMO_MODE) {
            let filteredOrders = [...mockOrders];
            if (status && status !== 'All') {
                filteredOrders = filteredOrders.filter(order => order.status === status);
            }
            const start = page * size;
            const end = start + size;
            const paginatedOrders = filteredOrders.slice(start, end);

            return {
                data: paginatedOrders,
                total: filteredOrders.length,
                page: page,
                totalPages: Math.ceil(filteredOrders.length / size),
            };
        }
        throw error;
    }
};

export const fetchOrderById = async (orderId: string, token?: string): Promise<Order> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const order = mockOrders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');
            return order;
        }

        const response = await getOrderById(orderId);
        return response.data;
    } catch (error: any) {
        if (DEMO_MODE) {
            const order = mockOrders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');
            return order;
        }
        throw error;
    }
};

export const createOrder = async (
    orderData: CreateOrderRequest,
    token?: string
): Promise<Order> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newOrder: Order = {
                orderId: `ORD-${Date.now()}`,
                orderDate: new Date().toISOString(),
                items: orderData.items,
                status: 'PENDING',
                shippingAddress: orderData.shippingAddress,
                totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                paymentStatus: 'PENDING',
            };

            addMockOrder(newOrder);
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            window.dispatchEvent(new Event('orderUpdated'));
            return newOrder;
        }

        const response = await createOrderAPI(orderData);
        return response.data;
    } catch (error: any) {
        if (DEMO_MODE) {
            const newOrder: Order = {
                orderId: `ORD-${Date.now()}`,
                orderDate: new Date().toISOString(),
                items: orderData.items,
                status: 'PENDING',
                shippingAddress: orderData.shippingAddress,
                totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                paymentStatus: 'PENDING',
            };

            addMockOrder(newOrder);
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            window.dispatchEvent(new Event('orderUpdated'));
            return newOrder;
        }
        throw error;
    }
};

export const updateOrder = async (
    orderId: string,
    statusData: UpdateOrderStatusRequest,
    token?: string
): Promise<Order> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 300));
            updateMockOrder(orderId, { status: statusData.status });
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            window.dispatchEvent(new Event('orderUpdated'));
            const order = mockOrders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');
            return order;
        }

        const response = await updateOrderStatus(orderId, statusData, token);
        return response.data;
    } catch (error: any) {
        if (DEMO_MODE) {
            updateMockOrder(orderId, { status: statusData.status });
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            window.dispatchEvent(new Event('orderUpdated'));
            const order = mockOrders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');
            return order;
        }
        throw error;
    }
};

export const cancelOrderAPI = async (
    orderId: string,
    reason: string,
    token?: string
): Promise<Order> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 300));
            updateMockOrder(orderId, {
                status: 'CANCELLED',
            });
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            window.dispatchEvent(new Event('orderUpdated'));
            const order = mockOrders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');
            return order;
        }

        const response = await cancelOrder(orderId, reason, token);
        return response.data;
    } catch (error: any) {
        if (DEMO_MODE) {
            updateMockOrder(orderId, {
                status: 'CANCELLED',
            });
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            window.dispatchEvent(new Event('orderUpdated'));
            const order = mockOrders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');
            return order;
        }
        throw error;
    }
};

export const fetchUserOrders = async (
    page: number = 0,
    size: number = 10,
    token?: string
): Promise<OrdersResponse> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const start = page * size;
            const end = start + size;
            const paginatedOrders = mockOrders.slice(start, end);

            return {
                data: paginatedOrders,
                total: mockOrders.length,
                page: page,
                totalPages: Math.ceil(mockOrders.length / size),
            };
        }

        const response = await getUserOrders(page, size);
        return {
            data: response.data,
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
        };
    } catch (error: any) {
        if (DEMO_MODE) {
            const start = page * size;
            const end = start + size;
            const paginatedOrders = mockOrders.slice(start, end);

            return {
                data: paginatedOrders,
                total: mockOrders.length,
                page: page,
                totalPages: Math.ceil(mockOrders.length / size),
            };
        }
        throw error;
    }
};

export const getStatusCounts = async (token?: string): Promise<Record<string, number>> => {
    try {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const counts: Record<string, number> = {};
            mockOrders.forEach(order => {
                counts[order.status] = (counts[order.status] || 0) + 1;
            });
            return counts;
        }

        const response = await getOrders(0, 1000, undefined, token);
        const counts: Record<string, number> = {};
        response.data.forEach(order => {
            counts[order.status] = (counts[order.status] || 0) + 1;
        });
        return counts;
    } catch (error: any) {
        if (DEMO_MODE) {
            const counts: Record<string, number> = {};
            mockOrders.forEach(order => {
                counts[order.status] = (counts[order.status] || 0) + 1;
            });
            return counts;
        }
        throw error;
    }
};
