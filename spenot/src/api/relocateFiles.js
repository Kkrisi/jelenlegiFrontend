import { myAxios } from "./axios";



const csrf = () => myAxios.get("/sanctum/csrf-cookie");


export const relocateFiles = async (file) => {
  await csrf();



  const formData = new FormData();
  formData.append("file", file);


  try {
    await myAxios.post("/api/relocate", formData);
    console.log("Sikeresen áthelyezve");
  } catch (error) {
    console.error("Hiba áthelyezéskor:", error);
    throw error;
  }
};