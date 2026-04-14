import customFetch from "../utils/customFetch";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    // The service stores event types like 'order.placed'; panel handles unknown types gracefully
    type: string;
    isRead: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface NotificationListResponse {
    success: boolean;
    // Service spreads result directly: { success, notifications, total, page, totalPages }
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
}

export interface NotificationApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface UnreadCountResponse {
    unreadCount: number;
}

// Get all notifications for the logged-in user
// Response shape: { success, notifications: [...], total, page, totalPages }
export const getUserNotifications = async (): Promise<NotificationListResponse> => {
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
    const response = await customFetch.put(`/notifications/${id}/read`);
    return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<NotificationApiResponse<null>> => {
    const response = await customFetch.put("/notifications/read-all");
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
