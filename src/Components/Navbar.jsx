
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

  // Auth: controls visibility for Check Policy & Profile
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(isLoggedIn());
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("storage", handler); // cross-tab
    window.addEventListener(AUTH_EVENT, handler); // same-tab
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(AUTH_EVENT, handler);
    };
  }, []);

  // Desktop
  const [openDropdown, setOpenDropdown] = useState(null); // 'policies' | 'claims' | 'resources' | null
  const dropdownCloseTimer = useRef(null);

  // Mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);
  const [mobileClaimsOpen, setMobileClaimsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const navRef = useRef(null);

  const navBg =
    theme === "dark"
      ? "bg-secondary text-textInverted"
      : "bg-bgCard text-textPrimary";

  // Desktop hover helpers
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

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav ref={navRef} className={`sticky top-0 z-40 shadow-sm ${navBg}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold">
          <FaShieldAlt className="text-primary text-xl" />
          SelfServe
        </Link>

        {/* TOGGLER (mobile) */}
        <button
          className="lg:hidden p-2 rounded-md border border-borderDefault"
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
          <ul className="flex gap-6">
            {/* POLICIES */}
            <li
              className="relative"
              onMouseEnter={() => {
                cancelDropdownClose();
                openOnly("policies");
              }}
              onMouseLeave={scheduleDropdownClose}
            >
              <button type="button" className="flex items-center gap-1 cursor-pointer">
                Policies <IoIosArrowDown size={14} />
              </button>

              {openDropdown === "policies" && (
                <ul
                  className="absolute mt-2 min-w-56 p-2 rounded-md shadow-lg bg-bgCard text-textSecondary z-50"
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                >
                  <li>
                    <Link
                      to="/policies/car"
                      className="block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary"
                    >
                      Car Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policies/bike"
                      className="block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary"
                    >
                      Bike Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policies/health"
                      className="block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary"
                    >
                      Health Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policies/life"
                      className="block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary"
                    >
                      Life Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policies/travel"
                      className="block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary"
                    >
                      Travel Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policies/airpass"
                      className="block px-4 py-2 rounded-md hover:bg-bgHover text-textPrimary"
                    >
                      Air Pass
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Check Your Policy — ONLY when logged in */}
            {isAuthenticated && (
              <li>
                <Link className="cursor-pointer hover:text-primary" to="/check-policy">
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
              <button type="button" className="flex items-center gap-1 cursor-pointer">
                Claims <IoIosArrowDown size={14} />
              </button>
              {openDropdown === "claims" && (
                <ul
                  className="absolute mt-2 min-w-56 p-2 rounded-md shadow-lg bg-bgCard text-textSecondary z-50"
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                >
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">Submit Claim</li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">Track Claim</li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">Claim History</li>
                </ul>
              )}
            </li>

            {/* RESOURCES */}
            <li
              className="relative"
              onMouseEnter={() => {
                cancelDropdownClose();
                openOnly("resources");
              }}
              onMouseLeave={scheduleDropdownClose}
            >
              <button type="button" className="flex items-center gap-1 cursor-pointer">
                Resources <IoIosArrowDown size={14} />
              </button>
              {openDropdown === "resources" && (
                <ul
                  className="absolute mt-2 min-w-56 p-2 rounded-md shadow-lg bg-bgCard text-textSecondary z-50"
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                >
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">Policy Guides</li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">FAQs</li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">Blogs</li>
                </ul>
              )}
            </li>

            {/* Static links */}
            <li>
              <Link className="cursor-pointer hover:text-primary" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1 cursor-pointer hover:text-primary" to="/support">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* NOTIFICATION */}
          <div className="relative">
            <FaBell className="text-lg" />
            <span className="absolute -top-2 -right-2 bg-danger text-textInverted text-xs rounded-full px-2">
              3
            </span>
          </div>

          {/* THEME TOGGLE */}
          <button
            className="border border-borderDefault rounded-full p-2 hover:bg-bgHover"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* AUTH */}
          {!isAuthenticated && (
            <Link
              to={"/login"}
              className="border border-primary text-primary px-4 py-1 rounded-md font-semibold shadow-sm hover:bg-primaryLight/10"
            >
              Login
            </Link>
          )}

          {/* PROFILE ICON — ONLY when logged in */}
          {isAuthenticated && (
            <Link
              to={"/profile"}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-bgHover transition"
              title="Profile"
            >
              <img src={pp} alt="profile" className="w-9 h-9 rounded-full object-cover" />
              {currentUser?.name && (
                <span className="hidden sm:inline text-sm text-textPrimary dark:text-textInverted">
                  Hi {currentUser.name.split(" ")[0]}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU (collapsible) */}
      <div
        id="nav-mobile"
        className={`lg:hidden border-t border-borderDefault ${mobileOpen ? "block" : "hidden"}`}
      >
        <div className="px-4 py-3 space-y-2">
          {/* Policies accordion */}
          <button
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-bgHover"
            onClick={() => setMobilePoliciesOpen((v) => !v)}
            aria-expanded={mobilePoliciesOpen}
          >
            <span className="font-medium">Policies</span>
            <IoIosArrowDown className={`transition-transform ${mobilePoliciesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobilePoliciesOpen && (
            <ul className="pl-3 space-y-1 text-sm">
              <li>
                <Link to="/policies/car" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Car Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/bike" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Bike & Scooter Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/health" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Health Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/life" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/travel" className="block px-2 py-1 rounded hover:bg-bgHover">
                Travel Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/airpass" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Air Pass
                </Link>
              </li>
            </ul>
          )}

          {/* Check Your Policy (mobile) — ONLY when logged in */}
          {isAuthenticated && (
            <Link to="/check-policy" className="block px-2 py-2 rounded-md hover:bg-bgHover font-medium">
              Check Your Policy
            </Link>
          )}

          {/* Claims accordion */}
          <button
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-bgHover"
            onClick={() => setMobileClaimsOpen((v) => !v)}
            aria-expanded={mobileClaimsOpen}
          >
            <span className="font-medium">Claims</span>
            <IoIosArrowDown className={`transition-transform ${mobileClaimsOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileClaimsOpen && (
            <ul className="pl-3 space-y-1">
              <li>
                <Link to="/claims/submit" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Submit Claim
                </Link>
              </li>
              <li>
                <Link to="/claims/track" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Track Claim
                </Link>
              </li>
              <li>
                <Link to="/claims/history" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Claim History
                </Link>
              </li>
            </ul>
          )}

          {/* Resources accordion */}
          <button
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-bgHover"
            onClick={() => setMobileResourcesOpen((v) => !v)}
            aria-expanded={mobileResourcesOpen}
          >
            <span className="font-medium">Resources</span>
            <IoIosArrowDown className={`transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileResourcesOpen && (
            <ul className="pl-3 space-y-1">
              <li className="px-2 py-1 rounded hover:bg-bgHover">Policy Guides</li>
              <li className="px-2 py-1 rounded hover:bg-bgHover">FAQs</li>
              <li className="px-2 py-1 rounded hover:bg-bgHover">Blogs</li>
            </ul>
          )}

          {/* Static links */}
          <div className="pt-2 border-top mt-2 space-y-1 border-t border-borderDefault">
            <Link className="block px-2 py-1 rounded hover:bg-bgHover" to="/about">
              About
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-bgHover" to="/support">
              <span className="inline-flex items-center gap-2">Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
