import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";



export default function ProtectedRoute({ roleRequired }) {

  const { user } = useAuthContext();

  /*if (!user) {
      return <Navigate to="/bejelentkezes" />;
  }*/
  if (user.jogosultsag_azon ===4){
    return<Navigate to="/"/>
  }
  if (roleRequired && user.jogosultsag_azon !== roleRequired) {
      return <Navigate to="/emailKuldes" />;
  }

  return <Outlet />; // a protectedroute-ban levo route-kat mutatja
}
