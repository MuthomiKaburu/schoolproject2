import React from "react";
import { Link } from "react-router-dom";
import { LogOut, Dumbbell, Star, BarChart3, House } from "lucide-react";
import fitnessLogo from "../assets/fitnesssmart.png";
import "./navbar.css";

const Navbar = () => {
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
          <li><Link to="/recommendation"><Star /> Recommendation</Link></li>
          <li><Link to="/reports"><BarChart3 /> Report</Link></li>
          <li><Link to="/login"><LogOut /> Logout</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
