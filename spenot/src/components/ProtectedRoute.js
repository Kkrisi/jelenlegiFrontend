import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ roleRequired }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Oldal frissítése...</div>; // ide egy kulon frissites oldalt beszurni css-el?
  }

  /*useEffect(() => {
    if (user && user.jogosultsag_azon === 4) {
      // törli a felhasználo cookieját
      logout();
    }
  }, [user, logout]);*/

  if (!user) {
    return <Navigate to="/bejelentkezes" />;
  }


  /*console.log("User jogosultsag_azon:", user.jogosultsag_azon);*/


  if (user.jogosultsag_azon === 4) {
    return <Navigate to="/permissiondenied" />;
  }

  if (roleRequired && user.jogosultsag_azon !== roleRequired) {
    return <Navigate to="/emailKuldes" />;
  }

  return <Outlet />;
}
