import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Exercise from "./Components/Exercise";  
import Reports from "./Components/Reports";  
import Recommendation from "./Components/Recommendation";  
import ForgotPassword from "./Components/ForgotPassword";
import UpdatePassword from "./Components/UpdatePassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/recommendation" element={<Recommendation />} />
      </Routes>
    </Router>
  );
}

export default App;
