import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import fitnessLogo from "../assets/fitnesssmart.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={fitnessLogo} alt="Fitness Smart Logo" className="logo left" />
      <ul className="nav-links">
        <li><Link to="/exercise">Exercise</Link></li>
        <li><Link to="/recommendation">Recommendations</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
