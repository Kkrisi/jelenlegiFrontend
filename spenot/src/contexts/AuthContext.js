import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import Cookies from "js-cookie";




const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // kezdetben true, hogy várjon az API-ra
  const [showModal, setShowModal] = useState(false);
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

    // ha van authToken cookie, akkor betölti a felhasználó adatait.
    // ha nincs token vagy hibás, akkor törli a cookie-t és kijelentkezteti a felhasználót.
    /*const token = Cookies.get("authToken");

    if (!token) {
        setUser(null);
        setLoading(false);
        return;
    }
    
    try {
      const { data } = await myAxios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });*/
    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data); // Ha sikeres, beállítjuk a felhasználót
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null); // Ha hiba van, a felhasználó null lesz
      //Cookies.remove("authToken"); // Hibás token esetén töröljük a cookie-t
    } finally {
      setLoading(false); // Az API válasz után mindig false lesz
    }
  };
  

  /*const logout = async () => {
    await csrf();
    myAxios.post("/logout").then((resp) => {
      setUser(null);
    });
  };*/

  const logout = async () => {
  try {
    setShowModal(true);
    await csrf(); // CSRF süti frissítése
    await myAxios.post("/logout"); // Kijelentkezési kérés küldése
    //Cookies.remove("authToken"); // Token törlése
    setShowModal(false);
  } catch (error) {
    console.error("Hiba a kijelentkezés során:", error);
    setShowModal(false);
  } finally {
    setUser(null); // Felhasználó állapotának nullázása
    navigate("/bejelentkezes"); // Átirányítás a bejelentkezési oldalra
  }
};


  


  const loginReg = async ({ ...adat }, vegpont) => {
    await csrf();

    try {
      const response = await myAxios.post(vegpont, adat);

      // ez segít kiiratni a felhasznalo jogosultsagat konzolba a 28. sorba itt
      if (response.data.user) {
        setUser(response.data.user);
        //Cookies.set("authToken", response.data.token, { expires: 7 }); // 7 napig érvényes
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
      //console.error("Hiba a bejelentkezés során", error.message);
      // Felhasználói hibaüzenet
      /*if (error.response && error.response.status === 422) {
        alert("Hibás bejelentkezési adatok!");
      } else {
        alert("Valami hiba történt. Kérlek próbáld újra.");
      }*/
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
      getUser();
    }
  }, []);


  /*useEffect(() => {
    const fetchData = async () => {
      try {
        await csrf(); // CSRF süti beállítása
        await getUser(); // Felhasználói adatok lekérése
      } catch (error) {
        console.error("Hiba a felhasználó lekérésekor:", error);
        setUser(null); // Ha hiba történik, biztosítsuk, hogy a user null marad
      } finally {
        setLoading(false); // Az API válasz után mindig false lesz
      }
    };
  
    fetchData(); // Meghívjuk az adatlekérést az első renderkor
  }, []); // FONTOS: Üres dependency array, hogy csak az első rendernél fusson le!*/
  
  
  

    
  


  return (
    <>
    <AuthContext.Provider value={{ logout, loginReg, errors, getUser, user, loading }}>
      {children}
    </AuthContext.Provider>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Dolgozunk rajta... 🚀</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>A kijelentkezés folyamatban van. Kérlek, várj egy pillanatot.</p>
      </Modal.Body>
    </Modal>
  </>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}