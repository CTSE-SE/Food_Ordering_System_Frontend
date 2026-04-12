// services/mockData.ts
// Mock data for demo mode - no authentication required
// This is a mutable store that updates when orders are created/cancelled

import { Order, ShippingAddress } from '../api/order.api';

const mockAddress: ShippingAddress = {
  street: '123 Main Street',
  city: 'Colombo',
  state: 'Western',
  postalCode: '10100',
  country: 'Sri Lanka',
};

// Initialize mock orders from localStorage or use default data
const getInitialOrders = (): Order[] => {
  const stored = localStorage.getItem('mockOrders');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored orders:', e);
    }
  }
  return defaultMockOrders;
};

const defaultMockOrders: Order[] = [
  {
    orderId: 'ORD-20260412-001',
    orderDate: '2026-04-12T10:30:00Z',
    totalAmount: 2500.00,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    shippingAddress: mockAddress,
    items: [
      {
        menuId: '',
        productId: 'prod-001',
        name: 'Classic Burger',
        price: 450.00,
        quantity: 2,
      },
      {
        menuId: '',
        productId: 'prod-002',
        name: 'French Fries',
        price: 350.00,
        quantity: 1,
      },
      {
        menuId: '',
        productId: 'prod-003',
        name: 'Soft Drink',
        price: 250.00,
        quantity: 5,
      },
    ],
  },
  {
    orderId: 'ORD-20260411-002',
    orderDate: '2026-04-11T14:20:00Z',
    totalAmount: 1890.00,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        menuId: '',
        productId: 'prod-004',
        name: 'Pizza Margherita',
        price: 1200.00,
        quantity: 1,
      },
      {
        menuId: '',
        productId: 'prod-005',
        name: 'Garlic Bread',
        price: 350.00,
        quantity: 2,
      },
    ],
  },
  {
    orderId: 'ORD-20260410-003',
    orderDate: '2026-04-10T12:15:00Z',
    totalAmount: 3200.00,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        menuId: '',
        productId: 'prod-006',
        name: 'Chicken Biryani',
        price: 800.00,
        quantity: 2,
      },
      {
        menuId: '',
        productId: 'prod-007',
        name: 'Tandoori Chicken',
        price: 1200.00,
        quantity: 1,
      },
      {
        menuId: '',
        productId: 'prod-008',
        name: 'Naan Bread',
        price: 200.00,
        quantity: 2,
      },
    ],
  },
  {
    orderId: 'ORD-20260409-004',
    orderDate: '2026-04-09T16:45:00Z',
    totalAmount: 1500.00,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        menuId: '',
        productId: 'prod-009',
        name: 'Pasta Carbonara',
        price: 950.00,
        quantity: 1,
      },
      {
        menuId: '',
        productId: 'prod-010',
        name: 'Caesar Salad',
        price: 550.00,
        quantity: 1,
      },
    ],
  },
  {
    orderId: 'ORD-20260408-005',
    orderDate: '2026-04-08T11:30:00Z',
    totalAmount: 2100.00,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        menuId: '',
        productId: 'prod-011',
        name: 'Sushi Platter',
        price: 1800.00,
        quantity: 1,
      },
      {
        menuId: '',
        productId: 'prod-012',
        name: 'Miso Soup',
        price: 300.00,
        quantity: 1,
      },
    ],
  },
  {
    orderId: 'ORD-20260407-006',
    orderDate: '2026-04-07T13:00:00Z',
    totalAmount: 750.00,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    shippingAddress: mockAddress,
    items: [
      {
        menuId: '',
        productId: 'prod-013',
        name: 'Fish and Chips',
        price: 750.00,
        quantity: 1,
      },
    ],
  },
];

// Export mutable mock orders (initialized from localStorage or defaults)
export let mockOrders: Order[] = getInitialOrders();

/**
 * Save current mock orders to localStorage
 */
const saveOrdersToStorage = (orders: Order[]): void => {
  localStorage.setItem('mockOrders', JSON.stringify(orders));
};

/**
 * Add a new order to the mock store
 */
export const addMockOrder = (order: Order): void => {
  mockOrders.unshift(order); // Add to beginning of array
  saveOrdersToStorage(mockOrders); // Persist to localStorage
  console.log('✅ New order added to mock store:', order.orderId);
};

/**
 * Update an existing order in the mock store
 */
export const updateMockOrder = (orderId: string, updates: Partial<Order>): void => {
  const index = mockOrders.findIndex(o => o.orderId === orderId);
  if (index !== -1) {
    mockOrders[index] = { ...mockOrders[index], ...updates };
    saveOrdersToStorage(mockOrders); // Persist to localStorage
    console.log('✅ Order updated in mock store:', orderId);
  }
};

/**
 * Get all mock orders (returns a copy to prevent direct mutation)
 */
export const getMockOrders = (): Order[] => {
  return [...mockOrders];
};
