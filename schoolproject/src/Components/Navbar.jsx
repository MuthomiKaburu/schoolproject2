import React from "react";
import { Link } from "react-router-dom";
import { LogOut, Dumbbell, Star, BarChart3, House,User ,Bot} from "lucide-react";
import fitnessLogo from "../assets/fitnesssmart.png";
import { userAuth } from "../contexts/AuthContext"; 
import "./navbar.css";

const Navbar = () => {
  const { signOut } = userAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">
            <img src={fitnessLogo} alt="Fitness Smart" />
            <p className="name">Trainsmart</p>
          </Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/home"><House /> Home</Link></li>
          <li><Link to="/exercise"><Dumbbell /> Exercise</Link></li>
          <li><Link to="/chatbot"><Bot/> Chatbot</Link></li>
          <li><Link to="/reports"><BarChart3 /> Report</Link></li>
          <li><Link to="/user-profile"><User /> Profile</Link></li>
          <li><button onClick={handleLogout} className="logout-btn"><LogOut /> Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
