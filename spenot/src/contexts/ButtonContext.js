import { createContext, useContext, useState } from "react";
import { myAxios } from "../api/axios";
import { Modal } from 'react-bootstrap';




const ButtonContext = createContext();

export const ButtonProvider = ({ children }) => {

  const [showModal, setShowModal] = useState(false);

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");

  



  const deletePdfs = async () => {
    await csrf();
   
  
    try {
      const response = await myAxios.delete("/api/torol-pdf-fajlok");
      console.log("sikeres törlés");
      return response.data;
    } catch (error) {
      console.error("Hiba törléskor:", error);
      return null;
    }
  
  }










  const getEmails = async (fileDetails) => {   // átadjuk a listát, egy fájlnevet és egy kodot tartalmza

    await csrf();

    try {
      const response = await myAxios.post("/api/get-emails", { fileDetails });
      
      const dataList = response.data.data;  // ez a datalist tartalmazza a lekért adatokat

      const dataMap = {};     // egy objektum, ahol a d_azon a kulcs és a név meg az email meg az érték, gyorsabb lesz az adatlekérés
      dataList.forEach(item => {
        dataMap[item.d_azon] = { nev: item.nev, email: item.email };
      });

      let sikeresCount = 0;
      let sikertelenCount = 0;
      let sikertelenAdatok = [];
      let sikeresAdatok = [];
      
      //  végigmegyünk a kapott listán, ha a kodnak talált párt akkor az emailel együtt összerakja
      fileDetails.forEach(({ kod, fileName }) => {
        if (dataMap[kod]) {
          sikeresCount++;
          sikeresAdatok.push({ fileName, kod, email: dataMap[kod].email });
        } else {
          sikertelenCount++;
          sikertelenAdatok.push({ fileName, kod });
          
          console.log(`Kód: ${kod} (Fájl: ${fileName}) -> Nincs találat az adatbázisban.`);
        }
      });

      return { sikeresCount, sikertelenCount, sikertelenAdatok, sikeresAdatok };

    } catch (error) {
      console.error("Hiba történt az adatok lekérésekor:", error);
      alert("Hiba történt az adatok lekérésekor:", error);
    }
  };







  const relocateFiles = async (file) => {
    await csrf();


    // beepitett javasc. obj. , fájlok kuldésére hasznaljak
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








  const sendToServer = async (chunk) => {
    await csrf();
   
  
    try {
      await myAxios.post("/api/save-json-to-database", { json: JSON.stringify(chunk) });  // szovegge alakítjuk mert az api így várja
      console.log("sikeres feltöltés");
    } catch (error) {
      console.error("Hiba feltöltéskor:", error);
      
      // ez akkor mukodik ha van részletes informácio a hibárol
      if (error.response && error.response.data && error.response.data.message) {
        //alert("Hiba: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        alert("Ismeretlen hiba történt a feltöltés során.");
        throw new Error("Ismeretlen hiba történt a feltöltés során.");
      }
    }
  };
  












  return (
    <>
    <ButtonContext.Provider value={{ deletePdfs, getEmails, relocateFiles, sendToServer }}>
      {children}
    </ButtonContext.Provider>

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




// ------- Egyedi "hook", így elég az useButtonContext()-et meghivni ---------
export default function useButtonContext() {
  return useContext(ButtonContext);
}
// -------------------------------------------------------------------------