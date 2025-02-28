import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Kezdetben true, hogy várjon az API-ra
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");
  /*const [isCsrfLoaded, setIsCsrfLoaded] = useState(false); 
  const csrf = async () => {
    try {
      await myAxios.get("/sanctum/csrf-cookie");  
      setIsCsrfLoaded(true); 
    } catch (error) {
      console.error("CSRF fetch error:", error);
    }
  };*/

  //bejelentkezett felhasználó adatainak lekérdezése
  const getUser = async () => {
    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data); // Ha sikeres, beállítjuk a felhasználót
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null); // Ha hiba van, a felhasználó null lesz
    } finally {
      setLoading(false); // Az API válasz után mindig false lesz
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



  /*useEffect(() => {
    //console.log("user__kiiras:", user);
    getUser();
  }, []);*/


  useEffect(() => {
    const fetchData = async () => {
      try {
        await csrf(); // Sanctum CSRF süti beállítása
        await getUser(); // Felhasználói adatok lekérése
      } catch (error) {
        console.error("Hiba a felhasználó lekérésekor:", error);
      }
    };

    // Csak akkor hívjuk meg a `fetchData`, ha nincs még beállítva felhasználó
    if (!user) {
      fetchData();
    } else {
      setLoading(false); // Ha már van felhasználó, akkor ne várjunk
    }
  }, [user]); // Függetlenül attól, hogy `user` változik, a `loading` változása is triggereli

    
  


  return (
    <AuthContext.Provider value={{ logout, loginReg, errors, getUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}