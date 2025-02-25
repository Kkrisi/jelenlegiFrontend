import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [isCsrfLoaded, setIsCsrfLoaded] = useState(false); 
  const csrf = async () => {
    try {
      await myAxios.get("/sanctum/csrf-cookie");  
      setIsCsrfLoaded(true); 
    } catch (error) {
      console.error("CSRF fetch error:", error);
    }
  };

  //bejelentkezett felhasználó adatainak lekérdezése
  const getUser = async () => {
    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = async () => {
    await csrf();
    myAxios.post("/logout").then((resp) => {
      setUser(null);
    });
  };

  const loginReg = async ({ ...adat }, vegpont) => {
    await csrf();

    try {
      const response = await myAxios.post(vegpont, adat);

      // ez segít kiiratni a felhasznalo jogosultsagat konzolba a 28. sorba itt
      if (response.data.user) {
        setUser(response.data.user);
      }

      await getUser();
      navigate("/emailKuldes");
      
    } catch (error) {
      console.error("Hiba a bejelentkezés/regisztráció során:", error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Ismeretlen hiba történt.");
      }
    }
  };

  /*useEffect(() => {
    if (!isCsrfLoaded) {
      csrf(); 
    } else {
      if (user === null) {
        getUser();  
      }
    }
  }, [isCsrfLoaded, user]);*/

  useEffect(() => {
    if(!user){
      getUser()
    }
  }, [])


  return (
    <AuthContext.Provider value={{ logout, loginReg, errors, getUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
