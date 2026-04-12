import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiPieChart,
  FiUser,
} from "react-icons/fi";
import NavBar from "../components/UI/NavBar";

const menuItems = [
  { path: "overview", title: "Overview", icon: <FiPieChart /> },
  { path: "users", title: "Users", icon: <FiUsers /> },
  { path: "staff", title: "Staff", icon: <FiUser /> },
];

const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  return (
    <div className="flex flex-col h-screen font-Mainfront">
      <NavBar />
      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 ${
                  currentPath === item.path
                    ? "bg-gray-50 text-event-red"
                    : "text-gray-700"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm">
            <div className="px-6 py-4">
              <h2 className="text-xl font-semibold">
                {menuItems.find((item) => item.path === currentPath)?.title}
              </h2>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
