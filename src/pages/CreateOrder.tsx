// pages/CreateOrder.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShippingAddress } from '../api/order.api';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);

  const addToCart = () => {
    if (!productId || !productName || !productPrice) {
      alert('Please fill in all product details');
      return;
    }

    const newItem: CartItem = {
      productId,
      name: productName,
      price: parseFloat(productPrice),
      quantity: parseInt(quantity),
    };

    setCartItems([...cartItems, newItem]);
    setProductId('');
    setProductName('');
    setProductPrice('');
    setQuantity('1');
  };

  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Please add at least one item to your order');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          menuId: '',
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      const response = await createOrder(orderData);
      
      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h2 style={styles.pageTitle}>Create New Order</h2>
      <p style={styles.pageDescription}>Add items from your cart and place your order</p>

      <div style={styles.grid}>
        {/* Cart Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Cart</h3>
          
          <div style={styles.addItemForm}>
            <h4 style={styles.subtitle}>Add Item</h4>
            <input
              type="text"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Price (LKR)"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              style={styles.input}
            />
            <button onClick={addToCart} style={styles.addButton}>
              Add to Cart
            </button>
          </div>

          {cartItems.length > 0 ? (
            <>
              <div style={styles.cartItems}>
                {cartItems.map((item, index) => (
                  <div key={index} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <div style={styles.cartItemName}>{item.name}</div>
                      <div style={styles.cartItemDetails}>
                        {item.quantity} x LKR {item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={styles.cartItemPrice}>
                      LKR {(item.price * item.quantity).toFixed(2)}
                      <button
                        onClick={() => removeFromCart(index)}
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total:</span>
                <span style={styles.totalValue}>LKR {totalAmount.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <p style={styles.emptyCart}>Your cart is empty. Add some items to continue.</p>
          )}
        </div>

        {/* Shipping Address Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Shipping Address</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Street Address"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              style={styles.input}
              required
            />
            
            <button
              type="submit"
              style={{ ...styles.submitButton, opacity: cartItems.length === 0 || loading ? 0.5 : 1 }}
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? 'Creating Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>

      {/* Order Summary */}
      <div style={styles.infoCard}>
        <h3 style={styles.cardTitle}>How It Works</h3>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div>Add items to your cart</div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div>Fill in shipping address</div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div>Place your order</div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <div>Track order status</div>
          </div>
        </div>
        <p style={styles.infoText}>
          Note: This is a demo interface. When connected to the backend, orders will be processed
          through the Order Service with stock reservation and SQS notifications.
        </p>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #bae6fd',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#374151',
  },
  addItemForm: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  addButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  cartItems: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: 500,
    marginBottom: '4px',
  },
  cartItemDetails: {
    fontSize: '12px',
    color: '#6b7280',
  },
  cartItemPrice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    fontWeight: 500,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '2px solid #e5e7eb',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '16px',
  },
  steps: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  step: {
    flex: 1,
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: '14px',
    color: '#075985',
    marginTop: '12px',
  },
};

export default CreateOrder;