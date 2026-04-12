// import customFetch from "../utils/customFetch";

export {};

// export interface Notification {
//     id: string;
//     userId: string;
//     title: string;
//     message: string;
//     type: "info" | "success" | "warning" | "error";
//     isRead: boolean;
//     createdAt: string;
// }

// export interface NotificationApiResponse<T> {
//     success: boolean;
//     message: string;
//     data: T;
// }

// export const getUserNotifications = async (): Promise<NotificationApiResponse<Notification[]>> => {
//     const response = await customFetch.get("/notifications");
//     return response.data;
// };

// export const markNotificationAsRead = async (id: string): Promise<NotificationApiResponse<Notification>> => {
//     const response = await customFetch.patch(`/notifications/${id}/read`);
//     return response.data;
// };
