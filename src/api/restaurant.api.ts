import customFetch from "../utils/customFetch";

export interface Category {
    id: string;
    restaurantId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface Menu {
    id: string;
    restaurantId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    mainImage?: string;
    thumbnailImage?: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Restaurant {
    id: string;
    userId: string;
    restaurantName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    businessType: string;
    cuisineType: string;
    operatingHours: string;
    deliveryRadius: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    status: 'pending' | 'approved' | 'rejected' | 'blocked';
    availability: boolean;
    createdAt: string;
    updatedAt: string;
    categories?: Category[];
}

export interface RestaurantApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface CreateRestaurantRequest {
    name: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    businessType: string;
    cuisineType: string;
    operatingHours: string;
    deliveryRadius: number | string;
    taxId: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    agreeTerms: boolean;
}

export interface UpdateRestaurantRequest extends Partial<CreateRestaurantRequest> {
    businessLicense?: string;
    foodSafetyCert?: string;
    exteriorPhoto?: string;
    logo?: string;
}

// --- API Endpoints ---

const BASE_URL = "/restaurants";

// Helper to normalize response
const normalizeResponse = (response: any) => {
    const body = response.data;
    if (body && typeof body === 'object' && !Array.isArray(body)) {
        if (body.success !== undefined) {
            if (body.data !== undefined) {
                return body;
            }
            // If it has success but no data field, hunt for an array in the remaining fields
            const { success, message, ...rest } = body;
            const arrayField = Object.values(rest).find(val => Array.isArray(val));
            if (arrayField) {
                return { success, message, data: arrayField };
            }
            // If no array field, return the rest of the object as data
            return { success, message, data: Object.keys(rest).length > 0 ? rest : null };
        }
    }
    return { success: true, data: body };
};

// Restaurant Profile APIs
export const getMyRestaurant = async (): Promise<RestaurantApiResponse<Restaurant>> => {
    const response = await customFetch.get(`${BASE_URL}/user/me`);
    return normalizeResponse(response);
};

export const createRestaurant = async (data: CreateRestaurantRequest): Promise<RestaurantApiResponse<Restaurant>> => {
    const response = await customFetch.post(BASE_URL, data);
    return response.data;
};

export const updateRestaurant = async (id: string, data: UpdateRestaurantRequest): Promise<RestaurantApiResponse<Restaurant>> => {
    const response = await customFetch.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

export const getRestaurantById = async (id: string): Promise<RestaurantApiResponse<Restaurant>> => {
    const response = await customFetch.get(`${BASE_URL}/${id}`);
    return normalizeResponse(response);
};

export const getAllRestaurants = async (page = 1, limit = 20, status?: string): Promise<RestaurantApiResponse<Restaurant[]>> => {
    const params = { page, limit, status };
    const response = await customFetch.get(BASE_URL, { params });
    return normalizeResponse(response);
};

// Category APIs
export const getCategoriesByRestaurantId = async (restaurantId: string): Promise<RestaurantApiResponse<Category[]>> => {
    const response = await customFetch.get(`${BASE_URL}/${restaurantId}/categories`);
    return normalizeResponse(response);
};

export const createCategory = async (restaurantId: string, data: { name: string; description?: string }): Promise<RestaurantApiResponse<Category>> => {
    const response = await customFetch.post(`${BASE_URL}/${restaurantId}/categories`, data);
    return response.data;
};

export const updateCategory = async (restaurantId: string, categoryId: string, data: { name: string; description?: string }): Promise<RestaurantApiResponse<Category>> => {
    const response = await customFetch.put(`${BASE_URL}/${restaurantId}/categories/${categoryId}`, data);
    return response.data;
};

export const deleteCategory = async (restaurantId: string, categoryId: string): Promise<RestaurantApiResponse<{ success: boolean; message: string }>> => {
    const response = await customFetch.delete(`${BASE_URL}/${restaurantId}/categories/${categoryId}`);
    return normalizeResponse(response);
};

// Menu APIs
export const getMenuItemsByRestaurantId = async (restaurantId: string): Promise<RestaurantApiResponse<Menu[]>> => {
    const response = await customFetch.get(`${BASE_URL}/${restaurantId}/menu`);
    return normalizeResponse(response);
};

export const createMenu = async (restaurantId: string, data: Omit<Menu, "id" | "restaurantId" | "createdAt" | "updatedAt">): Promise<RestaurantApiResponse<Menu>> => {
    const response = await customFetch.post(`${BASE_URL}/${restaurantId}/menu`, data);
    return response.data;
};

export const updateMenu = async (restaurantId: string, menuId: string, data: Partial<Menu>): Promise<RestaurantApiResponse<Menu>> => {
    const response = await customFetch.put(`${BASE_URL}/${restaurantId}/menu/${menuId}`, data);
    return response.data;
};

export const deleteMenu = async (restaurantId: string, menuId: string): Promise<RestaurantApiResponse<{ success: boolean; message: string }>> => {
    const response = await customFetch.delete(`${BASE_URL}/${restaurantId}/menu/${menuId}`);
    return normalizeResponse(response);
};

export const toggleMenuAvailability = async (restaurantId: string, menuId: string): Promise<RestaurantApiResponse<Menu>> => {
    const response = await customFetch.patch(`${BASE_URL}/${restaurantId}/menu/${menuId}/availability`);
    return normalizeResponse(response);
};
