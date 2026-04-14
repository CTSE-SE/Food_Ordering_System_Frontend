import hero from "/Images/Home/hero.webp";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleBrowseMenu = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      navigate("/user-dashboard/menu");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="flex flex-col relative justify-center items-center xl:relative xl:items-baseline gap-y-5 xl:gap-y-0 xl:mt-0 w-full font-PlusSans px-[15px] md:px-0 xl:pr-0 max-w-[1920px] mx-auto mt-[15px] md:mt-0">
      <div className="relative w-full">
        <img src={hero} alt="Hero Image" />
        <div className="absolute inset-0 bg-black/55" />
        {/* Content */}
        <div className="absolute left-[10%] top-[40%] -translate-y-1/2 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-white font-Mainfront text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-tight"
          >
            Order Delicious Food
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
            className="text-event-blue font-Mainfront text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-tight block"
          >
            Right To Your Door
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
            className="mt-6 text-lg font-Mainfront md:text-xl text-gray-200 max-w-[600px]"
          >
            Explore our restaurant menu and get your favourite dishes delivered
            fresh and fast.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 2 }}
            className="mt-8"
          >
            <button
              onClick={handleBrowseMenu}
              className="bg-event-blue hover:bg-blue-700 text-white font-Mainfront px-8 py-3 rounded-lg transition-colors duration-300"
            >
              Browse Menu
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
