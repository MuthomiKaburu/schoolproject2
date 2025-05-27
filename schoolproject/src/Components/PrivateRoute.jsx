import { Navigate } from "react-router-dom";
import { userAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) {
 
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
