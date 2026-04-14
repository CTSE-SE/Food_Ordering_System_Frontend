import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Home/Hero";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        // Logged-in users go to their dashboard where they can browse the menu
        navigate("/user-dashboard", { replace: true });
      }
    } catch {
      // ignore
    }
  }, [navigate]);

  return (
    <div>
      <Hero />
    </div>
  );
};

export default Home;
