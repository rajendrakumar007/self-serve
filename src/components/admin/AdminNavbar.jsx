import React, { useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { ThemeContext } from "../../Context/ThemeContext.jsx";
import { adminLogout } from "../../utils/auth/auth.js";

const AdminNavbar = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navBg =
    theme === "dark"
      ? "bg-secondary/95 text-textInverted supports-[backdrop-filter]:bg-secondary/85 backdrop-blur"
      : "bg-bgCard text-textPrimary";

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav
      className={`sticky top-0 z-40 shadow-md ${navBg} border-b border-borderDefault`}
      role="navigation"
      aria-label="Admin"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center">
        {/* Left: Logo + Company Name */}
        <Link to="/admin/claims" className="flex items-center gap-2 font-bold text-lg">
          <FaShieldAlt className="text-primary text-2xl" />
          <span className="tracking-tight">SELFSERVE</span>
        </Link>

        {/* Center: Admin Tabs */}
        <div className="flex-1 flex items-center justify-center">
          <ul className="flex items-center gap-8">
            <li>
              <NavLink
                to="/admin/claims"
                className={`text-sm font-medium px-2 py-1 rounded-md hover:text-primary ${
                  isActive("/admin/claims") ? "text-primary" : ""
                }`}
              >
                Claims
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/tickets"
                className={`text-sm font-medium px-2 py-1 rounded-md hover:text-primary ${
                  isActive("/admin/tickets") ? "text-primary" : ""
                }`}
              >
                Tickets
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right: Greeting + Logout */}
        <div className="flex items-center gap-3">
          <span className="text-sm">
            Hi <span className="font-semibold">Admin</span>
          </span>
          <button
            onClick={() => { adminLogout(); navigate("/", { replace: true }); }}
            className="px-3 py-1.5 text-sm rounded-md border border-borderDefault hover:bg-bgHover"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
