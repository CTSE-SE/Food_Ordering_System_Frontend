// import customFetch from "../utils/customFetch";

// export interface User {
//     id: string;
//     email: string;
//     name: string;
//     role: "user" | "admin" | "restaurant_owner";
//     isVerified: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface SignInRequest {
//     email: string;
//     password: string;
// }

// export interface SignUpRequest {
//     name: string;
//     email: string;
//     password: string;
//     role: "user" | "restaurant_owner";
// }

// export interface UserApiResponse<T> {
//     success: boolean;
//     message: string;
//     data: T;
// }

// export const signIn = async (data: SignInRequest): Promise<UserApiResponse<{ user: User; token: string }>> => {
//     const response = await customFetch.post("/users/login", data);
//     return response.data;
// };

// export const signUp = async (data: SignUpRequest): Promise<UserApiResponse<User>> => {
//     const response = await customFetch.post("/users/register", data);
//     return response.data;
// };

// export const getUserProfile = async (): Promise<UserApiResponse<User>> => {
//     const response = await customFetch.get("/users/profile");
//     return response.data;
// };

// export const updateUserProfile = async (data: Partial<User>): Promise<UserApiResponse<User>> => {
//     const response = await customFetch.patch("/users/profile", data);
//     return response.data;
// };
