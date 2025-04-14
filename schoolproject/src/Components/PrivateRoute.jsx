// src/Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { userAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) return <div>Loading...</div>; // Optional: show spinner
  if (!session) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
