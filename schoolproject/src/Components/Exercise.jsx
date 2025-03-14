import React, { useState } from "react";
import { supabase } from "../supabase";
import Navbar from "./Navbar";
import "./Exercise.css";

const Exercise = () => {
  const [category, setCategory] = useState("");
  const [exercise, setExercise] = useState("");
  const [workoutData, setWorkoutData] = useState({
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
    HIIT: [
      "Jump Squats",
      "Burpees",
      "Mountain Climbers",
      "High Knees",
      "Plank Jacks",
      "Lunges with Jumps",
      "Push-Up to Shoulder Tap",
      "Skater Jumps",
    ],
    "Gym Body Work": [
      "Push-Ups",
      "Squats",
      "Lunges",
      "Plank Hold",
      "Dips",
      "Pull-Ups",
      "Jump Squats",
      "Bicycle Crunches",
    ],
  };

  const handleInputChange = (e) => {
    setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
  };

  const saveWorkout = async () => {
    const { error } = await supabase.from("workouts").insert([
      {
        workout_type: category,
        exercise: exercise,
        ...workoutData,
      },
    ]);

    if (error) {
      console.log("Error:", error);
      alert("Error saving workout!");
    } else {
      alert("Workout saved successfully!");
      setWorkoutData({
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
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="workout-details">
          <label>Repetitions (Reps):</label>
          <input type="number" name="reps" value={workoutData.reps} onChange={handleInputChange} />

          <label>Sets:</label>
          <input type="number" name="sets" value={workoutData.sets} onChange={handleInputChange} />

          <label>Duration (Time in min):</label>
          <input type="text" name="duration" value={workoutData.duration} onChange={handleInputChange} />

          <label>Weight Used(in kg):</label>
          <input type="text" name="weight" value={workoutData.weight} onChange={handleInputChange} />

          <label>Break Duration(minutes):</label>
          <input type="text" name="breakDuration" value={workoutData.breakDuration} onChange={handleInputChange} />

          <label>Number of Breaks:</label>
          <input type="number" name="numBreaks" value={workoutData.numBreaks} onChange={handleInputChange} />

          <label>Distance (if applicable):</label>
          <input type="text" name="distance" value={workoutData.distance} onChange={handleInputChange} />
        </div>

        <div className="notes-section">
          <label>Notes / Feedback:</label>
          <textarea name="notes" value={workoutData.notes} onChange={handleInputChange}></textarea>
        </div>

        <div className="button-container">
          <button className="save-button" onClick={saveWorkout}>Save</button>
          <button className="new-button" onClick={() => setWorkoutData({
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
