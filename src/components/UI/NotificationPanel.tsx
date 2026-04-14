import { useEffect, useRef, useState, useCallback } from "react";
import { FiBell, FiCheck, FiCheckCircle } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { toast } from "react-hot-toast";
import {
  Notification,
  getUnreadCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notification.api";

// ── helpers ────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
  order: "bg-purple-100 text-purple-700",
  promotion: "bg-orange-100 text-orange-700",
};

function formatTime(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── component ──────────────────────────────────────────────────────────────

interface Props {
  currentUser: { role: string } | null;
}

export default function NotificationPanel({ currentUser }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── data fetching ──────────────────────────────────────────────────────

  const fetchUnreadCount = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await getUnreadCount();
      if (res?.success) setUnreadCount(res.data?.unreadCount ?? 0);
    } catch {
      // silently ignore
    }
  }, [currentUser]);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await getUserNotifications();
      if (res?.success) {
        const data: Notification[] = Array.isArray(res.notifications) ? res.notifications : [];
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Poll every 2 minutes — pause when tab is hidden
  useEffect(() => {
    fetchUnreadCount();
    let id: ReturnType<typeof setInterval>;

    const start = () => { id = setInterval(fetchUnreadCount, 120_000); };
    const stop  = () => clearInterval(id);

    const onVisibility = () =>
      document.hidden ? stop() : (fetchUnreadCount(), start());

    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [fetchUnreadCount]);

  // Load full list when panel opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── actions ────────────────────────────────────────────────────────────

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  if (!currentUser) return null;

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-gray-600 hover:text-event-red transition-colors"
        aria-label="Notifications"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-event-red rounded-full leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-event-red text-white text-xs rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <FiCheckCircle size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <MdNotificationsNone size={40} className="mb-2 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    !n.isRead ? "bg-blue-50/40" : ""
                  }`}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 shrink-0">
                    <span className={`block w-2 h-2 rounded-full ${!n.isRead ? "bg-event-red" : "bg-transparent"}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                          TYPE_STYLES[n.type] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {n.type}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-auto shrink-0">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>

                  {/* Mark read action */}
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      title="Mark as read"
                      className="p-1 text-blue-500 hover:text-blue-700 shrink-0 mt-0.5"
                    >
                      <FiCheck size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50 text-center">
              <a
                href="/user-dashboard/notifications"
                className="text-xs text-event-red hover:underline font-medium"
                onClick={() => setOpen(false)}
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
