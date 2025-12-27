import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-secondary text-textInverted mt-5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Contact */}
          <div id="footer-contact">
            <h6 className="text-md font-semibold text-textInverted">Contact</h6>
            <ul className="mt-2 space-y-2 text-textMuted">
              <li>
                <span className="text-textSecondary">Email:</span>{" "}
                <a
                  href="mailto:support@selfserve.com"
                  className="text-primary hover:text-primaryLight"
                >
                  support@selfserve.com
                </a>
              </li>
              <li>
                <span className="text-textSecondary">Phone:</span>{" "}
                <a
                  href="tel:+18001234567"
                  className="text-primary hover:text-primaryLight"
                >
                  +1 (800) 123-4567
                </a>
              </li>
              <li>
                <span className="text-textSecondary">Hours:</span> Mon–Fri, 9 AM–6 PM
              </li>
              <li className="text-textMuted">Pune, MH · India</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h6 className="text-md font-semibold text-textInverted">Resources</h6>
            <ul className="mt-2 space-y-2 text-textMuted">
              <li className="cursor-pointer hover:text-primary">Help Center</li>
              <li className="cursor-pointer hover:text-primary">FAQs</li>
              <li className="cursor-pointer hover:text-primary">Documentation</li>
              <li className="cursor-pointer hover:text-primary">Status Page</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h6 className="text-md font-semibold text-textInverted">Legal</h6>
            <ul className="mt-2 space-y-2 text-textMuted">
              <li>
                <a href="/terms" className="hover:text-primary">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-primary">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-primary">
                  Security &amp; Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Connect */}
        <div className="mt-10">
          <h6 className="text-md font-semibold text-center text-textInverted">Connect</h6>
          <div className="flex justify-center gap-5 text-2xl mt-3">
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter/X"
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
          © 2025 SelfServe. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
