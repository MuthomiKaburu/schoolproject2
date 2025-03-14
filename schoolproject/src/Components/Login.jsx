import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Login.css";
import fitnessLogo from "../assets/fitnesssmart.png";
import { LogIn } from "lucide-react"; // Import login icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/home"); // Redirect to Home after login
    }
  };

  return (
    <div className="login-container">
      {/* Logo and TrainSmart title */}
      <div className="logo-container">
        <img src={fitnessLogo} alt="Fitness Smart Logo" className="logo" />
        <h1>TrainSmart</h1>
      </div>

      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
             Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
