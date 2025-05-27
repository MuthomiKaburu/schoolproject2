import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAuth } from "../contexts/AuthContext"; 
import "./Signup.css";
import fitnessLogo from "../assets/fitnesssmart.png";
import { UserPlus } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { signUpNewUser } = userAuth(); 

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await signUpNewUser(email, password);
      if (result.success) {
        setMessage("Check your email for the confirmation link.");
        setTimeout(() => {
          navigate("/login"); 
        }, 3000);
      } else {
        setMessage(result.message || "Sign up failed");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">

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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            <UserPlus size={18} className="signup-icon" />{" "}
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

  
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

