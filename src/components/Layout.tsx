// components/Layout.tsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/orders', label: 'My Orders', icon: '📦' },
    { path: '/create-order', label: 'Create Order', icon: '➕' },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? '260px' : '70px' }}>
        <div style={styles.sidebarHeader}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleBtn}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          {sidebarOpen && <h2 style={styles.logo}>🍔 OrderHub</h2>}
        </div>
        
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span style={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerTitle}>
            <h1>Order Management System</h1>
            <p style={styles.subtitle}>Track and manage your orders</p>
          </div>
          <div style={styles.headerRight}>
            {backendHealthy !== null && (
              <div style={styles.healthIndicator}>
                <div style={{ ...styles.healthDot, backgroundColor: backendHealthy ? '#10b981' : '#ef4444' }} />
                <span style={styles.healthText}>
                  {backendHealthy ? '' : 'Demo Mode'}
                </span>
              </div>
            )}
            <div style={styles.userInfo}>
              <div style={styles.avatar}>MR</div>
              <div>
                <div style={styles.userName}>Maleesha Rashani</div>
                <div style={styles.userEmail}>maleesha@example.com</div>
              </div>
            </div>
          </div>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  sidebar: {
    backgroundColor: '#1f2937',
    color: '#fff',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #374151',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
    color: '#fff',
  },
  nav: {
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#d1d5db',
    transition: 'all 0.2s',
    fontSize: '14px',
  },
  navIcon: {
    fontSize: '20px',
  },
  navLabel: {
    fontWeight: 500,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#fff',
    padding: '20px 32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  healthIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  healthDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  healthText: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#374151',
  },
  headerTitle: {
    flex: 1,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '4px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 500,
  },
  userEmail: {
    fontSize: '12px',
    color: '#6b7280',
  },
  content: {
    padding: '32px',
    flex: 1,
  },
};

export default Layout;