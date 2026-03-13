import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/UI/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import UserLayout from "./pages/UserDashboard/UserLayout";
import Profile from "./pages/UserDashboard/Profile";
import Users from "./pages/AdminDashboard/pages/Users";

import Staff from "./pages/AdminDashboard/pages/Staff";
import Overview from "./pages/AdminDashboard/pages/Overview";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="staff" element={<Staff />} />
      </Route>
    </Routes>
  );
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" />
        <Route path="settings" />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/admin-dashboard/*" element={<AdminRoutes />} />
        <Route path="/user-dashboard/*" element={<UserRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
