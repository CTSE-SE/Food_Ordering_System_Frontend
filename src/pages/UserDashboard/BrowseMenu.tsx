import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import MenuSection from "@/components/Home/MenuSection";
import CartDrawer from "@/components/UI/CartDrawer";
import CheckoutModal from "@/components/UI/CheckoutModal";

export default function BrowseMenu() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <MenuSection onCartOpen={() => {}} />

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
}
