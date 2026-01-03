
// src/Components/Navbar.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { FaShieldAlt, FaBell, FaSun, FaMoon } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { isLoggedIn, AUTH_EVENT, getCurrentUser } from "../utils/auth";
import pp from "../assets/pp.png";

const CLOSE_DELAY_MS = 150;

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(isLoggedIn());
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("storage", handler);
    window.addEventListener(AUTH_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(AUTH_EVENT, handler);
    };
  }, []);

  const [openDropdown, setOpenDropdown] = useState(null); // 'policies' | 'claims' | null
  const dropdownCloseTimer = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);
  const [mobileClaimsOpen, setMobileClaimsOpen] = useState(false);

  const navRef = useRef(null);

  // Distinct navbar background with clear separator line
  const navBg =
    theme === "dark"
      ? "bg-secondary/95 text-textInverted supports-[backdrop-filter]:bg-secondary/85 backdrop-blur"
      : "bg-bgCard text-textPrimary";

  const openOnly = (key) => {
    setOpenDropdown(key);
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
  };
  const scheduleDropdownClose = () => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = setTimeout(() => {
      setOpenDropdown(null);
    }, CLOSE_DELAY_MS);
  };
  const cancelDropdownClose = () => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
  };

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // =========================
  // DESKTOP DROPDOWN STYLES
  // =========================
  const dropdownBase =
    theme === "dark"
      ? "absolute mt-2 min-w-64 p-2 rounded-lg shadow-2xl z-50"
      : "absolute mt-2 min-w-64 p-2 rounded-lg shadow-xl z-50";

  const dropdownTheme =
    theme === "dark"
      ? "bg-bgCard text-textInverted ring-[0.5px] ring-borderStrong"
      : "bg-bgCard text-textSecondary ring-1 ring-borderDefault";

  const dropdownItem =
    theme === "dark"
      ? "block px-4 py-2 rounded-md hover:bg-bgHover/10 text-textInverted"
      : "block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary";

  const dropdownItemPlain =
    theme === "dark"
      ? "px-4 py-2 hover:bg-bgHover/10 rounded-md cursor-pointer text-textInverted"
      : "px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer text-textPrimary";

  // Desktop trigger hover tone already fixed earlier
  const triggerBtn =
    theme === "dark"
      ? "font-medium flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:!bg-white/5"
      : "font-medium flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-bgHover";

  // =========================
  // MOBILE HOVER FIX (ONLY CHANGE ADDED)
  // =========================
  const mobileTriggerBtn =
    theme === "dark"
      ? "w-full flex items-center justify-between px-2 py-2 rounded-md hover:!bg-white/5"
      : "w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-bgHover";

  const mobileLink =
    theme === "dark"
      ? "block px-2 py-1 rounded hover:!bg-white/5"
      : "block px-2 py-1 rounded hover:bg-bgHover";

  const mobileMenuLink =
    theme === "dark"
      ? "block px-2 py-2 rounded-md hover:!bg-white/5 font-medium"
      : "block px-2 py-2 rounded-md hover:bg-bgHover font-medium";

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-40 shadow-md ${navBg} border-b border-borderDefault`}
      role="navigation"
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <FaShieldAlt className="text-primary text-2xl" />
          <span className="tracking-tight">SELFSERVE</span>
        </Link>

        {/* TOGGLER (mobile) */}
        <button
          className="lg:hidden p- rounded-md border border-borderDefault"
          aria-expanded={mobileOpen}
          aria-controls="nav-mobile"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="block w-6 h-0.5 bg-textSecondary mb-1"></span>
          <span className="block w-6 h-0.5 bg-textSecondary mb-1"></span>
          <span className="block w-6 h-0.5 bg-textSecondary"></span>
        </button>

        {/* CENTER MENU — Desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
          <ul className="flex gap-7 items-center">
            {/* POLICIES */}
            <li
              className="relative"
              onMouseEnter={() => {
                cancelDropdownClose();
                openOnly("policies");
              }}
              onMouseLeave={scheduleDropdownClose}
            >
              <button
                type="button"
                className={triggerBtn}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "policies"}
              >
                <span className="font-medium">Policies</span>
                <IoIosArrowDown size={14} />
              </button>

              {openDropdown === "policies" && (
                <ul
                  className={`${dropdownBase} ${dropdownTheme}`}
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                  role="menu"
                >
                  <li role="none">
                    <Link to="/policies/car" className={dropdownItem} role="menuitem">
                      Car Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/bike" className={dropdownItem} role="menuitem">
                      Bike Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/health" className={dropdownItem} role="menuitem">
                      Health Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/life" className={dropdownItem} role="menuitem">
                      Life Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/travel" className={dropdownItem} role="menuitem">
                      Travel Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/airpass" className={dropdownItem} role="menuitem">
                      Air Pass
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Check Your Policy — ONLY when logged in */}
            {isAuthenticated && (
              <li>
                <Link className=" font-medium cursor-pointer hover:text-primary" to="/check-policy">
                  Check Your Policy
                </Link>
              </li>
            )}

            {/* CLAIMS */}
            <li
              className="relative"
              onMouseEnter={() => {
                cancelDropdownClose();
                openOnly("claims");
              }}
              onMouseLeave={scheduleDropdownClose}
            >
              <button
                type="button"
                className={triggerBtn}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "claims"}
              >
                <span className="font-medium">Claims</span>
                <IoIosArrowDown size={14} />
              </button>

              {openDropdown === "claims" && (
                <ul
                  className={`${dropdownBase} ${dropdownTheme}`}
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                  role="menu"
                >
                  <li className={dropdownItemPlain} role="menuitem">Submit Claim</li>
                  <li className={dropdownItemPlain} role="menuitem">Track Claim</li>
                  <li className={dropdownItemPlain} role="menuitem">Claim History</li>
                </ul>
              )}
            </li>

            {/* Static links */}
            <li>
              <Link className=" font-medium cursor-pointer hover:text-primary" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className=" font-medium flex items-center gap-1 cursor-pointer hover:text-primary" to="/support">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaBell className="text-lg" />
            <span className="absolute -top-2 -right-2 bg-danger text-textInverted text-xs rounded-full px-2">
              3
            </span>
          </div>

          <button
            className="border border-borderDefault rounded-full p-2 hover:bg-bgHover"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {!isAuthenticated && (
            <Link
              to={"/login"}
              className="border border-primary text-primary px-4 py-1 rounded-md font-semibold shadow-sm hover:bg-primaryLight/10"
            >
              Login
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to={"/profile"}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-bgHover transition"
              title="Profile"
            >
              <img src={pp} alt="profile" className="w-9 h-9 rounded-full object-cover ring-1 ring-borderDefault" />
              {currentUser?.name && (
                <span className="hidden sm:inline text-sm text-textPrimary dark:text-textInverted">
                  Hi {currentUser.name.split(" ")[0]}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        id="nav-mobile"
        className={`lg:hidden border-t border-borderDefault ${mobileOpen ? "block" : "hidden"}`}
      >
        <div className="px-4 py-3 space-y-2">
          {/* Policies accordion (mobile) */}
          <button
            className={mobileTriggerBtn}
            onClick={() => setMobilePoliciesOpen((v) => !v)}
            aria-expanded={mobilePoliciesOpen}
          >
            <span className="font-medium">Policies</span>
            <IoIosArrowDown className={`transition-transform ${mobilePoliciesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobilePoliciesOpen && (
            <ul className={`pl-3 space-y-1 text-sm ${theme === "dark" ? "text-textInverted" : "text-textPrimary"}`}>
              <li>
                <Link to="/policies/car" className={mobileLink}>
                  Car Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/bike" className={mobileLink}>
                  Bike & Scooter Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/health" className={mobileLink}>
                  Health Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/life" className={mobileLink}>
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/travel" className={mobileLink}>
                  Travel Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/airpass" className={mobileLink}>
                  Air Pass
                </Link>
              </li>
            </ul>
          )}

          {isAuthenticated && (
            <Link to="/check-policy" className={mobileMenuLink}>
              Check Your Policy
            </Link>
          )}

          {/* Claims accordion (mobile) */}
          <button
            className={mobileTriggerBtn}
            onClick={() => setMobileClaimsOpen((v) => !v)}
            aria-expanded={mobileClaimsOpen}
          >
            <span className="font-medium">Claims</span>
            <IoIosArrowDown className={`transition-transform ${mobileClaimsOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileClaimsOpen && (
            <ul className={`pl-3 space-y-1 ${theme === "dark" ? "text-textInverted" : "text-textPrimary"}`}>
              <li>
                <Link to="/claims/submit" className={mobileLink}>
                  Submit Claim
                </Link>
              </li>
              <li>
                <Link to="/claims/track" className={mobileLink}>
                  Track Claim
                </Link>
              </li>
              <li>
                <Link to="/claims/history" className={mobileLink}>
                  Claim History
                </Link>
              </li>
            </ul>
          )}

          {/* Static links (mobile) */}
          <div className="pt-2 mt-2 space-y-1 border-t border-borderDefault">
            <Link className={mobileLink} to="/about">
              About
            </Link>
            <Link className={mobileLink} to="/support">
              <span className="inline-flex items-center gap-2">Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
``
