import { useState } from "react";
import { loginUser, getSingleProfile } from "../../components/api";
import { useNavigate, Link } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const userData = await loginUser(email, password);
      console.log("Logged in user:", userData);

      if (!userData.accessToken || !userData.name) {
        throw new Error("No access token or user data received");
      }

      const { data: profile } = await getSingleProfile(userData.name);
      console.log("Fetched profile after login:", profile);

      localStorage.setItem("token", userData.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: profile.name,
          avatar: profile.avatar,
          venueManager: profile.venueManager,
        })
      );

      navigate(`/profile/${profile.name}`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <form
      className="auth-container"
      onSubmit={handleSubmit}
    >
      <div className="auth-form">
        {/* Header with close and auth buttons */}
        <div className="top-line-container">
          <IoMdCloseCircleOutline
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(-1)} // Navigate back on click
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

        {/* Logo & title */}
        <div className="logo-text">
          <div className="center-logo">
            SnapBook
            <div className="logo-circle-dot"></div>
          </div>
        </div>

        <p className="under-text">
          Your time, perfectly booked.
        </p>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="content-center">
          {/* Email */}
          <label className="label-container">
            <p className="input-text">E-mail</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-styling mt-1 mx-auto"
              placeholder="Enter your email"
            />
          </label>

          {/* Password */}
          <label className="label-container">
            <p className="input-text">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-styling mt-1 mx-auto"
              placeholder="Enter your password"
            />
          </label>
        </div>

        {/* Submit & register */}
        <button type="submit" className="standard-button">
          Login
        </button>

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
