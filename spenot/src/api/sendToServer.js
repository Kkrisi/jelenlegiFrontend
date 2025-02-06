import { myAxios } from "./axios";



const csrf = () => myAxios.get("/sanctum/csrf-cookie");

export const sendToServer = async (chunk) => {
  await csrf();
 

  try {
    await myAxios.post("/api/save-json-to-database", { json: JSON.stringify(chunk) });
    console.log("sikeres feltöltés");
  } catch (error) {
    console.error("Hiba feltöltéskor:", error);
  }

}
