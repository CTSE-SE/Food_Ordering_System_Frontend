// pages/OrdersList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService, Order } from '../services/orderService';
import toast from 'react-hot-toast';

const OrdersList: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual user ID from auth context
        const userId = localStorage.getItem('userId') || 'user-123';
        const response = await orderService.getUserOrders(userId);
        
        if (response.success && response.data) {
          setOrders(response.data);
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        const errorMessage = error.response?.data?.error || 'Failed to load orders';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  // Auto-refresh every 5 seconds to catch new orders
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastOrderUpdate') {
        setRefreshTrigger(prev => prev + 1);
      }
    };
    
    const handleCustomEvent = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orderUpdated', handleCustomEvent);
    
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderUpdated', handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

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

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}>My Orders</h2>
          <p style={styles.pageDescription}>View and track all your orders</p>
        </div>
        <Link to="/create-order" style={styles.createButton}>
          + Create New Order
        </Link>
      </div>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.statusFilters}>
          {statusFilters.map(filterItem => (
            <button
              key={filterItem.value}
              onClick={() => setFilter(filterItem.value)}
              style={{
                ...styles.filterButton,
                backgroundColor: filter === filterItem.value ? '#3b82f6' : '#fff',
                color: filter === filterItem.value ? '#fff' : '#374151',
                borderColor: filter === filterItem.value ? '#3b82f6' : '#e5e7eb',
              }}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
        
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div style={styles.ordersTable}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Order ID</th>
              <th style={styles.tableHeaderCell}>Date</th>
              <th style={styles.tableHeaderCell}>Items</th>
              <th style={styles.tableHeaderCell}>Total Amount</th>
              <th style={styles.tableHeaderCell}>Status</th>
              <th style={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <span style={styles.orderId}>{order.orderId}</span>
                </td>
                <td style={styles.tableCell}>{formatDate(order.createdAt || '')}</td>
                <td style={styles.tableCell}>{order.items.length} items</td>
                <td style={styles.tableCell}>LKR {order.totalAmount.toFixed(2)}</td>
                <td style={styles.tableCell}>
                  <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                    {order.status}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <Link to={`/orders/${order.orderId}`} style={styles.viewButton}>
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div style={styles.emptyState}>
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '18px',
    color: '#6b7280',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#111827',
  },
  pageDescription: {
    color: '#6b7280',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'background-color 0.2s',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statusFilters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  filterButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  searchBox: {
    marginTop: '12px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
  },
  ordersTable: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '16px',
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s',
  },
  tableCell: {
    padding: '16px',
    color: '#111827',
  },
  orderId: {
    fontWeight: 500,
    color: '#3b82f6',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    display: 'inline-block',
  },
  viewButton: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: 500,
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#6b7280',
  },
};

export default OrdersList;