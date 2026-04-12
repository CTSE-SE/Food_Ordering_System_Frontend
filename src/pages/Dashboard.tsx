// pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService, Order } from '../services/orderService';
import toast from 'react-hot-toast';

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual user ID from auth context
        const userId = localStorage.getItem('userId') || 'user-123';
        const response = await orderService.getUserOrders(userId);
        
        if (response.success && response.data) {
          const orders = response.data;
          
          // Calculate stats
          const calculatedStats: OrderStats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'PENDING').length,
            shippedOrders: orders.filter(o => o.status === 'SHIPPED').length,
            deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
            cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
          };
          
          setStats(calculatedStats);
          
          // Get recent orders (last 4)
          const sortedOrders = orders.sort((a, b) => 
            new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
          );
          setRecentOrders(sortedOrders.slice(0, 4));
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error.response?.data?.error || 'Failed to load dashboard data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  // Force refresh function that can be called from other components
  const forceRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Listen for storage events (when new orders are created)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastOrderUpdate') {
        forceRefresh();
      }
    };
    
    const handleCustomEvent = () => {
      forceRefresh();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orderUpdated', handleCustomEvent);
    
    // Also set up a periodic refresh every 5 seconds
    const interval = setInterval(forceRefresh, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderUpdated', handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: '#f59e0b',
      CONFIRMED: '#10b981',
      PROCESSING: '#3b82f6',
      SHIPPED: '#8b5cf6',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div style={{ ...styles.statCard, borderLeftColor: color }}>
      <div style={styles.statIcon}>{icon}</div>
      <div>
        <div style={styles.statTitle}>{title}</div>
        <div style={styles.statValue}>{loading ? '-' : value}</div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard Overview</h2>
      <p style={styles.pageDescription}>Welcome back! Here's what's happening with your orders today.</p>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📊" color="#3b82f6" />
        <StatCard title="Pending" value={stats.pendingOrders} icon="⏳" color="#f59e0b" />
        <StatCard title="Shipped" value={stats.shippedOrders} icon="🚚" color="#8b5cf6" />
        <StatCard title="Delivered" value={stats.deliveredOrders} icon="✅" color="#10b981" />
        <StatCard title="Cancelled" value={stats.cancelledOrders} icon="❌" color="#ef4444" />
      </div>

      {/* Recent Orders Table */}
      <div style={styles.recentOrders}>
        <h3 style={styles.sectionTitle}>Recent Orders</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Order ID</th>
                <th style={styles.tableHeaderCell}>Date</th>
                <th style={styles.tableHeaderCell}>Total</th>
                <th style={styles.tableHeaderCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <Link to={`/orders/${order.orderId}`} style={styles.orderLink}>
                      {order.orderId}
                    </Link>
                  </td>
                  <td style={styles.tableCell}>{formatDate(order.createdAt || '')}</td>
                  <td style={styles.tableCell}>LKR {order.totalAmount.toFixed(2)}</td>
                  <td style={styles.tableCell}>
                    <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#111827',
  },
  pageDescription: {
    color: '#6b7280',
    marginBottom: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderLeft: '4px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    fontSize: '32px',
  },
  statTitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
  },
  recentOrders: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#111827',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '2px solid #e5e7eb',
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '12px',
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
  },
  tableCell: {
    padding: '12px',
    color: '#111827',
  },
  orderLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    display: 'inline-block',
  },
};

export default Dashboard;