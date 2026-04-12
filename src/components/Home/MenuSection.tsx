import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { getAllRestaurants, getMenuItemsByRestaurantId, Menu } from "@/api/restaurant.api";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface MenuItemWithRestaurant extends Menu {
  restaurantName: string;
}

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState<MenuItemWithRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        const restResponse = await getAllRestaurants(1, 100);
        console.log("Restaurants response:", restResponse);
        if (restResponse.success) {
          const restaurants = restResponse.data;
          console.log("Found restaurants:", restaurants.length);

          // Fetch menus for all restaurants in parallel
          const menuPromises = restaurants.map(async (rest) => {
            const menuRes = await getMenuItemsByRestaurantId(rest.id);
            if (menuRes.success) {
              return menuRes.data.map(item => ({
                ...item,
                restaurantName: rest.restaurantName
              }));
            }
            return [];
          });

          const allMenusNested = await Promise.all(menuPromises);
          const allMenusFlattened = allMenusNested.flat();

          // Shuffle or sort if needed, here we just take the first few or all
          console.log("All menu items aggregated:", allMenusFlattened.length);
          setMenuItems(allMenusFlattened);
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMenus();
  }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-event-red"></div>
    </div>
  );

  return (
    <section className="py-16 px-4 bg-gray-50 font-Mainfront">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-event-navy mb-4">
            Explore Dishes from Our Restaurants
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best flavors from across our partner network, delivered fresh to your door.
          </p>
        </div>



        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".menu-pagination",
            }}
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
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              }
            }}
            className="pb-12"
          >
            {menuItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col group">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {item.mainImage ? (
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-event-navy shadow-sm">
                      Rs {item.price.toLocaleString()}
                    </div>
                  </div>
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
                    <button className="w-full py-2 bg-event-navy text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors">
                      Add to Card
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
