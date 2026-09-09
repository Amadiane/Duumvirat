import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RouteProtegee({ children }) {
  const { utilisateur, chargement } = useAuth();
  const emplacement = useLocation();

  if (chargement) return null;

  if (!utilisateur) {
    return <Navigate to="/admin/connexion" state={{ depuis: emplacement }} replace />;
  }

  return children;
}