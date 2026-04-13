import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import Table from "@/components/Table/Table";
import Modal from "@/components/UI/Modal";
import { BounceLoader } from "react-spinners";
import {
  getCategoriesByRestaurantId,
  createCategory,
  updateCategory,
  deleteCategory,
  getMyRestaurant,
  Category
} from "@/api/restaurant.api";

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const restResponse = await getMyRestaurant();
      if (restResponse.success) {
        setRestaurantId(restResponse.data.id);
        const catResponse = await getCategoriesByRestaurantId(restResponse.data.id);
        if (catResponse.success) {
          setCategories(catResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = async (id: string) => {
    try {
      const response = await getCategoriesByRestaurantId(id);
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const validateForm = () => {
    const errors = { name: "", description: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddSubmit = async () => {
    if (!validateForm() || !restaurantId) return;

    try {
      const response = await createCategory(restaurantId, formData);
      if (response.success) {
        toast.success("Category created successfully");
        setIsAddModalOpen(false);
        setFormData({ name: "", description: "" });
        fetchCategories(restaurantId);
      }
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCategory || !restaurantId || !validateForm()) return;

    try {
      const response = await updateCategory(restaurantId, selectedCategory.id, formData);
      if (response.success) {
        toast.success("Category updated successfully");
        setIsEditModalOpen(false);
        fetchCategories(restaurantId);
      }
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory || !restaurantId) return;

    try {
      const response = await deleteCategory(restaurantId, selectedCategory.id);
      if (response.success) {
        toast.success("Category deleted successfully");
        setIsDeleteModalOpen(false);
        fetchCategories(restaurantId);
      }
    } catch (error) {
      toast.error("Failed to delete category");
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
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => {
            setFormData({ name: "", description: "" });
            setIsAddModalOpen(true);
          }}
          className="bg-event-red hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add Category
        </button>
      </div>

      <Table
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? "Add Category" : "Edit Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 rounded-md border ${formErrors.name ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-event-red`}
              placeholder="e.g., Rice & Curry"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-event-red"
              rows={3}
              placeholder="Describe the category..."
            />
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
              {isAddModalOpen ? "Create Category" : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the category <strong>{selectedCategory?.name}</strong>?
            This will affect all menu items associated with it.
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

export default CategoryPage;
