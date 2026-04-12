// pages/OrderDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../api/order.api';
import { fetchOrderById, updateOrder, cancelOrderAPI } from '../services/orderService';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fetch order details from backend
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const response = await fetchOrderById(orderId);
        
        if (response) {
          setOrder(response);
        } else {
          toast.error('Failed to fetch order details');
          navigate('/orders');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

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

  const getPaymentStatusColor = (status: string) => {
    return status === 'PAID' ? '#10b981' : status === 'PENDING' ? '#f59e0b' : '#ef4444';
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    setCancelling(true);
    try {
      const response = await cancelOrderAPI(order.orderId, 'Customer requested cancellation');
      
      if (response) {
        toast.success('Order cancelled successfully');
        setOrder(response);
        setShowCancelModal(false);
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to cancel order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={styles.errorContainer}>
        <p>Order not found</p>
        <button onClick={() => navigate('/orders')} style={styles.backButton}>
          ← Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/orders')} style={styles.backButton}>
        ← Back to Orders
      </button>

      <div style={styles.header}>
        <div>
          <h2 style={styles.orderIdTitle}>Order #{order.orderId}</h2>
          <p style={styles.orderDate}>Placed on {new Date(order.orderDate).toLocaleString()}</p>
        </div>
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
          <button onClick={() => setShowCancelModal(true)} style={styles.cancelButton}>
            Cancel Order
          </button>
        )}
      </div>

      <div style={styles.grid}>
        {/* Order Status */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Order Status</h3>
          <div style={styles.statusContainer}>
            <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
              {order.status}
            </span>
            {order.paymentStatus && (
              <span style={{ ...styles.statusBadge, backgroundColor: getPaymentStatusColor(order.paymentStatus) + '20', color: getPaymentStatusColor(order.paymentStatus) }}>
                {order.paymentStatus}
              </span>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Shipping Address</h3>
          <div style={styles.address}>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}</p>
            <p>{order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Order Items</h3>
        <div style={styles.itemsContainer}>
          {order.items.map((item, index) => (
            <div key={index} style={styles.orderItem}>
              <div style={styles.itemInfo}>
                <div style={styles.itemName}>{item.name || `Product ${item.productId}`}</div>
                <div style={styles.itemDetails}>Quantity: {item.quantity}</div>
              </div>
              <div style={styles.itemPrice}>
                LKR {((item.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div style={styles.totalContainer}>
          <span style={styles.totalLabel}>Total Amount:</span>
          <span style={styles.totalAmount}>LKR {order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Order Timeline - Removed as backend doesn't provide timeline data */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Order Information</h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>User Email:</span>
          <span style={styles.infoValue}>{order.orderId || 'N/A'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Last Updated:</span>
          <span style={styles.infoValue}>{new Date(order.orderDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Cancel Order</h3>
            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button onClick={() => setShowCancelModal(false)} style={styles.modalCancelBtn}>
                No, Keep Order
              </button>
              <button onClick={handleCancelOrder} style={styles.modalConfirmBtn} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  errorContainer: {
    textAlign: 'center',
    padding: '48px',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    padding: '8px 0',
    marginBottom: '20px',
    fontSize: '14px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  orderIdTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px',
  },
  orderDate: {
    color: '#6b7280',
    fontSize: '14px',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827',
  },
  statusContainer: {
    display: 'flex',
    gap: '12px',
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500,
    display: 'inline-block',
  },
  address: {
    color: '#374151',
    lineHeight: '1.6',
  },
  itemsContainer: {
    borderBottom: '1px solid #e5e7eb',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 500,
    marginBottom: '4px',
  },
  itemDetails: {
    fontSize: '14px',
    color: '#6b7280',
  },
  itemPrice: {
    fontWeight: 500,
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '2px solid #e5e7eb',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  timeline: {
    position: 'relative',
    paddingLeft: '20px',
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '30px',
  },
  timelineDot: {
    position: 'absolute',
    left: '-20px',
    top: '0',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    border: '2px solid #fff',
    boxShadow: '0 0 0 2px #3b82f6',
  },
  timelineLine: {
    position: 'absolute',
    left: '-15px',
    top: '12px',
    width: '2px',
    height: 'calc(100% - 12px)',
    backgroundColor: '#e5e7eb',
  },
  timelineContent: {
    paddingLeft: '16px',
  },
  timelineStatus: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  timelineDescription: {
    fontSize: '14px',
    color: '#374151',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  infoLabel: {
    fontWeight: 500,
    color: '#6b7280',
  },
  infoValue: {
    color: '#111827',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  modalCancelBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  modalConfirmBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default OrderDetails;