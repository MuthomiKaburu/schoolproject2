import React, { useState } from "react";
import { supabase } from "../supabase";
import Navbar from "./Navbar";
import { Dumbbell, Clock, Edit3, Calendar } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Exercise.css";

const Exercise = () => {
  const [category, setCategory] = useState("");
  const [exercise, setExercise] = useState("");
  const [workoutData, setWorkoutData] = useState({
    workout_date: new Date().toISOString().split("T")[0], // Default to today's date
    reps: "",
    sets: "",
    duration: "",
    weight: "",
    breakDuration: "",
    numBreaks: "",
    distance: "",
    notes: "",
  });

  const exercises = {
    HIIT: ["Jump Squats", "Burpees", "Mountain Climbers", "High Knees","Knee lifts","Jumping jacks","Plank Crunches"],
    "Gym Body Work": ["Push-Ups", "Squats", "Lunges", "Plank Hold","Bench press","Deadlifts","Pull-ups","Barbell squats"],
  };

  const handleInputChange = (e) => {
    setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
  };

 const saveWorkout = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    toast.error("❌ Could not get user info");
    return;
  }

  const { error } = await supabase.from("workouts").insert([
    {
      user_id: user.id,
      workout_type: category,
      exercise: exercise,
      ...workoutData,
    },
  ]);

  if (error) {
    toast.error("❌ Error saving workout!", { position: "top-right", autoClose: 3000 });
  } else {
    toast.success("✅ Workout saved successfully!", { position: "top-right", autoClose: 3000 });
    setWorkoutData({
      workout_date: new Date().toISOString().split("T")[0],
      reps: "",
      sets: "",
      duration: "",
      weight: "",
      breakDuration: "",
      numBreaks: "",
      distance: "",
      notes: "",
    });
  }
};


  return (
    <div className="exercise-page">
      <Navbar />
      <ToastContainer />

      <div className="exercise-container">
        <h2 className="title">Log Your Workout</h2>

        <div className="dropdown-section">
          <label>Choose Exercise Type:</label>
          <select onChange={(e) => setCategory(e.target.value)} value={category}>
            <option value="">Select</option>
            <option value="HIIT">HIIT</option>
            <option value="Gym Body Work">Gym Body Work</option>
          </select>

          {category && (
            <>
              <label>Choose Exercise:</label>
              <select onChange={(e) => setExercise(e.target.value)} value={exercise}>
                <option value="">Select</option>
                {exercises[category]?.map((ex) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="workout-details">
          <label><Calendar size={18} /> Workout Date:</label>
          <input type="date" name="workout_date" value={workoutData.workout_date} onChange={handleInputChange} />

          <label><Dumbbell size={18} /> Number of Reps:</label>
          <input type="number" name="reps" value={workoutData.reps} onChange={handleInputChange} />

          <label><Dumbbell size={18} />Number of Sets:</label>
          <input type="number" name="sets" value={workoutData.sets} onChange={handleInputChange} />

          <label><Clock size={18} /> Duration of the workout in (min):</label>
          <input type="text" name="duration" value={workoutData.duration} onChange={handleInputChange} />

          <label><Dumbbell size={18} /> Weight of dumbells/weights (kg):</label>
          <input type="text" name="weight" value={workoutData.weight} onChange={handleInputChange} />

          <label>Break Duration (min):</label>
          <input type="text" name="breakDuration" value={workoutData.breakDuration} onChange={handleInputChange} />

          <label>Number of Breaks taken in between or after workout:</label>
          <input type="number" name="numBreaks" value={workoutData.numBreaks} onChange={handleInputChange} />

          <label>Distance taken  (if applicable):</label>
          <input type="text" name="distance" value={workoutData.distance} onChange={handleInputChange} />
        </div>

        <div className="notes-section">
          <label><Edit3 size={18} /> Notes:</label>
          <textarea name="notes" value={workoutData.notes} onChange={handleInputChange}></textarea>
        </div>

        <div className="button-container">
          <button className="save-button" onClick={saveWorkout}>Save</button>
          <button className="new-button" onClick={() => setWorkoutData({
            workout_date: new Date().toISOString().split("T")[0],
            reps: "", sets: "", duration: "", weight: "", breakDuration: "", numBreaks: "", distance: "", notes: ""
          })}>
            New
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
