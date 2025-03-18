import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';




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





  // ----------------------- Felhasználó lekérése kezdete ------------------------------
  const getUser = async () => {

    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false); // az api valasza utan mindig false lesz
    }
  };
  // ----------------------- Felhasználó lekérése vége --------------------------------





  

  // ------------------------------- Kijelentkezés kezdete --------------------------------
  const logout = async () => {
    try {
      setShowModal(true);
      await csrf();
      await myAxios.post("/logout");
      setShowModal(false);
    } catch (error) {
      console.error("Hiba a kijelentkezés során:", error);
      setShowModal(false);
    } finally {
      setUser(null);
      navigate("/bejelentkezes");
    }
  };
  // ------------------------------- Kijelentkezés vége -----------------------------------






  

  // ------------------------- Bejelentkezés / Regisztráció kezdete -----------------------
  const loginReg = async ({ ...adat }, vegpont) => {
    await csrf();

    try {
      const response = await myAxios.post(vegpont, adat);

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
  // ------------------------- Bejelentkezés / Regisztráció vége --------------------------
  






  // ------------- Oldal frissítés kezdete ------------
  useEffect(() => {
    if(!user){
      getUser();
    }
  }, []);
  // ------------- Oldal frissítés vége ---------------

    
  


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



// ------- Egyedi "hook", így elég az useAuthContext()-et meghivni ---------
export default function useAuthContext() {
  return useContext(AuthContext);
}
// -------------------------------------------------------------------------