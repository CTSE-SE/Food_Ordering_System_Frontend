# 🍽️ Restaurant & Order Service Integration Guide

## Overview

This guide explains how the **Restaurant Service** and **Order Service** are integrated in the Food Ordering System Frontend.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend Application                     │
│                                                           │
│  ┌──────────────────┐    ┌──────────────────┐           │
│  │ Restaurant API   │───▶│  Order API        │           │
│  │ - Restaurants    │    │  - Orders         │           │
│  │ - Menus          │    │  - Order Items    │           │
│  │ - Categories     │    │  - Status Updates │           │
│  └──────────────────┘    └──────────────────┘           │
│           │                        │                      │
│           └────────┬───────────────┘                      │
│                    ▼                                      │
│  ┌──────────────────────────────────┐                    │
│  │  RestaurantOrderService          │                    │
│  │  (Unified Service Layer)         │                    │
│  └──────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Backend Services (AWS)                       │
│                                                           │
│  http://shopapp-alb-1013507396.ap-southeast-1.           │
│  elb.amazonaws.com/api                                   │
│                                                           │
│  - /restaurants (Restaurant Service)                     │
│  - /orders (Order Service)                               │
└─────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. **Order from Restaurant Menu**

Users can browse restaurant menus and create orders directly:

```typescript
import { restaurantOrderService } from './services/restaurantOrderService';

// Get restaurant menu
const menu = await restaurantOrderService.getRestaurantMenu(restaurantId);

// Create order from menu items
const order = await restaurantOrderService.createRestaurantOrder(
  restaurantId,
  [
    { menu: menuItem1, quantity: 2 },
    { menu: menuItem2, quantity: 1 }
  ],
  shippingAddress
);
```

### 2. **Restaurant Orders Management**

Restaurants can view and manage their orders:

```typescript
// Get all orders for a restaurant
const orders = await restaurantOrderService.getRestaurantOrders(restaurantId);

// Update order status
await restaurantOrderService.updateOrderStatus(orderId, 'CONFIRMED');
```

### 3. **User Orders with Restaurant Info**

Users can see which restaurant their orders are from:

```typescript
// Get user's orders
const orders = await restaurantOrderService.getUserOrders(userId);

// Each order contains restaurant information
orders.forEach(order => {
  console.log(order.restaurantName);
  console.log(order.restaurantId);
});
```

## API Endpoints

### Restaurant Service

```typescript
GET    /restaurants                    - Get all restaurants
GET    /restaurants/:id                - Get restaurant by ID
GET    /restaurants/:id/menu           - Get restaurant menu
POST   /restaurants                    - Create restaurant
```

### Order Service

```typescript
POST   /orders                         - Create order
GET    /orders/:id                     - Get order by ID
GET    /orders/user/:userId            - Get user orders
DELETE /orders/:id                     - Cancel order
PUT    /orders/:id/status              - Update order status
GET    /orders/restaurant/:restaurantId - Get restaurant orders
```

## Usage Examples

### Example 1: Browse Restaurants and Order Food

```typescript
import { restaurantOrderService } from './services/restaurantOrderService';

// 1. Get all restaurants
const restaurants = await restaurantOrderService.getAllRestaurants();

// 2. Get menu for selected restaurant
const menu = await restaurantOrderService.getRestaurantMenu('rest-123');

// 3. Filter available items
const availableItems = restaurantOrderService.getAvailableItems(menu);

// 4. Create order
const order = await restaurantOrderService.createRestaurantOrder(
  'rest-123',
  [
    { menu: availableItems[0], quantity: 2 },
    { menu: availableItems[1], quantity: 1 }
  ],
  {
    street: '123 Main St',
    city: 'Colombo',
    postalCode: '10100',
    country: 'Sri Lanka'
  }
);
```

### Example 2: Restaurant Dashboard

