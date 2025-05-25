import { Link } from "react-router-dom";
import holizaeMark from "../assets/holizaeMark.png";
import { LuTwitter } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo">
          <Link className="logo-link" to="/">
            Holidaze
            <div className="logo-dot" />
          </Link>
        </div>

        {/* About */}
        <div className="footer-about">
          <p className="about-heading">About Holidaze</p>
          <p className="about-text">
            Holidaze makes booking easy and fast, with stays in your favorite
            cities. Simple, seamless, and all in one app.
          </p>
        </div>

        {/* Links Section with logo on right on md+ screens */}
        <div className="footer-sections">
          <div className="flex flex-col gap-2">
            <p className="footer-column-heading">Connect</p>

            <a
              href="https://twitter.com"
              className="social-links"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter <LuTwitter />
            </a>

            <a
              href="https://www.instagram.com/"
              className="social-links"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com"
              className="social-links"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <FaLinkedin />
            </a>
          </div>

          {/* Logo on right side */}
          <img
            src={holizaeMark}
            className="footer-logo-img "
            alt="Holidaze logo"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <p className="footer-bottom">© 2025 Holidaze. All rights reserved</p>
    </footer>
  );
}

export default Footer;
