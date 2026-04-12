# 🔐 Authentication Setup Guide

## Problem
Your backend requires authentication tokens for API calls. The error "No token provided" means you need to set an auth token.

## Solution - 3 Easy Steps

### Step 1: Get Your Auth Token

You need to get a valid JWT token from your backend. There are several ways:

#### Option A: Login via your Auth Service
If you have a login/authentication service, login there and copy the JWT token.

#### Option B: Generate Token Manually
If you have access to your backend, you can generate a test token.

#### Option C: Check Backend Documentation
Look at your backend's Swagger docs at:
```
http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders/api-docs/
```

### Step 2: Set the Token in the App

Once you have the token, you have **two options**:

#### Option 1: Use the UI Button (Easiest)
1. Look for the 🔑 (key) button in the header
2. Click it
3. Paste your token in the prompt
4. Click OK
5. Refresh the page

#### Option 2: Use Browser Console
1. Open browser console (F12)
2. Type this command:
```javascript
setAuthToken("paste-your-token-here")
```
3. Press Enter
4. Refresh the page

### Step 3: Verify It Works

After setting the token and refreshing:
- ✅ The health indicator should be green
- ✅ Dashboard should load with your order statistics
- ✅ Orders list should display your orders
- ✅ No more "Authentication required" errors

## Debug Commands

Open browser console (F12) and use these commands:

```javascript
// Check current auth status
getAuthStatus()

// Set auth token
setAuthToken("your-token-here")

// Set user ID (if needed)
setUserId("your-user-id")

// Clear all auth data
clearAuth()
```

## Common Issues

### Issue: Still getting "No token provided"
**Solution**: Make sure you:
1. Set the token correctly
2. Refreshed the page after setting it
3. The token is valid and not expired

### Issue: Token is invalid or expired
**Solution**: Get a fresh token from your authentication service

### Issue: CORS errors
**Solution**: Make sure your backend allows requests from `http://localhost:3000` or `http://localhost:3001`

## Testing Without Authentication

If you want to test the frontend without authentication temporarily, you can:

1. Comment out the auth check in your backend
2. Or create a test token that never expires
3. Or add a demo/test endpoint that doesn't require auth

## Need Help?

Check the browser console for detailed error messages. The app now logs:
- API request URLs
- Whether auth token is being sent
- Detailed error responses from the backend
