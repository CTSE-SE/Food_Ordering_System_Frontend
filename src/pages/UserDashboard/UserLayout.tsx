import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiUser, FiBookmark } from "react-icons/fi";
import NavBar from "@/components/UI/NavBar";

interface StoredUser {
  role?: string;
  fullName?: string;
  email?: string;
}

const menuItems = [
  { path: "profile", title: "My Profile", icon: <FiUser /> },
  { path: "bookings", title: "My Bookings", icon: <FiBookmark /> },
];

const UserLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  const [user, setUser] = useState<StoredUser | null>(null);

  const currentTitle =
    menuItems.find((item) => item.path === currentPath)?.title || "Dashboard";

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdated = () => loadUser();

    window.addEventListener("userUpdated", handleUserUpdated);
    window.addEventListener("storage", handleUserUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
      window.removeEventListener("storage", handleUserUpdated);
    };
  }, []);

  const userInitial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavBar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] px-6 py-8 text-white">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-bold mb-4">
                {userInitial}
              </div>

              <h2 className="text-2xl font-bold leading-tight">
                {user?.fullName || "User Dashboard"}
              </h2>

              <p className="text-white/85 mt-1 text-sm capitalize">
                {user?.role || "customer"}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-3">
                Account
              </p>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = currentPath === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#EE1133] to-red-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-slate-50 hover:text-[#EE1133]"
                      }`}
                    >
                      <span
                        className={`text-lg ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-[#EE1133]"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 px-6 md:px-8 py-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#EE1133] mb-1">
                    Welcome back
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                    {currentTitle}
                  </h1>
                  <p className="text-slate-500 mt-2">
                    Manage your account details and track your activity in one
                    place.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 min-w-[140px]">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="font-semibold text-slate-800 capitalize">
                      {user?.role || "customer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px]">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;