
import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdMenu, MdClose } from "react-icons/md";
import { FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import logo from "/Images/NavBar/logo.webp?url";
import ContactInfo from "@/components/UI/ContactInfo";
import CustomButton from "@/components/UI/Button";
import NotificationPanel from "@/components/UI/NotificationPanel";

import { toast } from "react-hot-toast";
import Modal from "@/components/UI/Modal";

// Define NavItems type and data
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
  role: string;
  fullName: string;
  email: string;
}

function NavComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside for dropdown and sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown("");
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

  // Fetch current user
  useEffect(() => {
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
      window.location.href = item.path; // Navigate with refresh
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
    window.location.href = subItem.path; // Navigate with refresh
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      // Clear user data from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setCurrentUser(null);
      setIsLogoutModalOpen(false);
      toast.success("Logged out successfully");
      window.location.href = "/"; // Navigate with refresh
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className={`flex flex-col w-full ${isScrolled ? "shadow-md" : ""}`}>
      {/* Top Contact Info (Visible on xl and above) */}
      <div className="hidden xl:block">
        <ContactInfo />
      </div>

      {/* Navbar */}
      <div
        className={`flex items-center justify-between w-full px-4 sm:px-14 py-4 bg-event-white max-w-[1920px] mx-auto ${isScrolled ? "border-b border-event-charcoal" : ""
          }`}
        ref={dropdownRef}
      >
        {/* Logo */}
        <div className="flex items-center w-8 h-8">
          <img
            src={logo}
            alt="Logo"
            className="w-[100px] sm:w-[130px] 2xl:w-[201px]"
          />
        </div>

        {/* Hamburger Menu (Visible below xl) */}
        <button
          className="xl:hidden text-event-charcoal sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        {/* Navbar Links (Visible on xl and above) */}
        {currentUser?.role !== "resturent owner" && (
          <ul className="hidden xl:flex items-center space-x-6 text-nowrap">
            {NavItems.map((item) => (
              <li key={item.title} className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={(e) => handleItemClick(item, e)}
                >
                  <a
                    href={item.subItems.length === 0 ? item.path : "#"}
                    className={`text-event-charcoal hover:text-event-blue ${!currentUser && !activeItem && item.title === "Home"
                      ? "font-bold"
                      : ""
                      } ${isActive(item.path) || activeItem === item.title
                        ? "font-bold"
                        : ""
                      }`}
                  >
                    {item.title}
                  </a>
                  {item.subItems.length > 0 && (
                    <button>
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
                      <a
                        key={subItem.title}
                        href={subItem.path}
                        className={`block px-4 py-2 text-sm hover:bg-event-navy hover:text-white ${activeSubItem === subItem.title
                          ? "bg-event-navy text-white"
                          : "text-event-charcoal"
                          }`}
                        onClick={() => handleSubItemClick(subItem, item)}
                      >
                        {subItem.title}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Auth Buttons (Visible on xl and above) */}
        <div className="hidden xl:flex items-center gap-x-4">
          {currentUser ? (
            <>
              <NotificationPanel currentUser={currentUser} />
              <CustomButton
                title="Logout"
                variant="outline"
                icon={<FiLogOut className="w-4 h-4" />}
                iconPosition="left"
                onClick={handleLogoutClick}
                className="text-nowrap"
              />
            </>
          ) : (
            <>
              <a href="/signup">
                <CustomButton
                  title="SignUp"
                  variant="outline"
                  icon={<FiUserPlus className="w-4 h-4" />}
                  iconPosition="left"
                  fitWidth={true}
                  className="text-nowrap"
                />
              </a>
              <a href="/signin">
                <CustomButton
                  title="Login"
                  variant="outline"
                  icon={<FiLogIn className="w-4 h-4" />}
                  iconPosition="left"
                  className="text-nowrap"
                />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Sidebar (Visible below xl) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-event-white z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 xl:hidden`}
        ref={sidebarRef}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-event-charcoal">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <button
              className="text-event-charcoal"
              onClick={() => setIsSidebarOpen(false)}
            >
            </button>
          </div>

          {/* Sidebar Nav Items */}
          {currentUser?.role !== "resturent owner" && (
            <ul className="flex flex-col p-4 space-y-2">
              {NavItems.map((item) => (
                <li key={item.title} className="relative">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={(e) => handleItemClick(item, e)}
                  >
                    <a
                      href={item.subItems.length === 0 ? item.path : "#"}
                      className={`text-event-charcoal hover:text-event-blue ${!currentUser && !activeItem && item.title === "Home"
                        ? "font-bold"
                        : ""
                        } ${isActive(item.path) || activeItem === item.title
                          ? "font-bold"
                          : ""
                        }`}
                    >
                      {item.title}
                    </a>
                    {item.subItems.length > 0 && (
                      <button>
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
                        <a
                          key={subItem.title}
                          href={subItem.path}
                          className={`block px-4 py-2 text-sm hover:bg-event-navy hover:text-white ${activeSubItem === subItem.title
                            ? "bg-event-navy text-white"
                            : "text-event-charcoal"
                            }`}
                          onClick={() => handleSubItemClick(subItem, item)}
                        >
                          {subItem.title}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Sidebar Auth Buttons */}
          <div className="mt-auto p-4 space-y-2">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 pb-2">
                  <NotificationPanel currentUser={currentUser} />
                  <span className="text-sm text-gray-600">Notifications</span>
                </div>
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
                <a href="/signup" onClick={() => setIsSidebarOpen(false)}>
                  <CustomButton
                    title="SignUp"
                    variant="outline"
                    icon={<FiUserPlus className="w-4 h-4" />}
                    iconPosition="left"
                    fitWidth={true}
                    className="w-full text-left"
                  />
                </a>
                <a href="/signin" onClick={() => setIsSidebarOpen(false)}>
                  <CustomButton
                    title="Login"
                    variant="outline"
                    icon={<FiLogIn className="w-4 h-4" />}
                    iconPosition="left"
                    fitWidth={true}
                    className="w-full text-left"
                  />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
