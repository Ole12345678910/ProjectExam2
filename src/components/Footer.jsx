import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="flex flex-col bg-greySecond px-4 py-6">
        {/* Logo */}
        <div className="text-xl font-montserrat font-semibold mb-4">
          <Link className="flex items-center" to="/">
            Holidaze
            <div className="h-[1rem] w-[1rem] bg-yellowMain border-2 border-black rounded-full ml-1"></div>
          </Link>
        </div>

        {/* About */}
        <div className="mb-6 max-w-2xl">
          <p className="font-semibold mb-1">About Holidaze</p>
          <p className="text-sm text-gray-700">
            Holidaze makes booking easy and fast, with stays in your favorite
            cities. Simple, seamless, and all in one app.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-between w-full mb-6">
          <div className="flex flex-1 justify-around">
            <div>
              <p className="font-semibold mb-1">Connect</p>
              <p>Instagram</p>
              <p>Twitter</p>
              <p>LinkedIn</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Support</p>
              <p>Help Center</p>
              <p>Contact Us</p>
              <p>Terms & Privacy</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Explore</p>
              <p>How It Works</p>
              <p>Cities We Serve</p>
              <p>Become a Host</p>
            </div>
          </div>

          {/* Logo image aligned to right */}
          <img
            className="w-32 h-32 m-3 self-start"
            src="/src/assets/holizaeMark.png"
            alt="Holidaze logo"
          />
        </div>

        {/* Bottom bar */}
      </div>
        <p className="bg-yellowMain text-center text-[8px] py-1">
          © 2025 Holidaze. All rights reserved
        </p>
    </footer>
  );
}

export default Footer;
