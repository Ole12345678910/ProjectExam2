import { useState } from "react";
import { loginUser, getSingleProfile } from "../components/api"; 
import { useNavigate, Link } from "react-router-dom";

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

      const profileResponse = await getSingleProfile(userData.name);
      const profile = profileResponse.data;
      console.log("Fetched profile after login:", profile);


      localStorage.setItem("token", userData.accessToken);
      localStorage.setItem("user", JSON.stringify({
        name: userData.name,
        email: userData.email,
        venueManager: profile.venueManager ?? false, 
      }));


      navigate(`/profile/${userData.name}`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Login</button>
      <Link to="/Register" className="hover:underline">Register</Link>
    </form>
  );
}

export default LoginPage;
