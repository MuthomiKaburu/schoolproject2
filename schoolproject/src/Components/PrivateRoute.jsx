/* src/Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { userAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
*/
import { Navigate } from "react-router-dom";
import { userAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) {
    // Optional: you can add a spinner here
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
