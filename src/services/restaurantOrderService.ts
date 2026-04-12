// services/restaurantOrderService.ts
// Unified service connecting Restaurant and Order services

import { 
    getAllRestaurants, 
    getRestaurantById, 
    getMenuByRestaurantId,
    Restaurant,
    Menu 
} from '../api/restaurant.api';

import {
    createOrder,
    createOrderFromMenu,
    getUserOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getRestaurantOrders,
    Order,
    ShippingAddress,
    OrderApiResponse
} from '../api/order.api';

/**
 * Restaurant-Order Integrated Service
 * Provides seamless integration between restaurant menu and ordering system
 */
export const restaurantOrderService = {
    // ========== Restaurant Functions ==========
    
    /**
     * Get all available restaurants
     */
    async getAllRestaurants(): Promise<Restaurant[]> {
        try {
            const response = await getAllRestaurants();
            return response.data || [];
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return [];
        }
    },

    /**
     * Get restaurant details by ID
     */
    async getRestaurant(restaurantId: string): Promise<Restaurant | null> {
        try {
            const response = await getRestaurantById(restaurantId);
            return response.data || null;
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            return null;
        }
    },

    /**
     * Get restaurant menu
     */
    async getRestaurantMenu(restaurantId: string): Promise<Menu[]> {
        try {
            const response = await getMenuByRestaurantId(restaurantId);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching menu:', error);
            return [];
        }
    },

    // ========== Order Functions ==========

    /**
     * Create order from restaurant menu items
     */
    async createRestaurantOrder(
        restaurantId: string,
        menuItems: { menu: Menu; quantity: number }[],
        shippingAddress: ShippingAddress,
        token?: string
    ): Promise<OrderApiResponse<Order>> {
        try {
            const order = await createOrderFromMenu(
                menuItems,
                restaurantId,
                shippingAddress,
                token
            );
            return order;
        } catch (error: any) {
            console.error('Error creating restaurant order:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create order'
            };
        }
    },

    /**
     * Get user's orders
     */
    async getUserOrders(userId?: string): Promise<Order[]> {
        try {
            const response = await getUserOrders(userId);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return [];
        }
    },

    /**
     * Get orders for a specific restaurant
     */
    async getRestaurantOrders(restaurantId: string): Promise<Order[]> {
        try {
            const response = await getRestaurantOrders(restaurantId);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching restaurant orders:', error);
            return [];
        }
    },

    /**
     * Get order details
     */
    async getOrder(orderId: string): Promise<Order | null> {
        try {
            const response = await getOrderById(orderId);
            return response.data || null;
        } catch (error) {
            console.error('Error fetching order:', error);
            return null;
        }
    },

    /**
     * Cancel an order
     */
    async cancelOrder(orderId: string): Promise<OrderApiResponse<Order>> {
        try {
            const response = await cancelOrder(orderId);
            return response;
        } catch (error: any) {
            console.error('Error cancelling order:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to cancel order'
            };
        }
    },

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: string, status: string): Promise<OrderApiResponse<Order>> {
        try {
            const response = await updateOrderStatus(orderId, status);
            return response;
        } catch (error: any) {
            console.error('Error updating order status:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update order status'
            };
        }
    },

    // ========== Helper Functions ==========

    /**
     * Calculate total price for menu items
     */
    calculateTotal(menuItems: { menu: Menu; quantity: number }[]): number {
        return menuItems.reduce((total, { menu, quantity }) => {
            return total + (menu.price * quantity);
        }, 0);
    },

    /**
     * Filter menu by category
     */
    filterMenuByCategory(menu: Menu[], categoryId: string): Menu[] {
        return menu.filter(item => item.category?.id === categoryId);
    },

    /**
     * Get available menu items only
     */
    getAvailableItems(menu: Menu[]): Menu[] {
        return menu.filter(item => item.isAvailable);
    },

    /**
     * Search menu items
     */
    searchMenuItems(menu: Menu[], searchTerm: string): Menu[] {
        const term = searchTerm.toLowerCase();
        return menu.filter(item => 
            item.name.toLowerCase().includes(term) || 
            item.description?.toLowerCase().includes(term)
        );
    }
};

export default restaurantOrderService;
