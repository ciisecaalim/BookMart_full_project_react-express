import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import SidenavList from "./sideNavList";
import axios from "axios";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // default 18% width
  const [admin, setAdmin] = useState({ name: "", email: "", role: "", avatar: "" });

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogOut = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href = "/loginDash";
  };

  const links = [
    { to: "/dash", icon: "fa-home", title: "Dashboard" },
    { to: "/dash/books", icon: "fa-book", title: "Books" },
    { to: "/dash/add-book", icon: "fa-plus", title: "Add Book" },
    { to: "/dash/customers", icon: "fa-user", title: "Customers" },
    { to: "/dash/orders", icon: "fa-shopping-cart", title: "Orders" },
    { to: "/dash/addOrder", icon: "fa-cart-plus", title: "Add Orders" },
    { to: "/dash/reports", icon: "fa-chart-bar", title: "Reports" },
    { to: "/dash/settings", icon: "fa-cog", title: "Settings" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminData");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else if (token) {
      axios
        .get("/api/admin/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setAdmin(res.data);
          localStorage.setItem("adminData", JSON.stringify(res.data));
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 bottom-0 bg-purple-700 shadow-lg transition-all duration-300 flex flex-col`}
        style={{ width: isOpen ? "18%" : "6%" }}
      >
        {/* Admin Info */}
        <div className="flex items-center gap-3 p-4 border-b border-purple-600">
          <img
            src={admin.avatar || "/avatar.png"}
            alt="Admin"
            className={`w-10 h-10 rounded-full transition-all duration-300 ${
              isOpen ? "mr-2" : "mx-auto"
            }`}
          />
          {isOpen && (
            <div>
              <h4 className="text-white font-semibold">{admin.name || "Admin"}</h4>
              <p className="text-gray-200 text-sm">{admin.email || "admin@example.com"}</p>
              <p className="text-gray-300 text-xs">Role: {admin.role || "user"}</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="flex justify-end p-3">
          <i
            onClick={handleToggle}
            className={`text-white fa-solid ${
              isOpen ? "fa-chevron-left" : "fa-chevron-right"
            } cursor-pointer hover:text-gray-300 transition-all duration-300`}
          ></i>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-y-3 px-2 mt-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-red-500 font-semibold shadow-sm"
                    : "text-white hover:bg-purple-600 hover:text-gray-200"
                }`
              }
            >
              <SidenavList icon={link.icon} title={isOpen ? link.title : null} />
            </NavLink>
          ))}

          {/* Logout */}
          <div className="mt-auto border-t border-purple-600 pt-4 px-2">
            <NavLink
              to="/loginDash"
              onClick={handleLogOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-blue-800 hover:text-gray-200 transition-all"
            >
              <SidenavList icon="fa-key" title={isOpen ? "Log Out" : null} />
            </NavLink>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        className="flex-1 bg-gray-100 min-h-screen transition-all duration-300 p-10"
        style={{ marginLeft: isOpen ? "18%" : "6%" }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
