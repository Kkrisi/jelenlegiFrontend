import { myAxios } from "./axios";



const csrf = () => myAxios.get("/sanctum/csrf-cookie");

export const deletePdfs = async () => {
  await csrf();
 

  try {
    await myAxios.delete("/api/torol-pdf-fajlok");
    console.log("sikeres törlés");
  } catch (error) {
    console.error("Hiba törléskor:", error);
  }

}
