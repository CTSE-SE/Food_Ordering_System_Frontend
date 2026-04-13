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
