import { Navigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";



export default function PrivateRoute({ children }) {

  const { user } = useAuthContext(); // Az aktuális felhasználó lekérése az AuthContextből

  // Ha van bejelentkezett felhasználó, megjeleníti a gyerekeket (pl. HomePage)
  // Ha nincs, visszairányít a bejelentkezési oldalra
  return user ? children : <Navigate to="/" />;
}
