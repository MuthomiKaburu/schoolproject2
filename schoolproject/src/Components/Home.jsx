import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Navbar from "./Navbar";
import {User,Target,Scale,Save,Edit3,CheckCircle,LineChart,} from "lucide-react";
import {
  Line
} from "react-chartjs-2";
import {Chart as ChartJS, LineElement,PointElement,CategoryScale,LinearScale,Tooltip,Legend} from "chart.js";
import "./Home.css";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [notification, setNotification] = useState("");
  const [weightsHistory, setWeightsHistory] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchUserData(user.id);
        fetchWeightHistory(user.id);
      } else {
        console.error("User not authenticated", error);
      }
    };
    fetchUser();
  }, []);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error fetching user data:", error);
    } else if (data) {
      setName(data.name || "");
      setWeight(data.weight || "");
      setGoal(data.goal || "");
    }
  };

  const fetchWeightHistory = async (userId) => {
    const { data, error } = await supabase
      .from("weights")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: true });
    if (error) {
      console.error("Error fetching weight history:", error);
    } else {
      setWeightsHistory(data);
    }
  };

  const calculateProgress = (currentWeight, targetWeight) => {
    if (!weightsHistory || weightsHistory.length === 0 || !targetWeight) {
      setProgress(0);
      return;
    }

    const initialWeight = weightsHistory[0].weight;
    const current = Number(currentWeight);
    const goal = Number(targetWeight);

    const totalChangeNeeded = Math.abs(goal - initialWeight);
    const progressMade = Math.abs(current - initialWeight);

    if (totalChangeNeeded === 0) {
      setProgress(100);
      return;
    }

    const percent = ((progressMade / totalChangeNeeded) * 100).toFixed(1);
    setProgress(Math.min(100, Math.max(0, percent)));
  };

  useEffect(() => {
    if (weight && goal) {
      calculateProgress(weight, goal);
    }
  }, [weightsHistory, weight, goal]);

  const updateUser = async (updates, fieldName) => {
    if (!userId) return;
    const { error } = await supabase
      .from("users")
      .upsert({ id: userId, ...updates });
    if (error) {
      console.error(`Error updating ${fieldName}:`, error);
    } else {
      setNotification(`${fieldName} updated successfully!`);
      setTimeout(() => setNotification(""), 3000);
      fetchUserData(userId);
    }
  };

  const saveWeightToHistory = async (newWeight) => {
    if (!userId) return;
    const { error } = await supabase.from("weights").insert([
      {
        user_id: userId,
        weight: Number(newWeight),
      },
    ]);
    if (error) console.error("Error saving weight history:", error);
    else fetchWeightHistory(userId);
  };

  const handleWeightUpdate = async () => {
    await updateUser({ weight: Number(weight) }, "Weight");
    await saveWeightToHistory(weight);
    setIsEditingWeight(false);
  };

  const getWeightChange = () => {
    if (weightsHistory.length < 2) return "No data";
    const first = weightsHistory[0].weight;
    const last = weightsHistory[weightsHistory.length - 1].weight;
    const change = last - first;
    return change === 0
      ? "No change"
      : change > 0
        ? `Gained ${change} kg`
        : `Lost ${Math.abs(change)} kg`;
  };

  const chartData = {
    labels: weightsHistory.map((entry) =>
      new Date(entry.recorded_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightsHistory.map((entry) => entry.weight),
        fill: false,
        borderColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="home-container">
      <Navbar />
      {notification && (
        <div className="notification">
          <CheckCircle size={18} className="notification-icon" />
          {notification}
        </div>
      )}

      <div className="content-wrapper">
        <div className="user-info">
          
          <div className="info-box name-box">
            <User size={40} />
            {isEditingName ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <p>{name || "Enter Name"}</p>
            )}
            {isEditingName ? (
              <Save
                size={20}
                className="icon-button"
                onClick={() => {
                  updateUser({ name }, "Name");
                  setIsEditingName(false);
                }}
              />
            ) : (
              <Edit3
                size={20}
                className="icon-button"
                onClick={() => setIsEditingName(true)}
              />
            )}
          </div>

          
          <div className="info-box weight-box">
            <Scale size={40} />
            {isEditingWeight ? (
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            ) : (
              <p>{weight || "Enter Weight"} kg</p>
            )}
            {isEditingWeight ? (
              <Save
                size={20}
                className="icon-button"
                onClick={handleWeightUpdate}
              />
            ) : (
              <Edit3
                size={20}
                className="icon-button"
                onClick={() => setIsEditingWeight(true)}
              />
            )}
          </div>

          
          <div className="info-box goal-box">
            <Target size={40} />
            {isEditingGoal ? (
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            ) : (
              <p>{goal || "Enter Goal"} kg</p>
            )}
            {isEditingGoal ? (
              <Save
                size={20}
                className="icon-button"
                onClick={() => {
                  updateUser({ goal: Number(goal) }, "Goal");
                  setIsEditingGoal(false);
                }}
              />
            ) : (
              <Edit3
                size={20}
                className="icon-button"
                onClick={() => setIsEditingGoal(true)}
              />
            )}
          </div>
        </div>

        <div className="progress-section">
          <p>Progress: {progress}%</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="motivational-quote">
          "Every workout is progress. Keep pushing!💪"
        </p>

        <div className="weight-stats-chart">
          <div className="weight-chart-box">
            <h3>
              <LineChart size={20} /> Weight Trend
            </h3>
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="weight-history-table">
            <h3 className="weight_history">Weight History</h3>
            <table>
              <thead>
                <tr>
                  <th className="weight_th">Date</th>
                  <th className="weight_th">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {weightsHistory.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.recorded_at).toLocaleDateString()}</td>
                    <td>{entry.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
