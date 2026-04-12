// services/mockData.ts
// Mock data for demo mode - no authentication required
// This is a mutable store that updates when orders are created/cancelled

import { Order, ShippingAddress } from './orderService';

const mockAddress: ShippingAddress = {
  street: '123 Main Street',
  city: 'Colombo',
  postalCode: '10100',
  country: 'Sri Lanka',
};

// Mutable mock orders store
export let mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-20260412-001',
    userId: 'user-123',
    userEmail: 'maleesha@example.com',
    totalAmount: 2500.00,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    shippingAddress: mockAddress,
    items: [
      {
        id: 'item-1',
        productId: 'prod-001',
        name: 'Classic Burger',
        price: 450.00,
        quantity: 2,
        totalPrice: 900.00,
      },
      {
        id: 'item-2',
        productId: 'prod-002',
        name: 'French Fries',
        price: 350.00,
        quantity: 1,
        totalPrice: 350.00,
      },
      {
        id: 'item-3',
        productId: 'prod-003',
        name: 'Soft Drink',
        price: 250.00,
        quantity: 5,
        totalPrice: 1250.00,
      },
    ],
    createdAt: '2026-04-12T10:30:00Z',
    updatedAt: '2026-04-12T10:30:00Z',
  },
  {
    id: '2',
    orderId: 'ORD-20260411-002',
    userId: 'user-123',
    userEmail: 'maleesha@example.com',
    totalAmount: 1890.00,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        id: 'item-4',
        productId: 'prod-004',
        name: 'Pizza Margherita',
        price: 1200.00,
        quantity: 1,
        totalPrice: 1200.00,
      },
      {
        id: 'item-5',
        productId: 'prod-005',
        name: 'Garlic Bread',
        price: 350.00,
        quantity: 2,
        totalPrice: 690.00,
      },
    ],
    createdAt: '2026-04-11T14:20:00Z',
    updatedAt: '2026-04-11T15:00:00Z',
  },
  {
    id: '3',
    orderId: 'ORD-20260410-003',
    userId: 'user-123',
    userEmail: 'maleesha@example.com',
    totalAmount: 3200.00,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        id: 'item-6',
        productId: 'prod-006',
        name: 'Chicken Biryani',
        price: 800.00,
        quantity: 2,
        totalPrice: 1600.00,
      },
      {
        id: 'item-7',
        productId: 'prod-007',
        name: 'Tandoori Chicken',
        price: 1200.00,
        quantity: 1,
        totalPrice: 1200.00,
      },
      {
        id: 'item-8',
        productId: 'prod-008',
        name: 'Naan Bread',
        price: 200.00,
        quantity: 2,
        totalPrice: 400.00,
      },
    ],
    createdAt: '2026-04-10T12:15:00Z',
    updatedAt: '2026-04-11T09:30:00Z',
  },
  {
    id: '4',
    orderId: 'ORD-20260409-004',
    userId: 'user-123',
    userEmail: 'maleesha@example.com',
    totalAmount: 1500.00,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        id: 'item-9',
        productId: 'prod-009',
        name: 'Pasta Carbonara',
        price: 950.00,
        quantity: 1,
        totalPrice: 950.00,
      },
      {
        id: 'item-10',
        productId: 'prod-010',
        name: 'Caesar Salad',
        price: 550.00,
        quantity: 1,
        totalPrice: 550.00,
      },
    ],
    createdAt: '2026-04-09T16:45:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: '5',
    orderId: 'ORD-20260408-005',
    userId: 'user-123',
    userEmail: 'maleesha@example.com',
    totalAmount: 2100.00,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    shippingAddress: mockAddress,
    items: [
      {
        id: 'item-11',
        productId: 'prod-011',
        name: 'Sushi Platter',
        price: 1800.00,
        quantity: 1,
        totalPrice: 1800.00,
      },
      {
        id: 'item-12',
        productId: 'prod-012',
        name: 'Miso Soup',
        price: 300.00,
        quantity: 1,
        totalPrice: 300.00,
      },
    ],
    createdAt: '2026-04-08T11:30:00Z',
    updatedAt: '2026-04-09T14:20:00Z',
  },
  {
    id: '6',
    orderId: 'ORD-20260407-006',
    userId: 'user-123',
    userEmail: 'maleesha@example.com',
    totalAmount: 750.00,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    shippingAddress: mockAddress,
    items: [
      {
        id: 'item-13',
        productId: 'prod-013',
        name: 'Fish and Chips',
        price: 750.00,
        quantity: 1,
        totalPrice: 750.00,
      },
    ],
    createdAt: '2026-04-07T13:00:00Z',
    updatedAt: '2026-04-07T15:30:00Z',
  },
];

/**
 * Add a new order to the mock store
 */
export const addMockOrder = (order: Order): void => {
  mockOrders.unshift(order); // Add to beginning of array
  console.log('✅ New order added to mock store:', order.orderId);
};

/**
 * Update an existing order in the mock store
 */
export const updateMockOrder = (orderId: string, updates: Partial<Order>): void => {
  const index = mockOrders.findIndex(o => o.orderId === orderId);
  if (index !== -1) {
    mockOrders[index] = { ...mockOrders[index], ...updates };
    console.log('✅ Order updated in mock store:', orderId);
  }
};

/**
 * Get all mock orders (returns a copy to prevent direct mutation)
 */
export const getMockOrders = (): Order[] => {
  return [...mockOrders];
};
