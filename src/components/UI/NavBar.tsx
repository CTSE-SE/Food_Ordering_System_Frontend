import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdMenu,
  MdClose,
} from "react-icons/md";
import {
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiUser,
  FiGrid,
} from "react-icons/fi";
import logo from "/Images/NavBar/logo.webp?url";
import ContactInfo from "@/components/UI/ContactInfo";
import CustomButton from "@/components/UI/Button";
import { toast } from "react-hot-toast";
import Modal from "@/components/UI/Modal";

interface NavItem {
  title: string;
  path: string;
  subItems: { title: string; path: string }[];
}

const NavItems: NavItem[] = [
  { title: "Home", path: "/", subItems: [] },
  {
    title: "Service",
    path: "/service",
    subItems: [
      { title: "Service 1", path: "/service/service1" },
      { title: "Service 2", path: "/service/service2" },
    ],
  },
  { title: "FAQ", path: "/faq", subItems: [] },
  { title: "About", path: "/about", subItems: [] },
  { title: "Contact", path: "/contact", subItems: [] },
];

interface User {
  role?: string;
  fullName?: string;
  email?: string;
}

function NavComponent() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const loadUserFromStorage = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown("");
        setIsProfileMenuOpen(false);
      }

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".sidebar-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadUserFromStorage();

    const handleUserUpdated = () => {
      loadUserFromStorage();
    };

    window.addEventListener("userUpdated", handleUserUpdated);
    window.addEventListener("storage", handleUserUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
      window.removeEventListener("storage", handleUserUpdated);
    };
  }, []);

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? "" : title);
  };

  const isActive = (path: string) => window.location.pathname === path;

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.subItems.length > 0) {
      e.preventDefault();
      toggleDropdown(item.title);
    } else {
      setIsSidebarOpen(false);
      setActiveItem(item.title);
      navigate(item.path);
    }
  };

  const handleSubItemClick = (
    subItem: { title: string; path: string },
    parentItem: NavItem
  ) => {
    setActiveSubItem(subItem.title);
    setOpenDropdown("");
    setActiveItem(parentItem.title);
    setIsSidebarOpen(false);
    navigate(subItem.path);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setCurrentUser(null);
      setIsLogoutModalOpen(false);
      setIsProfileMenuOpen(false);
      setIsSidebarOpen(false);

      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  const goToProfile = () => {
    setIsProfileMenuOpen(false);
    navigate("/user-dashboard/profile");
  };

  const goToDashboard = () => {
    setIsProfileMenuOpen(false);
    navigate("/user-dashboard/profile");
  };

  const userInitial =
    currentUser?.fullName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className={`flex flex-col w-full ${isScrolled ? "shadow-md" : ""}`}>
      <div className="hidden xl:block">
        <ContactInfo />
      </div>

      <div
        className={`flex items-center justify-between w-full px-4 sm:px-14 py-4 bg-event-white max-w-[1920px] mx-auto ${
          isScrolled ? "border-b border-event-charcoal" : ""
        }`}
        ref={dropdownRef}
      >
        <div
          className="flex items-center w-8 h-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-[100px] sm:w-[130px] 2xl:w-[201px]"
          />
        </div>

        <button
          className="xl:hidden text-event-charcoal sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        {currentUser?.role !== "resturent owner" && (
          <ul className="hidden xl:flex items-center space-x-6 text-nowrap">
            {NavItems.map((item) => (
              <li key={item.title} className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={(e) => handleItemClick(item, e)}
                >
                  <button
                    className={`text-event-charcoal hover:text-event-blue ${
                      !currentUser && !activeItem && item.title === "Home"
                        ? "font-bold"
                        : ""
                    } ${
                      isActive(item.path) || activeItem === item.title
                        ? "font-bold"
                        : ""
                    }`}
                  >
                    {item.title}
                  </button>

                  {item.subItems.length > 0 && (
                    <button type="button">
                      {openDropdown === item.title ? (
                        <MdKeyboardArrowUp size={18} />
                      ) : (
                        <MdKeyboardArrowDown size={18} />
                      )}
                    </button>
                  )}
                </div>

                {openDropdown === item.title && item.subItems.length > 0 && (
                  <div className="absolute z-10 w-48 py-2 mt-2 bg-event-white rounded-md shadow-lg">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.title}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-event-navy hover:text-white ${
                          activeSubItem === subItem.title
                            ? "bg-event-navy text-white"
                            : "text-event-charcoal"
                        }`}
                        onClick={() => handleSubItemClick(subItem, item)}
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="hidden xl:flex items-center gap-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center font-bold text-sm">
                  {userInitial}
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-event-charcoal leading-none">
                    {currentUser.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {currentUser.role || "customer"}
                  </p>
                </div>

                <MdKeyboardArrowDown className="text-gray-500" size={20} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-4 bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] text-white">
                    <p className="font-semibold">
                      {currentUser.fullName || "User"}
                    </p>
                    <p className="text-sm text-white/90">
                      {currentUser.email || "No email"}
                    </p>
                  </div>

                  <button
                    onClick={goToProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-slate-50 transition"
                  >
                    <FiUser className="text-[#EE1133]" />
                    My Profile
                  </button>

                  <button
                    onClick={goToDashboard}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-slate-50 transition"
                  >
                    <FiGrid className="text-[#2563eb]" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogoutClick();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/signup")}>
                <CustomButton
                  title="SignUp"
                  variant="outline"
                  icon={<FiUserPlus className="w-4 h-4" />}
                  iconPosition="left"
                  fitWidth={true}
                  className="text-nowrap"
                />
              </button>

              <button onClick={() => navigate("/signin")}>
                <CustomButton
                  title="Login"
                  variant="outline"
                  icon={<FiLogIn className="w-4 h-4" />}
                  iconPosition="left"
                  className="text-nowrap"
                />
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-event-white z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 xl:hidden`}
        ref={sidebarRef}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-event-charcoal">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <button
              className="text-event-charcoal"
              onClick={() => setIsSidebarOpen(false)}
            >
              <MdClose size={24} />
            </button>
          </div>

          {currentUser?.role !== "resturent owner" && (
            <ul className="flex flex-col p-4 space-y-2">
              {NavItems.map((item) => (
                <li key={item.title} className="relative">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={(e) => handleItemClick(item, e)}
                  >
                    <button
                      className={`text-event-charcoal hover:text-event-blue ${
                        !currentUser && !activeItem && item.title === "Home"
                          ? "font-bold"
                          : ""
                      } ${
                        isActive(item.path) || activeItem === item.title
                          ? "font-bold"
                          : ""
                      }`}
                    >
                      {item.title}
                    </button>

                    {item.subItems.length > 0 && (
                      <button type="button">
                        {openDropdown === item.title ? (
                          <MdKeyboardArrowUp size={18} />
                        ) : (
                          <MdKeyboardArrowDown size={18} />
                        )}
                      </button>
                    )}
                  </div>

                  {openDropdown === item.title && item.subItems.length > 0 && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.title}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-event-navy hover:text-white ${
                            activeSubItem === subItem.title
                              ? "bg-event-navy text-white"
                              : "text-event-charcoal"
                          }`}
                          onClick={() => handleSubItemClick(subItem, item)}
                        >
                          {subItem.title}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto p-4 space-y-2">
            {currentUser ? (
              <>
                <div className="mb-4 rounded-2xl bg-slate-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center font-bold">
                      {userInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-event-charcoal">
                        {currentUser.fullName || "User"}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {currentUser.role || "customer"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/user-dashboard/profile");
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-event-charcoal"
                >
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/user-dashboard/profile");
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-event-charcoal"
                >
                  Dashboard
                </button>

                <CustomButton
                  title="Logout"
                  variant="outline"
                  icon={<FiLogOut className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={handleLogoutClick}
                  className="w-full text-left"
                />
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/signup");
                  }}
                >
                  <CustomButton
                    title="SignUp"
                    variant="outline"
                    icon={<FiUserPlus className="w-4 h-4" />}
                    iconPosition="left"
                    fitWidth={true}
                    className="w-full text-left"
                  />
                </button>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/signin");
                  }}
                >
                  <CustomButton
                    title="Login"
                    variant="outline"
                    icon={<FiLogIn className="w-4 h-4" />}
                    iconPosition="left"
                    fitWidth={true}
                    className="w-full text-left"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to logout? You will need to login again to
            access your account.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-event-red text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NavComponent;