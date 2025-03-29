import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Navbar from "./Navbar";
import { User, Target, Scale, Save, Edit3, CheckCircle } from "lucide-react";
import "./home.css";

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [notification, setNotification] = useState(""); // ✅ New state for notifications

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchUserData(user.id);
      } else {
        console.error("User not authenticated", error);
      }
    };
    fetchUser();
  }, []);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
    if (error) {
      console.error("Error fetching user data:", error);
    } else if (data) {
      setName(data.name || "");
      setWeight(data.weight || "");
      setGoal(data.goal || "");
      calculateProgress(data.weight, data.goal);
    }
  };

  const calculateProgress = (currentWeight, targetWeight) => {
    if (currentWeight && targetWeight) {
      let percent = ((currentWeight / targetWeight) * 100).toFixed(1);
      setProgress(Math.min(100, Math.max(0, percent)));
    }
  };

  const updateUser = async (updates, fieldName) => {
    if (!userId) return;
    const { error } = await supabase.from("users").upsert({ id: userId, ...updates });
    if (error) {
      console.error(`Error updating ${fieldName}:`, error);
    } else {
      setNotification(`${fieldName} updated successfully!`); // ✅ Show notification
      setTimeout(() => setNotification(""), 3000); // ✅ Auto-hide after 3 sec
      fetchUserData(userId);
    }
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* ✅ Notification Bar */}
      {notification && (
        <div className="notification">
          <CheckCircle size={18} className="notification-icon" />
          {notification}
        </div>
      )}

      <div className="content-wrapper">
        <div className="user-info">
          {/* Name Box */}
          <div className="info-box name-box">
            <User size={40} />
            {isEditingName ? (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <p>{name || "Enter Name"}</p>
            )}
            {isEditingName ? (
              <Save size={20} className="icon-button" onClick={() => { updateUser({ name }, "Name"); setIsEditingName(false); }} />
            ) : (
              <Edit3 size={20} className="icon-button" onClick={() => setIsEditingName(true)} />
            )}
          </div>

          {/* Weight Box */}
          <div className="info-box weight-box">
            <Scale size={40} />
            {isEditingWeight ? (
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            ) : (
              <p>{weight || "Enter Weight"} kg</p>
            )}
            {isEditingWeight ? (
              <Save size={20} className="icon-button" onClick={() => { updateUser({ weight: Number(weight) }, "Weight"); setIsEditingWeight(false); calculateProgress(weight, goal); }} />
            ) : (
              <Edit3 size={20} className="icon-button" onClick={() => setIsEditingWeight(true)} />
            )}
          </div>

          {/* Goal Box */}
          <div className="info-box goal-box">
            <Target size={40} />
            {isEditingGoal ? (
              <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
            ) : (
              <p>{goal || "Enter Goal"} kg</p>
            )}
            {isEditingGoal ? (
              <Save size={20} className="icon-button" onClick={() => { updateUser({ goal: Number(goal) }, "Goal"); setIsEditingGoal(false); calculateProgress(weight, goal); }} />
            ) : (
              <Edit3 size={20} className="icon-button" onClick={() => setIsEditingGoal(true)} />
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <p>Progress: {progress}%</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <p className="motivational-quote">"Every workout is progress. Keep pushing!"</p>
      </div>
    </div>
  );
};

export default Home;
