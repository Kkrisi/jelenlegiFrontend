import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";



export default function ProtectedRoute({ roleRequired }) {

  const { user } = useAuthContext();

  /*if (!user) {
      return <Navigate to="/bejelentkezes" />;
  }*/

  if (roleRequired && user.jogosultsag_azon !== roleRequired) {
      return <Navigate to="/emailKuldes" />;
  }

  return <Outlet />; // a protectedroute-ban levo route-kat mutatja
}
