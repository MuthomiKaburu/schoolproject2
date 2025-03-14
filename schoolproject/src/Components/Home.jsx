import React from "react";
import "./Home.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="content">
        <div className="info-box blue">Username: John Doe</div>
        <div className="info-box red">Weight: 75kg</div>
        <div className="info-box green">Goal: Lose 5kg</div>
      </div>
      <div className="quote-box">
        "Success isn’t always about greatness. It’s about consistency. Consistent hard work gains success. Greatness will come."
      </div>
      <div className="exercise-link">
      <p>Start your workout journey today! Click below to begin.</p>
      <Link to="/exercise">
        <button className="exercise">Exercise Page</button>
      </Link>
      </div>
    </div>
  );
};

export default Home;
