import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "./UpdatePassword.css";
import fitnessLogo from "../assets/fitnesssmart.png";
import { Lock } from "lucide-react"; // Lock icon

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/login"), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="update-container">
      <div className="logo-container">
        <img src={fitnessLogo} alt="Fitness Smart Logo" className="logo" />
        <h1>TrainSmart</h1>
      </div>

      <div className="update-box">
        <h2>Set New Password</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleUpdatePassword}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            <Lock size={18} className="icon" /> {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