```typescript
// Get all orders for restaurant
const orders = await restaurantOrderService.getRestaurantOrders('rest-123');

// Update order status
await restaurantOrderService.updateOrderStatus('order-456', 'PREPARING');
await restaurantOrderService.updateOrderStatus('order-789', 'READY');
```

### Example 3: User Order History

```typescript
// Get user orders
const orders = await restaurantOrderService.getUserOrders('user-123');

// Display orders with restaurant info
orders.forEach(order => {
  console.log(`Order ${order.orderId} from ${order.restaurantName}`);
  console.log(`Status: ${order.status}`);
  console.log(`Total: LKR ${order.totalAmount}`);
});
```

## Key Features

### ✅ **Complete Integration**
- Restaurant menus linked to order creation
- Order tracking with restaurant information
- Unified service layer for easy development

### ✅ **Demo Mode Support**
- Works without authentication (demo mode)
- Falls back to mock data if API fails
- Real backend integration when tokens available

### ✅ **Type Safety**
- Full TypeScript support
- Type-safe API responses
- Interface definitions for all entities

### ✅ **Error Handling**
- Graceful error handling
- Fallback to demo mode
- User-friendly error messages

## File Structure

```
src/
├── api/
│   ├── restaurant.api.ts      # Restaurant service API
│   └── order.api.ts            # Order service API (integrated)
├── services/
│   ├── restaurantOrderService.ts  # Unified service layer
│   ├── orderService.ts         # Legacy order service (demo mode)
│   └── mockData.ts            # Mock data for demo
└── utils/
    └── customFetch.ts         # Axios instance with base URL
```

## Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api
VITE_ORDER_SERVICE_URL=http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders
VITE_RESTAURANT_SERVICE_URL=http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/restaurants
VITE_DEMO_MODE=true
```

### Authentication

The integration supports both authenticated and demo modes:

```typescript
// Authenticated mode
localStorage.setItem('token', 'your-jwt-token');

// Demo mode (no token needed)
// App automatically uses mock data
```

## Data Flow

### Creating an Order from Restaurant Menu

```
1. User browses restaurants
   ↓
2. User selects restaurant
   ↓
3. Fetch restaurant menu
   ↓
4. User adds items to cart
   ↓
5. User proceeds to checkout
   ↓
6. Create order with:
   - Restaurant ID
   - Menu items
   - Shipping address
   ↓
7. Order created in backend
   ↓
8. Order appears in:
   - User's order history
   - Restaurant's order dashboard
```

## Testing

### Test Restaurant Integration

```bash
# Start development server
npm start

# Test in browser console
const service = await import('./services/restaurantOrderService');

// Get restaurants
const restaurants = await service.restaurantOrderService.getAllRestaurants();

// Get menu
const menu = await service.restaurantOrderService.getRestaurantMenu('rest-id');

// Create order
const order = await service.restaurantOrderService.createRestaurantOrder(
  'rest-id',
  [{ menu: menu[0], quantity: 1 }],
  { street: '123 Main St', city: 'Colombo', postalCode: '10100', country: 'Sri Lanka' }
);
```

## Troubleshooting

### Issue: Restaurant menu not loading
**Solution**: Check if restaurant ID is valid and restaurant exists

### Issue: Order creation fails
**Solution**: 
- Verify menu items have correct IDs
- Check shipping address is complete
- Ensure restaurant ID is included

### Issue: Orders not showing for restaurant
**Solution**: 
- Verify restaurant ID matches
- Check authentication token
- Review backend API logs

## Next Steps

1. **Add Payment Integration** - Connect payment gateway
2. **Real-time Updates** - Add WebSocket for live order tracking
3. **Push Notifications** - Notify users of order status changes
4. **Reviews & Ratings** - Allow users to rate restaurants
5. **Order Analytics** - Dashboard with order statistics

## Support

For issues or questions:
- Check browser console for error messages
- Review API responses in Network tab
- Test endpoints with Postman/cURL
- Check backend service logs

---

**Version**: 1.0.0  
**Last Updated**: April 12, 2026  
**Branch**: feature/order
