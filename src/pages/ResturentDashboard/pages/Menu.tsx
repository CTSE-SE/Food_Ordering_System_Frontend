import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import Table from "@/components/Table/Table";
import Modal from "@/components/UI/Modal";
import { BounceLoader } from "react-spinners";
import {
  getMenuItemsByRestaurantId,
  getCategoriesByRestaurantId,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenuAvailability,
  getMyRestaurant,
  Menu,
  Category
} from "@/api/restaurant.api";
import { FiPlus, FiBox } from "react-icons/fi";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    isAvailable: true,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  const columns = [
    { header: "Name", accessor: "name" },
    {
      header: "Category",
      accessor: "categoryId",
      cell: (value: string) => categories.find(c => c.id === value)?.name || "Unknown"
    },
    {
      header: "Price",
      accessor: "price",
      cell: (value: number) => `Rs ${value.toLocaleString()}`
    },
    {
      header: "Availability",
      accessor: "isAvailable",
      cell: (value: boolean, row: Menu) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleAvailability(row);
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {value ? "Available" : "Unavailable"}
        </button>
      ),
    },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const restResponse = await getMyRestaurant();
      if (restResponse.success) {
        setRestaurantId(restResponse.data.id);
        const [menuRes, catRes] = await Promise.all([
          getMenuItemsByRestaurantId(restResponse.data.id),
          getCategoriesByRestaurantId(restResponse.data.id)
        ]);

        if (menuRes.success) setMenuItems(menuRes.data);
        if (catRes.success) setCategories(catRes.data);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshMenu = async () => {
    if (!restaurantId) return;
    try {
      const response = await getMenuItemsByRestaurantId(restaurantId);
      if (response.success) setMenuItems(response.data);
    } catch (error) {
      console.error("Error refreshing menu:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const validateForm = () => {
    const errors = { name: "", price: "", categoryId: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Item name is required";
      isValid = false;
    }
    if (formData.price <= 0) {
      errors.price = "Price must be greater than 0";
      isValid = false;
    }
    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddSubmit = async () => {
    if (!validateForm() || !restaurantId) return;

    try {
      const response = await createMenu(restaurantId, formData);
      if (response.success) {
        toast.success("Menu item created");
        setIsAddModalOpen(false);
        setFormData({ name: "", description: "", price: 0, categoryId: "", isAvailable: true });
        refreshMenu();
      }
    } catch (error) {
      toast.error("Failed to create menu item");
    }
  };

  const handleEdit = (item: Menu) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedItem || !restaurantId || !validateForm()) return;

    try {
      const response = await updateMenu(restaurantId, selectedItem.id, formData);
      if (response.success) {
        toast.success("Menu item updated");
        setIsEditModalOpen(false);
        refreshMenu();
      }
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  const handleDelete = (item: Menu) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem || !restaurantId) return;

    try {
      const response = await deleteMenu(restaurantId, selectedItem.id);
      if (response.success) {
        toast.success("Item deleted");
        setIsDeleteModalOpen(false);
        refreshMenu();
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item: Menu) => {
    if (!restaurantId) return;
    try {
      const response = await toggleMenuAvailability(restaurantId, item.id);
      if (response.success) {
        toast.success(`Item is now ${response.data.isAvailable ? 'available' : 'unavailable'}`);
        refreshMenu();
      }
    } catch (error) {
      toast.error("Failed to toggle availability");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-20 backdrop-blur-md">
        <BounceLoader size={50} color="#EE1133" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FiBox className="mr-2" /> Menu Items
        </h2>
        <button
          onClick={() => {
            if (categories.length === 0) {
              toast.error("Please create a category first");
              return;
            }
            setFormData({ name: "", description: "", price: 0, categoryId: categories[0].id, isAvailable: true });
            setIsAddModalOpen(true);
          }}
          className="bg-event-red hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <FiPlus className="mr-2" /> Add Menu Item
        </button>
      </div>

      <Table
        columns={columns}
        data={menuItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? "Add Menu Item" : "Edit Menu Item"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-md border ${formErrors.name ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-event-red`}
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`w-full px-4 py-2 rounded-md border ${formErrors.categoryId ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-event-red`}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className={`w-full px-4 py-2 rounded-md border ${formErrors.price ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-event-red`}
            />
            {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-event-red"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="h-4 w-4 text-event-red focus:ring-event-red border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900 font-medium">
              Available for delivery
            </label>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={isAddModalOpen ? handleAddSubmit : handleEditSubmit}
              className="px-4 py-2 bg-event-red text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {isAddModalOpen ? "Create Item" : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Item"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
          </p>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;
