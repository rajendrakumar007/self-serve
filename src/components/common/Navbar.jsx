import { useContext, useEffect, useRef, useState, useMemo } from "react";
import { ThemeContext } from "../../Context/ThemeContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { FaShieldAlt, FaBell, FaSun, FaMoon } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom"; 
import { AUTH_EVENT, getCurrentUser, getCurrentUserId } from "../../utils/auth/auth.js";
import pp from "../../assets/pp.png";
import NotificationCard from "../notifications/NotificationCard.jsx";
import NotificationModal from "../notifications/NotificationModal.jsx";
import { getNotificationsFromApi , markNotificationAsRead } from "../../utils/notifications/notifications.js";

const CLOSE_DELAY_MS = 150;

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated ,setIsAuthenticated} = useContext(AuthContext);
  const userId = getCurrentUserId();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // location for active highlighting
  const location = useLocation(); 
  const isCurrent = (path) => location.pathname === path; 

  // Helper: active for dropdown triggers if any child path matches
  const isAnyActive = (paths) => paths.some((p) => location.pathname.startsWith(p));

  // 1. FETCH LOGIC
  const refreshNotifications = () => {
    if (userId) {
      getNotificationsFromApi(userId)
        .then((data) => setNotifications(data))
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  };

  // 2. INITIAL FETCH & EVENT LISTENER
  useEffect(() => {
    refreshNotifications();

    window.addEventListener("notificationUpdated", refreshNotifications);
    return () => {
      window.removeEventListener("notificationUpdated", refreshNotifications);
    };
  }, [userId]);

  // 3. MARK AS READ LOGIC
  useEffect(() => {
    if (!isOpen) return;

    const unreadNotifications = notifications.filter((n) => !n.read);
    if (unreadNotifications.length === 0) return;

    const unreadIds = unreadNotifications.map((n) => n.id);

    setNotifications((prev) =>
      prev.map((n) => (unreadIds.includes(n.id) ? { ...n, read: true } : n))
    );

    Promise.all(unreadIds.map(id => markNotificationAsRead(id)))
      .catch((err) => console.error("Failed to persist read status", err));

  }, [isOpen]);

  // 4. MEMOIZED VALUES
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const uniqueTypes = useMemo(
    () => Array.from(new Set(notifications.map((n) => n.type))),
    [notifications]
  );

  const tabs = useMemo(() => {
    const allCount = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const read = notifications.filter((n) => n.read).length;

    const typeTabs = uniqueTypes.map((type) => ({
      key: type,
      label: type,
      count: notifications.filter((n) => n.type === type).length,
    }));

    return [
      { key: "All", label: "All", count: allCount },
      { key: "Unread", label: "Unread", count: unread },
      { key: "Read", label: "Read", count: read },
      ...typeTabs,
    ];
  }, [notifications, uniqueTypes]);

  const filtered = useMemo(() => {
    switch (activeTab) {
      case "Unread": return notifications.filter((n) => !n.read);
      case "Read": return notifications.filter((n) => n.read);
      case "All": return notifications;
      default: return notifications.filter((n) => n.type === activeTab);
    }
  }, [notifications, activeTab]);

  const byDateDesc = (a, b) => new Date(b.sentDate) - new Date(a.sentDate);

  const newNotifications = useMemo(
    () => filtered.filter((n) => !n.read).sort(byDateDesc),
    [filtered]
  );
  const earlierNotifications = useMemo(
    () => filtered.filter((n) => n.read).sort(byDateDesc),
    [filtered]
  );

  useEffect(() => {
    const handler = () => {
      // setIsAuthenticated(isLoggedIn());
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("storage", handler);
    window.addEventListener(AUTH_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(AUTH_EVENT, handler);
    };
  }, []);

  const [openDropdown, setOpenDropdown] = useState(null); // 'policies' | 'claims' | 'premiums' | null
  const dropdownCloseTimer = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);
  const [mobileClaimsOpen, setMobileClaimsOpen] = useState(false);
  const [mobilePremiumsOpen, setMobilePremiumsOpen] = useState(false);

  const navRef = useRef(null);

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

  const dropdownBase =
    theme === "dark"
      ? "absolute mt-2 min-w-64 p-2 rounded-lg shadow-2xl z-50"
      : "absolute mt-2 min-w-64 p-2 rounded-lg shadow-xl z-50";

  const dropdownTheme =
    theme === "dark"
      ? "bg-textPrimary text-textInverted ring-[0.5px] ring-borderStrong"
      : "bg-bgCard text-textSecondary ring-1 ring-borderDefault";

  const dropdownItem =
    theme === "dark"
      ? "block px-4 py-2 rounded-md hover:bg-bgHover/10 text-textInverted"
      : "block px-4 py-2 rounded-md hover:bg-bgHover ";

  const dropdownItemPlain =
    theme === "dark"
      ? "px-4 py-2 hover:bg-bgHover/10 rounded-md cursor-pointer text-textInverted"
      : "px-4 py-2 hover:bg-bgHover rounded-md cursor-pointer text-textPrimary";

  const triggerBtn =
    theme === "dark"
      ? "font-medium flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:!bg-white/5 hover:text-primary"
      : "font-medium flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-bgHover hover:text-primary";

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


  const endsWith = (prefix) => location.pathname.endsWith(prefix);
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
          <ul className="flex gap-7 items-center ">
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
                className={`${triggerBtn} ${isAnyActive([
                  "/policies/",
                  "/policies/car",
                  "/policies/bike",
                  "/policies/health",
                  "/policies/life",
                  "/policies/travel",
                  "/policies/airpass",
                ]) ? "text-primary" : ""}`}
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
                    <Link to="/policies/car" className={` ${isCurrent("/policies/car") ? "text-primary" : ""} ${dropdownItem}`} role="menuitem">
                      Car Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/bike" className={`${dropdownItem} ${endsWith("/bike") ? "text-primary" : ""}`} role="menuitem">
                      Bike Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/health" className={`${dropdownItem} ${endsWith("/health") ? "text-primary" : ""}`} role="menuitem">
                      Health Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/life" className={`${dropdownItem} ${endsWith("/life") ? "text-primary" : ""}`} role="menuitem">
                      Life Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/travel" className={`${dropdownItem} ${endsWith("/travel") ? "text-primary" : ""}`} role="menuitem">
                      Travel Insurance
                    </Link>
                  </li>
                  <li role="none">
                    <Link to="/policies/airpass" className={`${dropdownItem} ${endsWith("/airpass") ? "text-primary" : ""}`} role="menuitem">
                      Air Pass
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Check Your Policy — ONLY when logged in */}
            {isAuthenticated && (
              <li>
                <Link className={` font-medium cursor-pointer hover:text-primary ${isCurrent("/check-policy") ? "text-primary" : ""}`} to="/check-policy">
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
                className={`${triggerBtn} ${isAnyActive([
                  "/submit-claim",
                  "/track-claims",
                  "/guide-lines",
                ]) ? "text-primary" : ""}`} 
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
                  <li className={dropdownItemPlain} role="menuitem">
                    <Link to="/submit-claim" className={`${isCurrent("/submit-claim") ? "text-primary" : ""}`}>Submit Claim</Link>
                  </li>
                  <li className={dropdownItemPlain} role="menuitem">
                    <Link to="/track-claims" className={`${isCurrent("/track-claims") ? "text-primary" : ""}`}>Track Claim</Link>
                  </li>
                  <li className={dropdownItemPlain} role="menuitem">
                    <Link to="/guide-lines" className={`${isCurrent("/guide-lines") ? "text-primary" : ""}`}>Estimated Timelines</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* PREMIUMS */}
            <li
              className="relative"
              onMouseEnter={() => {
                cancelDropdownClose();
                openOnly("premiums");
              }}
              onMouseLeave={scheduleDropdownClose}
            >
              <button
                type="button"
                className={`${triggerBtn} ${isAnyActive([
                  "/pay-premiums",
                  "/renewals",
                  "/payment-history",
                ]) ? "text-primary" : ""}`}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "premiums"}
              >
                <span className="font-medium">Premiums</span>
                <IoIosArrowDown size={14} />
              </button>

              {openDropdown === "premiums" && (
                <ul
                  className={`${dropdownBase} ${dropdownTheme}`}
                  onMouseEnter={cancelDropdownClose}
                  onMouseLeave={scheduleDropdownClose}
                  role="menu"
                >
                  <li role="none" className={dropdownItemPlain}>
                    <Link to="/pay-premiums" className={`${isCurrent("/pay-premiums") ? "text-primary" : ""}`}>Pay Premiums</Link>
                  </li>
                  <li role="none" className={dropdownItemPlain}>
                    <Link to="/renewals" className={`${isCurrent("/renewals") ? "text-primary" : ""}`}>Renewals</Link>
                  </li>
                  <li role="none" className={dropdownItemPlain}>
                    <Link to="/payment-history" className={`${isCurrent("/payment-history") ? "text-primary" : ""}`}>Payment History</Link>
                  </li>
                </ul>
              )}
            </li>


            {/* Static links */}
            <li>
              <Link className={` font-medium cursor-pointer hover:text-primary ${isCurrent("/about") ? "text-primary" : ""}`} to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className={` font-medium flex items-center gap-1 cursor-pointer hover:text-primary ${isCurrent("/support") ? "text-primary" : ""}`} to="/support">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <FaBell className="text-lg cursor-pointer" onClick={openModal} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-textInverted text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none ring-1 ring-borderDefault">
                {unreadCount}
              </span>
            )}
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
              to="/profile"
              className="
    flex items-center gap-2 px-2 py-1 rounded-md
    hover:bg-bgHover dark:hover:bg-secondary/80
    transition-colors
    focus:outline-none focus:ring-2 focus:ring-primary
  "
              title="Profile"
            >
              <img
                src={pp}
                alt="profile"
                className="
      w-9 h-9 rounded-full object-cover
      ring-1 ring-borderDefault dark:ring-borderStrong
    "
              />
              {currentUser?.name && (
                <span
                  className="
        hidden sm:inline text-sm
        text-textPrimary dark:text-textInverted
        hover:text-primary dark:hover:text-primaryLight
        transition-colors
      "
                >
                  Hi {currentUser.name.split(" ")[0]}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Notifications"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {/* Unread */}
        <section className="mb-6">
          <div className="mt-2 space-y-3">
            {newNotifications.length === 0 ? (
              <p className="text-sm text-gray-500"></p>
            ) : (
              newNotifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onToggleRead={(makeRead) =>
                    setNotifications((prev) =>
                      prev.map((x) =>
                        x.id === n.id ? { ...x, read: makeRead } : x
                      )
                    )
                  }
                />
              ))
            )}
          </div>
        </section>

        {/* Read */}
        <section>
          <h4 className="text-sm font-semibold text-textSecondary uppercase tracking-wider">
          </h4>
          <div className="mt-2 space-y-3">
            {earlierNotifications.length === 0 ? (
              <p className="text-sm text-gray-500">No earlier notifications.</p>
            ) : (
              earlierNotifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onToggleRead={(makeRead) =>
                    setNotifications((prev) =>
                      prev.map((x) =>
                        x.id === n.id ? { ...x, read: makeRead } : x
                      )
                    )
                  }
                />
              ))
            )}
          </div>
        </section>
      </NotificationModal>

      {/* MOBILE MENU */}
      <div
        id="nav-mobile"
        className={`lg:hidden border-t border-borderDefault ${mobileOpen ? "block" : "hidden"
          }`}
      >
        <div className="px-4 py-3 space-y-2">
          {/* Policies accordion (mobile) */}
          <button
            className={mobileTriggerBtn}
            onClick={() => setMobilePoliciesOpen((v) => !v)}
            aria-expanded={mobilePoliciesOpen}
          >
            <span className="font-medium">Policies</span>
            <IoIosArrowDown
              className={`transition-transform ${mobilePoliciesOpen ? "rotate-180" : ""
                }`}
            />
          </button>
          {mobilePoliciesOpen && (
            <ul className={`pl-3 space-y-1 text-sm ${theme === "dark" ? "text-textInverted" : "text-textPrimary"}`}>
              <li>
                <Link to="/policies/car" className={`${mobileLink} ${isCurrent("/policies/car") ? "text-primary" : ""}`}>
                  Car Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/bike" className={`${mobileLink} ${isCurrent("/policies/bike") ? "text-primary" : ""}`}>
                  Bike Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/health" className={`${mobileLink} ${isCurrent("/policies/health") ? "text-primary" : ""}`}>
                  Health Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/life" className={`${mobileLink} ${isCurrent("/policies/life") ? "text-primary" : ""}`}>
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/travel" className={`${mobileLink} ${isCurrent("/policies/travel") ? "text-primary" : ""}`}>
                  Travel Insurance
                </Link>
              </li>
              <li>
                <Link to="/policies/airpass" className={`${mobileLink} ${isCurrent("/policies/airpass") ? "text-primary" : ""}`}>
                  Air Pass
                </Link>
              </li>
            </ul>
          )}

          {isAuthenticated && (
            <Link to="/check-policy" className={`${mobileMenuLink} ${isCurrent("/check-policy") ? "text-primary" : ""}`}>
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
            <IoIosArrowDown
              className={`transition-transform ${mobileClaimsOpen ? "rotate-180" : ""
                }`}
            />
          </button>
          {mobileClaimsOpen && (
            <ul className={`pl-3 space-y-1 ${theme === "dark" ? "text-textInverted" : "text-textPrimary"}`}>
              <li role="none">
                <Link to="/submit-claim" className={`${mobileLink} ${isCurrent("/submit-claim") ? "text-primary" : ""}`}>
                  Submit Claim
                </Link>
              </li>
              <li role="none">
                <Link to="/track-claims" className={`${mobileLink} ${isCurrent("/track-claims") ? "text-primary" : ""}`}>
                  Track Claim
                </Link>
              </li>
              <li role="none">
                <Link to="/guide-lines" className={`${mobileLink} ${isCurrent("/guide-lines") ? "text-primary" : ""}`}>
                  Estimated Timelines
                </Link>
              </li>
            </ul>
          )}

          {/* Premiums accordion (mobile) */}
          <button
            className={mobileTriggerBtn}
            onClick={() => setMobilePremiumsOpen((v) => !v)}
            aria-expanded={mobilePremiumsOpen}
          >
            <span className="font-medium">Premiums</span>
            <IoIosArrowDown
              className={`transition-transform ${mobilePremiumsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobilePremiumsOpen && (
            <ul className={`pl-3 space-y-1 ${theme === "dark" ? "text-textInverted" : "text-textPrimary"}`}>
              <li role="none">
                <Link to="/pay-premiums" className={`${mobileLink} ${isCurrent("/pay-premiums") ? "text-primary" : ""}`}>
                  Pay Premiums
                </Link>
              </li>
              <li role="none">
                <Link to="/renewals" className={`${mobileLink} ${isCurrent("/renewals") ? "text-primary" : ""}`}>
                  Renewals
                </Link>
              </li>
              <li role="none">
                <Link to="/payment-history" className={`${mobileLink} ${isCurrent("/payment-history") ? "text-primary" : ""}`}>
                  Payment History
                </Link>
              </li>
            </ul>
          )}

          {/* Static links (mobile) */}
          <div className="pt-2 mt-2 space-y-1 border-t border-borderDefault">
            <Link className={`${mobileLink} ${isCurrent("/about") ? "text-primary" : ""}`} to="/about">
              About
            </Link>
            <Link className={`${mobileLink} ${isCurrent("/support") ? "text-primary" : ""}`} to="/support">
              <span className="inline-flex items-center gap-2">Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;