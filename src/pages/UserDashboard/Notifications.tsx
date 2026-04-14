import { useCallback, useEffect, useState } from "react";
import { FiTrash2, FiCheck, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { toast } from "react-hot-toast";
import {
  Notification,
  deleteAllNotifications,
  deleteNotification,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notification.api";

// ── helpers ────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, { badge: string; border: string }> = {
  info:      { badge: "bg-blue-100 text-blue-700",   border: "border-l-blue-400" },
  success:   { badge: "bg-green-100 text-green-700", border: "border-l-green-400" },
  warning:   { badge: "bg-yellow-100 text-yellow-700", border: "border-l-yellow-400" },
  error:     { badge: "bg-red-100 text-red-700",     border: "border-l-red-400" },
  order:     { badge: "bg-purple-100 text-purple-700", border: "border-l-purple-400" },
  promotion: { badge: "bg-orange-100 text-orange-700", border: "border-l-orange-400" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type FilterType = "all" | "unread" | "read";

// ── component ──────────────────────────────────────────────────────────────

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserNotifications();
      if (res?.success) {
        setNotifications(Array.isArray(res.notifications) ? res.notifications : []);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── actions ──────────────────────────────────────────────────────────────

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all notifications? This cannot be undone.")) return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  // ── filtered list ─────────────────────────────────────────────────────────

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FiCheckCircle size={15} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FiTrash2 size={15} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(["all", "unread", "read"] as FilterType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
              filter === tab
                ? "bg-white text-event-red shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-event-red text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FiRefreshCw size={32} className="animate-spin mb-3 opacity-50" />
          <p className="text-sm">Loading notifications…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <MdNotificationsNone size={56} className="mb-3 opacity-30" />
          <p className="text-base font-medium">
            {filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
          </p>
          <p className="text-sm mt-1 opacity-70">
            {filter === "all"
              ? "We'll notify you when something happens"
              : `Switch to 'all' to see every notification`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const style = TYPE_STYLES[n.type] ?? {
              badge: "bg-gray-100 text-gray-600",
              border: "border-l-gray-300",
            };
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 bg-white rounded-xl border border-gray-100 border-l-4 ${style.border} px-5 py-4 shadow-sm transition-opacity ${
                  deletingId === n.id ? "opacity-40 pointer-events-none" : ""
                } ${!n.isRead ? "ring-1 ring-blue-100" : ""}`}
              >
                {/* Unread indicator */}
                <div className="mt-1 shrink-0">
                  {!n.isRead ? (
                    <span className="block w-2.5 h-2.5 rounded-full bg-event-red" />
                  ) : (
                    <span className="block w-2.5 h-2.5 rounded-full bg-gray-200" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${style.badge}`}
                    >
                      {n.type}
                    </span>
                    {!n.isRead && (
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      title="Mark as read"
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiCheck size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    title="Delete"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
