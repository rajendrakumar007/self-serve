
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import {
  FaShieldAlt,
  FaBell,
  FaSun,
  FaMoon,
  FaQuestionCircle,
  FaUser,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const CLOSE_DELAY_MS = 150;

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Desktop
  const [openDropdown, setOpenDropdown] = useState(null); // 'policies' | 'claims' | 'resources' | null
  const [openPolicySub, setOpenPolicySub] = useState(null); // 'health' | 'motor' | 'term' | null

  const dropdownCloseTimer = useRef(null);
  const subCloseTimer = useRef(null);

  // Mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);
  const [mobileClaimsOpen, setMobileClaimsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileHealthOpen, setMobileHealthOpen] = useState(false);
  const [mobileMotorOpen, setMobileMotorOpen] = useState(false);
  const [mobileTermOpen, setMobileTermOpen] = useState(false);

  const navRef = useRef(null);

  const navBg =
    theme === "dark"
      ? "bg-secondary text-textInverted"
      : "bg-bgCard text-textPrimary";

  // Desktop hover helpers
  const openOnly = (key) => {
    setOpenDropdown(key);
    setOpenPolicySub(null);
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
  };
  const scheduleDropdownClose = () => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = setTimeout(() => {
      setOpenDropdown(null);
      setOpenPolicySub(null);
    }, CLOSE_DELAY_MS);
  };
  const cancelDropdownClose = () => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
  };

  const openSubOnly = (key) => {
    setOpenPolicySub(key);
    if (subCloseTimer.current) clearTimeout(subCloseTimer.current);
  };
  const scheduleSubClose = () => {
    if (subCloseTimer.current) clearTimeout(subCloseTimer.current);
    subCloseTimer.current = setTimeout(() => {
      setOpenPolicySub(null);
    }, CLOSE_DELAY_MS);
  };
  const cancelSubClose = () => {
    if (subCloseTimer.current) clearTimeout(subCloseTimer.current);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setOpenPolicySub(null);
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

              {/* Top-level dropdown */}
              {openDropdown === "policies" && (
                <ul
                  className="absolute mt-2 min-w-56 p-2 rounded-md shadow-lg bg-bgCard text-textSecondary z-50"
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                >
                  {/* Health Insurance */}
                  <li
                    className="relative"
                    onMouseEnter={() => {
                      cancelSubClose();
                      openSubOnly("health");
                    }}
                    onMouseLeave={scheduleSubClose}
                  >
                    <button
                      type="button"
                      className="flex justify-between items-center w-full px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer"
                    >
                      Health Insurance <IoIosArrowForward />
                    </button>

                    {/* Submenu — turned into real menu with links */}
                    {openPolicySub === "health" && (
                      <div
                        className="absolute left-full top-0 min-w-[280px] p-3 rounded-md shadow-lg bg-bgCard z-50 border border-borderDefault"
                        onMouseEnter={cancelSubClose}
                        onMouseLeave={scheduleSubClose}
                      >
                        <div className="mb-2 flex items-center gap-2 text-textPrimary font-semibold">
                          <FaInfoCircle className="text-primary" />
                          Health Insurance
                        </div>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <Link
                              to="/policies/health/overview"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Overview
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/health/benefits"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Benefits
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/health/network"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Hospital Network
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/health/quote"
                              className="flex items-center justify-between px-3 py-2 rounded bg-primary text-textInverted hover:bg-primaryDark"
                            >
                              Get Quote <IoIosArrowForward />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>

                  {/* Motor Insurance */}
                  <li
                    className="relative"
                    onMouseEnter={() => {
                      cancelSubClose();
                      openSubOnly("motor");
                    }}
                    onMouseLeave={scheduleSubClose}
                  >
                    <button
                      type="button"
                      className="flex justify-between items-center w-full px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer"
                    >
                      Motor Insurance <IoIosArrowForward />
                    </button>
                    {openPolicySub === "motor" && (
                      <div
                        className="absolute left-full top-0 min-w-[280px] p-3 rounded-md shadow-lg bg-bgCard z-50 border border-borderDefault"
                        onMouseEnter={cancelSubClose}
                        onMouseLeave={scheduleSubClose}
                      >
                        <div className="mb-2 flex items-center gap-2 text-textPrimary font-semibold">
                          <FaInfoCircle className="text-primary" />
                          Motor Insurance
                        </div>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <Link
                              to="/policies/motor/overview"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Overview
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/motor/coverage"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Coverage & Add-ons
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/motor/renewal"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Renewal
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/motor/quote"
                              className="flex items-center justify-between px-3 py-2 rounded bg-primary text-textInverted hover:bg-primaryDark"
                            >
                              Get Quote <IoIosArrowForward />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>

                  {/* Term Insurance */}
                  <li
                    className="relative"
                    onMouseEnter={() => {
                      cancelSubClose();
                      openSubOnly("term");
                    }}
                    onMouseLeave={scheduleSubClose}
                  >
                    <button
                      type="button"
                      className="flex justify-between items-center w-full px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer"
                    >
                      Term Insurance <IoIosArrowForward />
                    </button>
                    {openPolicySub === "term" && (
                      <div
                        className="absolute left-full top-0 min-w-[280px] p-3 rounded-md shadow-lg bg-bgCard z-50 border border-borderDefault"
                        onMouseEnter={cancelSubClose}
                        onMouseLeave={scheduleSubClose}
                      >
                        <div className="mb-2 flex items-center gap-2 text-textPrimary font-semibold">
                          <FaInfoCircle className="text-primary" />
                          Term Insurance
                        </div>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <Link
                              to="/policies/term/overview"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Overview
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/term/benefits"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Benefits & Riders
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/term/calculator"
                              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-bgHover text-textPrimary"
                            >
                              <FaCheckCircle className="text-success" />
                              Premium Calculator
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/policies/term/quote"
                              className="flex items-center justify-between px-3 py-2 rounded bg-primary text-textInverted hover:bg-primaryDark"
                            >
                              Get Quote <IoIosArrowForward />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              )}
            </li>

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
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">
                    Submit Claim
                  </li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">
                    Track Claim
                  </li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">
                    Claim History
                  </li>
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
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">
                    Policy Guides
                  </li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">
                    FAQs
                  </li>
                  <li className="px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer">
                    Blogs
                  </li>
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
              <Link
                className="flex items-center gap-1 cursor-pointer hover:text-primary"
                to="/support"
              >
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
          <Link
            to={"/login"}
            className="border border-primary text-primary px-4 py-1 rounded-md font-semibold shadow-sm hover:bg-primaryLight/10"
          >
            Login
          </Link>
          <Link
            to={"/signup"}
            className="bg-primary text-textInverted px-4 py-1 rounded-md font-semibold shadow hover:bg-primaryDark"
          >
            Register
          </Link>

          {/* PROFILE ICON */}
          <Link
            to={"/profile"}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-bgMuted hover:bg-bgHover transition"
            title="Profile"
          >
            <FaUser className="text-textSecondary" />
          </Link>
        </div>
      </div>

      {/* MOBILE MENU (collapsible) */}
      <div
        id="nav-mobile"
        className={`lg:hidden border-t border-borderDefault ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-2">
          {/* Policies accordion */}
          <button
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-bgHover"
            onClick={() => setMobilePoliciesOpen((v) => !v)}
            aria-expanded={mobilePoliciesOpen}
          >
            <span className="font-medium">Policies</span>
            <IoIosArrowDown
              className={`transition-transform ${
                mobilePoliciesOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {mobilePoliciesOpen && (
            <div className="pl-3 space-y-2">
              {/* Health */}
              <button
                className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-bgHover"
                onClick={() => setMobileHealthOpen((v) => !v)}
              >
                <span>Health Insurance</span>
                <IoIosArrowForward
                  className={`transition-transform ${
                    mobileHealthOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {mobileHealthOpen && (
                <ul className="pl-3 space-y-1 text-sm">
                  <li>
                    <Link to="/policies/health/overview" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/health/benefits" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Benefits
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/health/network" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Hospital Network
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/health/quote" className="block px-2 py-1 rounded bg-primary text-textInverted hover:bg-primaryDark">
                      Get Quote
                    </Link>
                  </li>
                </ul>
              )}

              {/* Motor */}
              <button
                className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-bgHover"
                onClick={() => setMobileMotorOpen((v) => !v)}
              >
                <span>Motor Insurance</span>
                <IoIosArrowForward
                  className={`transition-transform ${
                    mobileMotorOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {mobileMotorOpen && (
                <ul className="pl-3 space-y-1 text-sm">
                  <li>
                    <Link to="/policies/motor/overview" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/motor/coverage" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Coverage & Add-ons
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/motor/renewal" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Renewal
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/motor/quote" className="block px-2 py-1 rounded bg-primary text-textInverted hover:bg-primaryDark">
                      Get Quote
                    </Link>
                  </li>
                </ul>
              )}

              {/* Term */}
              <button
                className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-bgHover"
                onClick={() => setMobileTermOpen((v) => !v)}
              >
                <span>Term Insurance</span>
                <IoIosArrowForward
                  className={`transition-transform ${
                    mobileTermOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {mobileTermOpen && (
                <ul className="pl-3 space-y-1 text-sm">
                  <li>
                    <Link to="/policies/term/overview" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/term/benefits" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Benefits & Riders
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/term/calculator" className="block px-2 py-1 rounded hover:bg-bgHover">
                      Premium Calculator
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies/term/quote" className="block px-2 py-1 rounded bg-primary text-textInverted hover:bg-primaryDark">
                      Get Quote
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Claims accordion */}
          <button
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-bgHover"
            onClick={() => setMobileClaimsOpen((v) => !v)}
            aria-expanded={mobileClaimsOpen}
          >
            <span className="font-medium">Claims</span>
            <IoIosArrowDown
              className={`transition-transform ${mobileClaimsOpen ? "rotate-180" : ""}`}
            />
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
            <IoIosArrowDown
              className={`transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileResourcesOpen && (
            <ul className="pl-3 space-y-1">
              <li>
                <Link to="/resources/guides" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Policy Guides
                </Link>
              </li>
              <li>
                <Link to="/resources/faqs" className="block px-2 py-1 rounded hover:bg-bgHover">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/resources/blogs" className="block px-2 py-1 rounded hover:bg-bgHover">
                  Blogs
                </Link>
              </li>
            </ul>
          )}

          {/* Static links */}
          <div className="pt-2 border-top mt-2 space-y-1 border-t border-borderDefault">
            <Link className="block px-2 py-1 rounded hover:bg-bgHover" to="/about">
              About
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-bgHover" to="/support">
              <span className="inline-flex items-center gap-2">
                Support
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
``
