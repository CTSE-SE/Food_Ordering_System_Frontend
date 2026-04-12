// utils/consoleGuide.ts
import { setAuthToken, setUserId, getAuthStatus, clearAuth } from './auth';

/**
 * Setup helpful console commands for debugging
 */
export const setupConsoleGuide = (): void => {
  console.log('%c🚀 Order Management System', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
  console.log('%c================================', 'color: #6b7280;');
  console.log('%c✅ Demo Mode Enabled - No Authentication Required!', 'font-size: 14px; font-weight: bold; color: #10b981;');
  
  console.log('%c\n📋 App Status:', 'font-size: 14px; font-weight: bold; color: #10b981;');
  console.log('  - Mode: Demo (using mock data)');
  console.log('  - Backend: http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders');
  console.log('  - Status: Ready to use! 🎉');
  
  console.log('%c\n🔧 Available Commands:', 'font-size: 14px; font-weight: bold; color: #8b5cf6;');
  console.log('%c  setAuthToken("your-token")', 'color: #3b82f6; font-weight: bold;');
  console.log('    → Set auth token (optional, if you want to use real backend)');
  
  console.log('%c  setUserId("user-id")', 'color: #3b82f6; font-weight: bold;');
  console.log('    → Set user ID');
  
  console.log('%c  clearAuth()', 'color: #3b82f6; font-weight: bold;');
  console.log('    → Clear all authentication data');
  
  console.log('%c  getAuthStatus()', 'color: #3b82f6; font-weight: bold;');
  console.log('    → Check current auth status');
  
  console.log('%c\n💡 Note:', 'font-size: 14px; font-weight: bold; color: #f59e0b;');
  console.log('  The app works with mock data by default.');
  console.log('  No authentication needed!');
  
  console.log('%c\n🌐 Backend API:', 'font-size: 14px; font-weight: bold; color: #10b981;');
  console.log('  URL: http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders');
  console.log('  Health: /health');
  console.log('  Docs: /api-docs');
  
  // Make functions available globally
  (window as any).setAuthToken = setAuthToken;
  (window as any).setUserId = setUserId;
  (window as any).clearAuth = clearAuth;
  (window as any).getAuthStatus = getAuthStatus;
  
  console.log('%c================================', 'color: #6b7280;');
};
