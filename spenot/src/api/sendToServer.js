import { myAxios } from "./axios";



const csrf = () => myAxios.get("/sanctum/csrf-cookie");

export const sendToServer = async (chunk) => {
  await csrf();
 

  try {
    await myAxios.post("/api/save-json-to-database", { json: JSON.stringify(chunk) });
    console.log("sikeres feltöltés");
  } catch (error) {
    console.error("Hiba feltöltéskor:", error);
    
    // ez akkor mukodik ha van részletes informácio a hibárol
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Ismeretlen hiba történt a feltöltés során.");
    }
  }
};
