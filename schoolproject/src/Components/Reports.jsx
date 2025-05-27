import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Navbar from "./Navbar";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./Reports.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState(["HIIT", "Gym Body Work"]);
  const [selectedWorkout, setSelectedWorkout] = useState("All Workouts");
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Fetch workouts from Supabase
  useEffect(() => {
   const fetchWorkouts = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setAlert({ message: "Could not get user info", type: "error" });
    return;
  }

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id); // Only fetch user's workouts

  if (error) {
    setAlert({ message: "Error fetching workouts!", type: "error" });
    console.error("Error fetching workouts:", error);
  } else {
    if (data.length === 0) {
      setAlert({ message: "No workouts found!", type: "warning" });
    } else {
      setAlert({ message: "Workouts loaded successfully!", type: "success" });
    }

    setWorkoutHistory(data);
    setFilteredWorkouts(data);
  }
};


    fetchWorkouts();
  }, []);

  // Handle dropdown selection
  const handleWorkoutChange = (e) => {
    const selectedType = e.target.value;
    setSelectedWorkout(selectedType);

    if (selectedType === "All Workouts") {
      setFilteredWorkouts(workoutHistory);
    } else {
      setFilteredWorkouts(workoutHistory.filter((workout) => workout.workout_type === selectedType));
    }
  };

  // Prepare data for the graph
  const progressData = {
    labels: filteredWorkouts.map((workout) => new Date(workout.workout_date).toLocaleDateString()), // Updated column
    datasets: [
      {
        label: "Workout Duration (min)",
        data: filteredWorkouts.map((workout) => workout.duration),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="reports-page">
      <Navbar />
      <h2 className="title">Workout Reports</h2>

      {/* Styled Alert Messages */}
      {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}

      {/* Dropdown Filter */}
      <div className="filter-container">
        <select className="dropdown" value={selectedWorkout} onChange={handleWorkoutChange}>
          <option value="All Workouts">All Workouts</option>
          {workoutTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Workout History Table */}
      <table className="workout-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Exercise</th>
            <th>Reps</th>
            <th>Sets</th>
            <th>Duration (min)</th>
            <th>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <tr key={workout.id}>
                <td>{new Date(workout.workout_date).toLocaleDateString()}</td> {/* Updated column */}
                <td>{workout.workout_type}</td>
                <td>{workout.exercise}</td>
                <td>{workout.reps || "N/A"}</td>
                <td>{workout.sets || "N/A"}</td>
                <td>{workout.duration}</td>
                <td>{workout.weight || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Progress Chart */}
      <div className="chart-container">
        <h3>Workout Progress</h3>
        {filteredWorkouts.length > 0 ? <Line data={progressData} /> : <p>No data for graph</p>}
      </div>
    </div>
  );
};

export default Reports;
