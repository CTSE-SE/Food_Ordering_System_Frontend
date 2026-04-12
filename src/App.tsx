import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import OrderDetails from './pages/OrderDetails';
import CreateOrder from './pages/CreateOrder';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* Default redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="create-order" element={<CreateOrder />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;