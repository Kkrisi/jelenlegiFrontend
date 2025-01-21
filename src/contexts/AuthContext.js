import { createContext, useContext, useState } from "react";
import { myAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");

  const getUser = async () => {
    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const logout = async () => {
    try {
      await myAxios.post("/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const loginReg = async (adat, vegpont) => {
    await csrf();
    try {
      await myAxios.post(vegpont, adat);
      await getUser();
      navigate("/kezdolap");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Login/registration error:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ logout, loginReg, errors, getUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
