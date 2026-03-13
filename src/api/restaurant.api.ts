// import customFetch from "../utils/customFetch";

// export interface Category {
//     id: string;
//     name: string;
//     description?: string;
// }

// export interface Menu {
//     id: string;
//     name: string;
//     description: string;
//     price: number;
//     image: string;
//     category: Category;
//     isAvailable: boolean;
// }

// export interface Restaurant {
//     id: string;
//     name: string;
//     description: string;
//     address: string;
//     contactNumber: string;
//     image: string;
//     ownerId: string;
//     rating: number;
//     numReviews: number;
//     isVerified: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface RestaurantApiResponse<T> {
//     success: boolean;
//     message: string;
//     data: T;
// }

// export const getAllRestaurants = async (): Promise<RestaurantApiResponse<Restaurant[]>> => {
//     const response = await customFetch.get("/restaurants");
//     return response.data;
// };

// export const getRestaurantById = async (id: string): Promise<RestaurantApiResponse<Restaurant>> => {
//     const response = await customFetch.get(`/restaurants/${id}`);
//     return response.data;
// };

// export const getMenuByRestaurantId = async (id: string): Promise<RestaurantApiResponse<Menu[]>> => {
//     const response = await customFetch.get(`/restaurants/${id}/menu`);
//     return response.data;
// };
