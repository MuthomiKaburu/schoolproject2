import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Exercise from "./Components/Exercise";  
import Reports from "./Components/Reports";   
import ForgotPassword from "./Components/ForgotPassword";
import UpdatePassword from "./Components/UpdatePassword";
import PrivateRoute from "./Components/PrivateRoute";
import ChatBot from './Components/chatbot'; 
import UserProfile from "./Components/UserProfile"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/exercise" element={<PrivateRoute><Exercise /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/chatbot" element={<PrivateRoute><ChatBot/></PrivateRoute>} />
        <Route path="/user-profile" element={<PrivateRoute><UserProfile/></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
