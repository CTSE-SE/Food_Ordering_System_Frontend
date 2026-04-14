import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBell,
  FiPackage,
  FiGrid,
  FiShoppingCart,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import NavBar from "@/components/UI/NavBar";
import CartDrawer from "@/components/UI/CartDrawer";
import CheckoutModal from "@/components/UI/CheckoutModal";
import { useCartStore } from "@/store/cartStore";

const navLinks = [
  { path: "menu",          title: "Browse Menu",   icon: <FiGrid /> },
  { path: "profile",       title: "My Profile",    icon: <FiUser /> },
  { path: "orders",        title: "My Orders",     icon: <FiPackage /> },
  { path: "notifications", title: "Notifications", icon: <FiBell /> },
];

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/").pop();
  const { totalItems, openCart } = useCartStore();
  const cartCount = totalItems();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">User Dashboard</h1>
          </div>
          <nav className="mt-4">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 ${
                  currentPath === item.path
                    ? "bg-gray-50 text-event-red"
                    : "text-gray-700"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}

            {/* Cart — opens the slide-out drawer */}
            <button
              onClick={openCart}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-50 text-gray-700 text-left"
            >
              <span className="mr-3 relative">
                <FiShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold text-white bg-event-red rounded-full leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              My Cart
              {cartCount > 0 && (
                <span className="ml-auto text-xs font-semibold text-event-red">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {currentPath !== "menu" && (
            <header className="bg-white shadow-sm">
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold">
                  {navLinks.find((item) => item.path === currentPath)?.title}
                </h2>
              </div>
            </header>
          )}

          <main className={currentPath === "menu" ? "" : "p-6"}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Cart drawer — always mounted so it opens from any tab */}
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={(orderId) => {
          setCheckoutOpen(false);
          toast.success(`Order #${orderId.slice(-6).toUpperCase()} placed!`);
          navigate("/user-dashboard/orders");
        }}
      />
    </div>
  );
};

export default UserLayout;
