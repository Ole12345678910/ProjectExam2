import { useState } from "react";
import { loginUser, getSingleProfile } from "../../components/api";
import { useNavigate, Link } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";

function LoginPage() {
  // State for storing email input value
  const [email, setEmail] = useState("");
  // State for storing password input value
  const [password, setPassword] = useState("");
  // State to hold any error messages that happen during login
  const [error, setError] = useState("");
  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // Function triggered on form submit
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the page from refreshing on form submit
    setError(""); // Clear previous errors

    try {
      // Call API function to login with email and password
      const userData = await loginUser(email, password);

      // Check if response contains token and username
      if (!userData.accessToken || !userData.name) {
        throw new Error("Ingen tilgangstoken eller brukerinformasjon mottatt");
      }

      // Fetch additional profile details using the username
      const { data: profile } = await getSingleProfile(userData.name);

      // Save token and user info in localStorage for later use
      localStorage.setItem("token", userData.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: profile.name,
          avatar: profile.avatar,
          venueManager: profile.venueManager,
        })
      );

      // Navigate to the user's profile page after successful login
      navigate(`/profile/${profile.name}`);
    } catch (err) {
      // Handle specific error codes or show fallback message
      if (err.status === 401) {
        setError("Email or password is wrong.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong, try again later.");
      }
    }
  }

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      <div className="auth-form">
        {/* Top bar with close button and navigation links */}
        <div className="top-line-container">
          <IoMdCloseCircleOutline
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(-1)} // Navigate back when clicking close icon
          />
          <div>
            <Link className="auth-button" to="/login">
              Log in
            </Link>
            <Link className="py-2 font-medium px-5 text-sm" to="/register">
              Sign up
            </Link>
          </div>
        </div>

        {/* Branding logo */}
        <div className="logo-text">
          <div className="center-logo">
            SnapBook
            <div className="logo-circle-dot"></div>
          </div>
        </div>

        <p className="under-text">Your time, perfectly booked.</p>

        {/* Display error message if any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Email input */}
        <div className="content-center">
          <label className="label-container">
            <p className="input-text">E-mail</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
              required
              className="input-styling mt-1 mx-auto"
              placeholder="Enter your email"
            />
          </label>

          {/* Password input */}
          <label className="label-container">
            <p className="input-text">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
              required
              className="input-styling mt-1 mx-auto"
              placeholder="Enter your password"
            />
          </label>
        </div>

        {/* Submit button */}
        <button type="submit" className="standard-button">
          Login
        </button>

        {/* Link to registration page */}
        <div className="mt-4 text-center">
          <Link to="/Register" className="register-line">
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginPage;
