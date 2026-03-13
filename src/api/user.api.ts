import customFetch from "../utils/customFetch";

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    role: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role?: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: User;
}

export const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await customFetch.post("/users/login", data);
    return response.data;
};

export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await customFetch.post("/users/register", data);
    return response.data;
};

export interface RegisterRestaurantRequest {
    contactPerson: string;
    restaurantName: string;
    email: string;
    password: string;
    phoneNumber: string;
    businessType: string;
    cuisineType: string;
    operatingHours: string;
    deliveryRadius: string;
    taxId: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    agreeTerms: boolean;
}

export const registerRestaurant = async (data: RegisterRestaurantRequest): Promise<AuthResponse> => {
    const response = await customFetch.post("/users/register-restaurant", data);
    return response.data;
};
