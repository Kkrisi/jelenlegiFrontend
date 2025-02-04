
import axios from 'axios';


export const relocateFiles = async (files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files[]", file);
  }

  try {
    return await axios.post("http://localhost:8000/relocate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true  // Fontos: a hitelesítési cookie-k átadása
    }).then(response => response.data);
  } catch (error) {
    console.error("Hiba a fájlok áthelyezésekor:", error);
    throw error;
  }
};
