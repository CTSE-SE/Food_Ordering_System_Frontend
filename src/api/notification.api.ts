import customFetch from "../utils/customFetch";

export interface Notification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error" | "order" | "promotion";
    isRead: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface NotificationApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface UnreadCountResponse {
    count: number;
}

// Get all notifications for the logged-in user
export const getUserNotifications = async (): Promise<NotificationApiResponse<Notification[]>> => {
    const response = await customFetch.get("/notifications");
    return response.data;
};

// Get unread notification count
export const getUnreadCount = async (): Promise<NotificationApiResponse<UnreadCountResponse>> => {
    const response = await customFetch.get("/notifications/unread-count");
    return response.data;
};

// Mark a single notification as read
export const markNotificationAsRead = async (id: string): Promise<NotificationApiResponse<Notification>> => {
    const response = await customFetch.patch(`/notifications/${id}/read`);
    return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<NotificationApiResponse<null>> => {
    const response = await customFetch.patch("/notifications/read-all");
    return response.data;
};

// Delete a single notification
export const deleteNotification = async (id: string): Promise<NotificationApiResponse<null>> => {
    const response = await customFetch.delete(`/notifications/${id}`);
    return response.data;
};

// Delete all notifications for the user
export const deleteAllNotifications = async (): Promise<NotificationApiResponse<null>> => {
    const response = await customFetch.delete("/notifications");
    return response.data;
};
