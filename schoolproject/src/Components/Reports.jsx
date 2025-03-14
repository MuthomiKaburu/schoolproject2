import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { supabase } from "../supabase";
import Navbar from "./Navbar"; // Import Navbar
import "./Reports.css";

Chart.register(...registerables);

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  const fetchWorkoutHistory = async () => {
    try {
      const { data, error } = await supabase.from("workouts").select("*");
      if (error) {
        console.error("Error fetching workout history:", error);
        return;
      }
      setWorkoutHistory(data);
      updateChart(data);
    } catch (error) {
      console.error("Error fetching workout history:", error);
    }
  };

  const updateChart = (data) => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((workout) => workout.exercise),
        datasets: [
          {
            label: "Workout Duration (minutes)",
            data: data.map((workout) => workout.duration),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  return (
    <div className="reports-container">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className={`reports-content ${sidebarOpen ? "shifted" : ""}`}>
        <h1 className="page-title">Workout Reports</h1>

        <div className="chart-container">
          <canvas id="workoutChart" ref={chartRef}></canvas>
        </div>

        <div className="history-section">
          <h2>Workout History</h2>
          <ul>
            {workoutHistory.map((workout) => (
              <li key={workout.id}>
                {workout.exercise} - {workout.duration} minutes
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
