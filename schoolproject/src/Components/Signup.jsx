import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Signup.css";
import fitnessLogo from "../assets/fitnesssmart.png";
import { UserPlus } from "lucide-react"; // Import signup icon

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the confirmation link.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="signup-container">
      {/* Logo and TrainSmart title */}
      <div className="logo-container">
        <img src={fitnessLogo} alt="Fitness Smart Logo" className="logo" />
        <h1>TrainSmart</h1>
      </div>

      <div className="signup-box">
        <h2>Sign Up</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSignUp}>
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

          <button type="submit" disabled={loading}>
            <UserPlus size={18} className="signup-icon" /> {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
