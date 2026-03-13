import customFetch from "../utils/customFetch";

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Menu {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: Category;
    isAvailable: boolean;
}

export interface Restaurant {
    id: string;
    name: string;
    description: string;
    address: string;
    contactNumber: string;
    image: string;
    ownerId: string;
    rating: number;
    numReviews: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RestaurantApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface CreateRestaurantRequest {
    restaurantName: string;
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

export const createRestaurant = async (data: CreateRestaurantRequest, token?: string): Promise<RestaurantApiResponse<Restaurant>> => {
    const authToken = token || localStorage.getItem("token");
    const response = await customFetch.post("/restaurants", data, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
    return response.data;
};

export const getAllRestaurants = async (): Promise<RestaurantApiResponse<Restaurant[]>> => {
    const response = await customFetch.get("/restaurants");
    return response.data;
};

export const getRestaurantById = async (id: string): Promise<RestaurantApiResponse<Restaurant>> => {
    const response = await customFetch.get(`/restaurants/${id}`);
    return response.data;
};

export const getMenuByRestaurantId = async (id: string): Promise<RestaurantApiResponse<Menu[]>> => {
    const response = await customFetch.get(`/restaurants/${id}/menu`);
    return response.data;
};
