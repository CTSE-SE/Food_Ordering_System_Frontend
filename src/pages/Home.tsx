import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Hero from "@/components/Home/Hero";
import MenuSection from "@/components/Home/MenuSection";
import CartDrawer from "@/components/UI/CartDrawer";
import CheckoutModal from "@/components/UI/CheckoutModal";

const Home = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleOrderSuccess = (orderId: string) => {
    toast.success(`Order #${orderId.slice(-6).toUpperCase()} placed successfully!`);
  };

  return (
    <div>
      <Hero />
      <MenuSection onCartOpen={() => {}} />

      {/* Cart slide-out */}
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={(orderId) => {
          setCheckoutOpen(false);
          handleOrderSuccess(orderId);
          navigate("/user-dashboard/orders");
        }}
      />
    </div>
  );
};

export default Home;
