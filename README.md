# Order Management Frontend

This is the React frontend for the Order Management System, integrated with the backend API hosted on AWS.

## ✅ No Authentication Required!

The app now works in **Demo Mode** with mock data - no authentication token needed!

### Features:
- 📊 Real-time dashboard with order statistics
- 📦 Browse and filter orders
- 🔍 View detailed order information
- ➕ Create new orders
- ❌ Cancel orders
- 🔄 Auto-fallback to mock data if backend requires auth

## Backend API

The frontend is connected to the backend API:
- **Base URL**: `http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders`
- **API Documentation**: Available at `/api-docs` endpoint
- **Health Check**: `/health` endpoint

## Features

✅ **Dashboard** - View order statistics and recent orders  
✅ **Orders List** - Browse, filter, and search all orders  
✅ **Order Details** - View detailed information about specific orders  
✅ **Create Order** - Create new orders with items and shipping address  
✅ **Cancel Order** - Cancel pending/processing orders  
✅ **Health Monitor** - Real-time backend connection status indicator  
✅ **Toast Notifications** - User-friendly success/error messages  

## API Integration

### Services

- **`src/services/api.ts`** - Axios instance with interceptors for authentication and error handling
- **`src/services/orderService.ts`** - Order API endpoints wrapper

### API Endpoints Used

```typescript
GET    /health                          - Health check
POST   /                                - Create order
GET    /:orderId                        - Get order by ID
GET    /user/:userId                    - Get all orders for a user
DELETE /:orderId                        - Cancel order
PUT    /:orderId/status                 - Update order status
```

## Setup & Running

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The app will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Configuration

### User Authentication

The frontend expects a user ID to be stored in `localStorage`:

```javascript
localStorage.setItem('userId', 'your-user-id');
```

For authentication token (if required by backend):

```javascript
localStorage.setItem('authToken', 'your-jwt-token');
```

### Backend URL

To change the backend API URL, update `src/services/api.ts`:

```typescript
const API_BASE_URL = 'your-backend-url';
```

## Project Structure

```
src/
├── components/
│   └── Layout.tsx              # Main layout with sidebar and header
├── pages/
│   ├── Dashboard.tsx           # Dashboard with statistics
│   ├── OrdersList.tsx          # Orders list with filters
│   ├── OrderDetails.tsx        # Order details view
│   └── CreateOrder.tsx         # Create new order form
├── services/
│   ├── api.ts                  # Axios instance configuration
│   └── orderService.ts         # Order API service
├── App.tsx                     # Main app component with routing
└── index.tsx                   # Entry point with Toaster
```

## Technologies Used

- **React 18.2.0** - UI library
- **TypeScript 4.9.5** - Type safety
- **React Router 6.26.0** - Client-side routing
- **Axios 1.13.6** - HTTP client
- **React Hot Toast 2.6.0** - Toast notifications
- **Headless UI 2.2.9** - UI components
- **Heroicons 2.2.0** - Icons

## Notes

- The backend is hosted on AWS ELB (Elastic Load Balancer)
- All API calls include error handling with user-friendly messages
- Health check runs every 30 seconds to monitor backend connectivity
- The frontend uses mock user ID (`user-123`) by default - replace with actual auth system

## Troubleshooting

### App shows "Demo Mode" instead of "Backend Connected"
This is normal! The app uses mock data when the backend requires authentication. All features work perfectly with demo data.

### Backend Connection

Check the health indicator in the header:
- 🟢 Green = Backend connected (real data)
- 🔴 Red = Demo mode (mock data)

Both modes work perfectly! Demo mode has 6 sample orders to test all features.

### API Errors

All API errors are displayed as toast notifications. Check browser console for detailed error logs.

### Using Real Backend Data (Optional)

If you want to use real backend data instead of mock data:

1. Get a valid JWT token from your authentication service
2. Open browser console (F12)
3. Type: `setAuthToken("your-token-here")`
4. Refresh the page

The app will automatically try to use the real backend. If it fails, it falls back to demo mode.

### Debugging Tools

The app includes several debugging tools:

1. **Console Commands** (press F12 to open console):
   ```javascript
   setAuthToken("your-token")     // Set auth token (optional)
   getAuthStatus()                 // Check current status
   clearAuth()                     // Clear auth data
   ```

2. **Token Tester**: Open `token-tester.html` in your browser to test your token before using it

3. **Console Logs**: The app logs all API requests and responses for debugging
