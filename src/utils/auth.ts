// utils/auth.ts

/**
 * Set authentication token
 * Call this after login or use it to set a demo token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  console.log('Auth token set successfully');
};

/**
 * Set user ID
 * Call this after login
 */
export const setUserId = (userId: string): void => {
  localStorage.setItem('userId', userId);
  console.log('User ID set:', userId);
};

/**
 * Clear all auth data
 */
export const clearAuth = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  console.log('Auth data cleared');
};

/**
 * Get current auth status
 */
export const getAuthStatus = (): { hasToken: boolean; userId: string | null } => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  return {
    hasToken: !!token,
    userId: userId || 'user-123 (default)',
  };
};

/**
 * Setup demo credentials for testing
 * This will set a demo token if your backend supports it
 */
export const setupDemoCredentials = (): void => {
  // You can replace this with an actual token from your backend
  const demoToken = prompt('Enter your auth token (or leave empty to skip):');
  if (demoToken) {
    setAuthToken(demoToken);
    setUserId('user-123');
    alert('Demo credentials set! Refresh the page.');
  } else {
    alert('No token entered. The app will show authentication errors.');
  }
};
