import { useState, useEffect } from "react";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { getAllRestaurants, getMenuItemsByRestaurantId, Menu } from "@/api/restaurant.api";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";

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

  if (menuItems.length === 0) {
    return (
      <section className="py-16 px-6 bg-gray-50 font-Mainfront">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-event-navy mb-4">
            Explore Dishes from Our Restaurants
          </h2>
          <p className="text-gray-400 mt-8">No menu items available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-6 bg-gray-50 font-Mainfront">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-event-navy mb-2">
          Explore Dishes from Our Restaurants
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm">
          Discover the best flavours from across our partner network, delivered
          fresh to your door.
        </p>
      </div>

      {/* Responsive grid — fills all available width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
              {item.mainImage ? (
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FiShoppingCart size={32} />
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
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold text-event-red bg-red-50 px-2 py-0.5 rounded self-start mb-2">
                {item.restaurantName}
              </span>
              <h3 className="text-base font-bold text-event-navy mb-1 line-clamp-1">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                {item.description}
              </p>

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
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
