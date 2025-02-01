import axios from 'axios';


export const getCsrfToken = async () => {
  try {
    //await axios.get("/sanctum/csrf-cookie");  // Laravel beállítja a CSRF tokent a sütiben
    //await axios.get("http://localhost:8000/sanctum/csrf-cookie");  // Itt a teljes URL szükséges

    //await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });  // Hozzáadtam a withCredentials beállítást

    const response = await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
    
    // CSRF token kiírása a konzolra
    console.log("Frontend CSRF token:", document.cookie);

    
    console.log("CSRF token beállítva!");
  } catch (error) {
    console.error("Hiba a CSRF token lekérésekor:", error);
  }
};
