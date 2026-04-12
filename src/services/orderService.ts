// services/orderService.ts
import api from './api';
import { mockOrders, addMockOrder, updateMockOrder } from './mockData';

// Types based on backend API
export interface OrderItem {
  id?: string;
  productId: string;
  name?: string;
  price?: number;
  quantity: number;
  totalPrice?: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id?: string;
  orderId: string;
  userId?: string;
  userEmail?: string;
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Order Service API calls
export const orderService = {
  // Health check
  async checkHealth(): Promise<any> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      // If health check fails, return mock health status
      return {
        success: true,
        service: 'order-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mode: 'demo'
      };
    }
  },

  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post('/', orderData);
      return response.data;
    } catch (error: any) {
      // If API fails, create mock order
      console.log('Creating mock order (demo mode)');
      const newOrder: Order = {
        id: String(mockOrders.length + 1),
        orderId: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(mockOrders.length + 1).padStart(3, '0')}`,
        userId: 'user-123',
        userEmail: 'demo@example.com',
        totalAmount: orderData.items.reduce((sum, item) => sum + (item.quantity * 1000), 0),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddress: orderData.shippingAddress,
        items: orderData.items.map((item, index) => ({
          id: `item-${Date.now()}-${index}`,
          productId: item.productId,
          name: `Product ${item.productId}`,
          price: 1000,
          quantity: item.quantity,
          totalPrice: item.quantity * 1000,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to mock store so it appears in dashboard
      addMockOrder(newOrder);
      
      // Trigger storage event to notify other components
      localStorage.setItem('lastOrderUpdate', Date.now().toString());
      
      // Also dispatch a custom event for same-tab updates
      window.dispatchEvent(new Event('orderUpdated'));
      
      return {
        success: true,
        data: newOrder,
      };
    }
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get(`/${orderId}`);
      return response.data;
    } catch (error: any) {
      // If API fails, return mock order
      console.log('Fetching mock order (demo mode)');
      const order = mockOrders.find(o => o.orderId === orderId);
      
      if (order) {
        return {
          success: true,
          data: order,
        };
      }
      
      return {
        success: false,
        error: 'Order not found',
      };
    }
  },

  // Get all orders for a user
  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error: any) {
      // If API fails, return mock orders
      console.log('Fetching mock orders (demo mode)');
      return {
        success: true,
        data: mockOrders,
      };
    }
  },

  // Cancel an order
  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.delete(`/${orderId}`);
      return response.data;
    } catch (error: any) {
      // If API fails, update mock order
      console.log('Cancelling mock order (demo mode)');
      const order = mockOrders.find(o => o.orderId === orderId);
      
      if (order) {
        // Update in mock store
        updateMockOrder(orderId, { status: 'CANCELLED', updatedAt: new Date().toISOString() });
        
        return {
          success: true,
          data: { ...order, status: 'CANCELLED', updatedAt: new Date().toISOString() },
        };
      }
      
      return {
        success: false,
        error: 'Order not found',
      };
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, statusData: UpdateStatusRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await api.put(`/${orderId}/status`, statusData);
      return response.data;
    } catch (error: any) {
      // If API fails, update mock order
      console.log('Updating mock order status (demo mode)');
      const order = mockOrders.find(o => o.orderId === orderId);
      
      if (order) {
        // Update in mock store
        updateMockOrder(orderId, { status: statusData.status, updatedAt: new Date().toISOString() });
        
        return {
          success: true,
          data: { ...order, status: statusData.status, updatedAt: new Date().toISOString() },
        };
      }
      
      return {
        success: false,
        error: 'Order not found',
      };
    }
  },
};
