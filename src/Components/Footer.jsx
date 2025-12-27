
// src/Components/Footer.jsx
import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  // Theme-aware background + base text (matches Navbar/About behavior)
  const footerBg =
    theme === "dark"
      ? "bg-secondary text-textInverted"
      : "bg-bgCard text-textPrimary";

  return (
    <footer className={`${footerBg} mt-5`}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact */}
          <div id="footer-contact">
            <h6 className="text-md font-semibold">Contact</h6>
            <ul className="mt-2 space-y-2 text-textMuted">
              <li>
                <span className="text-textSecondary">Email :</span>{" "}
                <a
                  href="mailto:support@selfserve.com"
                  className="text-primary hover:text-primaryLight"
                >
                  support@selfserve.com
                </a>
              </li>
              <li>
                <span className="text-textSecondary">Phone :</span>{" "}
                <a
                  href="tel:+9118001234567"
                  className="text-primary hover:text-primaryLight"
                >
                  +91-1800 123 4567
                </a>
              </li>
              <li>
                <span className="text-textSecondary">Hours :</span> Mon–Fri, 9 AM–6 PM
              </li>
              <li className="text-textMuted">Pune, Maharashtra, India</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h6 className="text-md font-semibold">Resources</h6>
            <ul className="mt-2 space-y-2 text-textMuted">
              <li>
                <a href="/help" className="hover:text-primary">Help Center</a>
              </li>
              <li>
                <a href="/faqs" className="hover:text-primary">FAQs</a>
              </li>
              <li>
                <a href="/docs" className="hover:text-primary">Documentation</a>
              </li>
              <li>
                <a href="/status" className="hover:text-primary">Status Page</a>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h6 className="text-md font-semibold">Legal</h6>
            <ul className="mt-2 space-y-2 text-textMuted">
              <li>
                <a href="/terms" className="hover:text-primary">Terms &amp; Conditions</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-primary">Cookie Policy</a>
              </li>
              <li>
                <a href="/security" className="hover:text-primary">Security &amp; Compliance</a>
              </li>
              <li>
                <a href="/refunds" className="hover:text-primary">Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Connect */}
        <div className="mt-10">
          <h6 className="text-md font-semibold text-center">Connect</h6>
          <div className="flex justify-center gap-5 text-2xl mt-3">
            <a
              href="https://wa.me/919937310790"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://facebook.com/selfserve"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com/selfserve"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com/@selfserve"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaYoutube />
            </a>
            <a
              href="https://x.com/selfserve"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-borderDefault my-6" />

        {/* Copyright */}
        <p className="text-center text-sm text-textMuted">
          © {new Date().getFullYear()} SelfServe. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

