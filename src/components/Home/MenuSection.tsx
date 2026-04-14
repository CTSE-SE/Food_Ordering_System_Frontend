import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { getAllRestaurants, getMenuItemsByRestaurantId, Menu } from "@/api/restaurant.api";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface MenuItemWithRestaurant extends Menu {
  restaurantName: string;
}

interface MenuSectionProps {
  onCartOpen: () => void;
}

const MenuSection = ({ onCartOpen }: MenuSectionProps) => {
  const [menuItems, setMenuItems] = useState<MenuItemWithRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        const restResponse = await getAllRestaurants(1, 100);
        if (restResponse.success) {
          const restaurants = restResponse.data;

          const menuResults = await Promise.allSettled(
            restaurants.map(async (rest) => {
              const menuRes = await getMenuItemsByRestaurantId(rest.id);
              if (menuRes.success) {
                return menuRes.data.map((item) => ({
                  ...item,
                  restaurantName: rest.restaurantName,
                }));
              }
              return [];
            })
          );

          const allMenus = menuResults
            .filter(
              (r): r is PromiseFulfilledResult<MenuItemWithRestaurant[]> =>
                r.status === "fulfilled"
            )
            .flatMap((r) => r.value);

          setMenuItems(allMenus);
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMenus();
  }, []);

  const handleAddToCart = (item: MenuItemWithRestaurant) => {
    // Check login
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Please login to add items to cart");
      window.location.href = "/signin";
      return;
    }

    const result = addItem({
      menuId: item.id,
      name: item.name,
      price: item.price,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      image: item.mainImage,
    });

    if (result.conflict) {
      // User is trying to add from a different restaurant
      const confirmed = window.confirm(
        "Your cart has items from another restaurant. Clear the cart and add this item?"
      );
      if (confirmed) {
        useCartStore.getState().clearCart();
        addItem({
          menuId: item.id,
          name: item.name,
          price: item.price,
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          image: item.mainImage,
        });
      } else {
        return;
      }
    }

    // Brief "Added" feedback on the button
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);

    openCart();
    onCartOpen();
    toast.success(`${item.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-event-red" />
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50 font-Mainfront">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-event-navy mb-4">
            Explore Dishes from Our Restaurants
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best flavors from across our partner network, delivered
            fresh to your door.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true, el: ".menu-pagination" }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1000}
            spaceBetween={30}
            slidesPerView={1}
            loop={menuItems.length > 3}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {menuItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {item.mainImage ? (
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xs uppercase tracking-widest font-bold">
                          No Image
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-event-navy shadow-sm">
                      Rs {item.price.toLocaleString()}
                    </div>
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest bg-red-600 px-3 py-1 rounded-full">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-event-red bg-red-50 px-2 py-0.5 rounded">
                        {item.restaurantName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-event-navy mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                      {item.description}
                    </p>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200
                        ${!item.isAvailable
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : addedIds.has(item.id)
                          ? "bg-green-500 text-white"
                          : "bg-event-navy text-white hover:bg-opacity-90 active:scale-95"
                        }`}
                    >
                      {addedIds.has(item.id) ? (
                        <>
                          <FiCheck size={15} />
                          Added!
                        </>
                      ) : (
                        <>
                          <FiShoppingCart size={15} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex justify-center gap-2 menu-pagination mt-4" />
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
