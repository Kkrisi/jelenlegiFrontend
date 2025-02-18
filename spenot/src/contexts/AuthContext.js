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

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");



  //bejelentkezett felhasználó adatainak lekérdezése
  const getUser = async () => {
    const { data } = await myAxios.get("/api/user");
    console.log(data)
    setUser(data);
  };


  const logout = async () => {
    await csrf();

    myAxios.post("/logout").then((resp) => {
      setUser(null);
      console.log(resp);
    });
  };



  const loginReg = async ({ ...adat }, vegpont) => {
    await csrf();
    console.log(adat,vegpont);

    try {
      const response = await myAxios.post(vegpont, adat);

      // ez segít kiiratni a felhasznalo jogosultsagat konzolba a 28. sorba itt
      if (response.data.user) {
        setUser(response.data.user);}

      await getUser()
      navigate("/emailKuldes");
      
    } catch (error) {
      console.error("Hiba a bejelentkezés/regisztráció során:", error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
        console.log("hiba a bej.nél, nem tud a emailKuldes-re ugorni")
      } else {
        console.error("Ismeretlen hiba történt.");
      }
    }
  };

  useEffect(()=>{
    if(!user){
      getUser()
    } 
  },[])

  return (
    <AuthContext.Provider value={{ logout, loginReg, errors, getUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};


export default function useAuthContext() {
  return useContext(AuthContext);
}
