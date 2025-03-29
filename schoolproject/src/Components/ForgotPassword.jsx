import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css";
import fitnessLogo from "../assets/fitnesssmart.png";
import { Mail } from "lucide-react"; // Email icon

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the password reset link.");
      setTimeout(() => navigate("/login"), 5000);
    }

    setLoading(false);
  };

  return (
    <div className="forgot-container">
      {/* Logo and TrainSmart title */}
      <div className="logo-container">
        <img src={fitnessLogo} alt="Fitness Smart Logo" className="logo" />
        <h1>TrainSmart</h1>
      </div>

      <div className="forgot-box">
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleResetPassword}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            <Mail size={18} className="icon" /> {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {/* Login Link */}
        <p>
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
