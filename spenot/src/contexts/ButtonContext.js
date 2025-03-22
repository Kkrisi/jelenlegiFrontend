import { createContext, useContext, useState } from "react";
import { myAxios } from "../api/axios";
import { Modal } from 'react-bootstrap';




const ButtonContext = createContext();

export const ButtonProvider = ({ children }) => {

  const [showModal, setShowModal] = useState(false);

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");

  


  // -------------------------------------------- Eltárolt Pdfk törlése kezdete -----------------------------------------
  /*const deletePdfs = async () => {
    await csrf();
   
  
    try {
      const response = await myAxios.delete("/api/torol-pdf-fajlok");
      console.log("sikeres törlés");
      return response.data;
    } catch (error) {
      console.error("Hiba törléskor:", error);
      return null;
    }
  
  }*/

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deletedFilesCount, setDeletedFilesCount] = useState(0);

  const deletePdfs = async () => {
    await csrf();

    try {
        setShowModal(true);

        const response = await myAxios.delete("/api/torol-pdf-fajlok");
        
        if (response && response.data.deleted_count !== undefined) {
            setDeletedFilesCount(response.data.deleted_count);
            console.log(`PDF fájlok sikeresen törölve! ${response.data.deleted_count} db`);
        } else {
            console.error("Hibás vagy üres válasz a szervertől!", response);
        }
        return response.data;
    } catch (error) {
        console.error("Hiba törléskor:", error);
        return null;
    } finally {
      setShowModal(false);
    }
  };
  // -------------------------------------------- Eltárolt Pdfk törlése vége -----------------------------------------
  









  // -------------------------------------------- Hozzátartozó email keresés kezdete -------------------------------
  /*const getEmails = async (fileDetails) => {   // átadjuk a listát, egy fájlnevet és egy kodot tartalmza

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
  };*/

  const [foundEmailsCount, setFoundEmailsCount] = useState(0);
  const [notFoundEmailsCount, setNotFoundEmailsCount] = useState(0);

  const [foundEmails, setFoundEmails] = useState([]);
  const [notFoundEmails, setNotFoundEmails] = useState([]);
  

  const getEmails = async (fileDetails) => {
    await csrf();

    setShowModal(true);
    try {
        const response = await myAxios.post("/api/get-emails", { fileDetails });
        const dataList = response.data.data;

        const dataMap = {};
        dataList.forEach(item => {
            dataMap[item.d_azon] = { nev: item.nev, email: item.email };
        });

        let sikeresCount = 0;
        let sikertelenCount = 0;
        let sikertelenAdatok = [];
        let sikeresAdatok = [];

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

        // Frissítjük a state-eket
        setFoundEmails(sikeresAdatok);
        setNotFoundEmails(sikertelenAdatok);
        setFoundEmailsCount(sikeresCount);
        setNotFoundEmailsCount(sikertelenCount);

    } catch (error) {
        console.error("Hiba történt az adatok lekérésekor:", error);
        alert("Hiba történt az adatok lekérésekor.");
    } finally {
      setShowModal(false);
    }
  };
  // -------------------------------------------- Hozzátartozó email keresés vége -------------------------------











  // -------------------------------------------- Fájl áthelyezés kezdete -----------------------------------------
  /*const relocateFiles = async (file) => {
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
  };*/
  const [relocatedFileCount, setRelocatedFileCount] = useState(0);

  const relocateFiles = async (file) => {
    try {
      setShowModal(true);
      console.log("Áthelyezés elkezdődött:", file.name);


      const formData = new FormData();
      formData.append("file", file);


      const response = await myAxios.post("/api/relocate", formData);



      if (response.status === 200) {
        setRelocatedFileCount((prevCount) => prevCount + 1);
        console.log("Sikeres fájl áthelyezés:", file.name);
      } else {
        console.error("Sikertelen fájl áthelyezés:", file.name);
      }

    } catch (error) {
      console.error("Hiba történt a fájl áthelyezésekor:", error);
      alert(`Hiba történt: ${error.response?.data?.message || "Ismeretlen hiba"}`);
    } finally {
      setShowModal(false);
    }
  };
  // -------------------------------------------- Fájl áthelyezés vége -----------------------------------------












  // -------------------------------------------- Adatbázisba küldés és hibakezelés kezdete --------------------------------------------
  /*const sendToServer = async (chunk) => {
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
  };*/

  const sendToServer = async (chunks) => {
    await csrf();

    let success = 0;
    let error = 0;
    let errors = [];
  
    for (const chunk of chunks) {
      try {
        await myAxios.post("/api/save-json-to-database", { json: JSON.stringify(chunk) });
        success += chunk.length;
      } catch (err) {
        console.error("Hiba történt egy csomag feltöltésekor ❌:", err);
        error += chunk.length;
        errors.push(err.response?.data?.message || "Ismeretlen hiba");
      }
    }
  
    return { success, error, errors };
  };
  // -------------------------------------------- Adatbázisba küldés és hibakezelés vége --------------------------------------------
  










  // -------------------------------------------- Email küldése kezdete ------------------------------------------------
  const [sentEmailsCount, setSentEmailsCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const sendEmails = async () => {
    if (selectedFiles.length > 0) {
      //if (foundEmailsCount || foundEmailsCount !== 0) {
      if (foundEmailsCount > 0) {
        try {
          setShowModal(true);

          const response = await myAxios.post("/api/send-email");
          console.log("Email küldés eredménye:", response.data);



          // sikeresen elkuldott emailok szama
          setSentEmailsCount(response.data.sent_count || 0);

        } catch (error) {
          console.error("Hiba történt az email küldésekor:", error);
          alert("Hiba történt az e-mailek küldésekor.");
        } finally {
          setShowModal(false);
        }
      } else {
        alert("Mivel 0 db email címet találtunk meg, így nem tudunk email küldeni.");
        console.log("Nem találtunk email címeket.");
        console.log("foundEmailsCount értéke:", foundEmailsCount);
      }
    } else { 
      alert("Nincs kiválasztott fájl.");
      console.log("Nincs kiválasztott fájl.");
    }
  };
  // -------------------------------------------- Email küldése vége ------------------------------------------------










  // ------------------------------------- Jelenleg áthelyezett mappában levő fájlok kezdete -----------------------------------
  const [currentFiles, setCurrentFiles] = useState([]);

  const showCurrentFiles = async () => {
    try {
      const response = await myAxios.get("/api/listFiles");
      setCurrentFiles(response.data);
    } catch (error) {
      console.error("Hiba a fájlok lekérésekor:", error);
      alert("Hiba a fájlok lekérésekor:", error);
    }
  }
  // ------------------------------------- Jelenleg áthelyezett mappában levő fájlok vége --------------------------------------

  






  return (
    <>

    <ButtonContext.Provider value={{ 
      deletePdfs, getEmails, foundEmails, setFoundEmails, foundEmailsCount,
       setFoundEmailsCount, notFoundEmails, setNotFoundEmails, notFoundEmailsCount,
        setNotFoundEmailsCount, relocateFiles, relocatedFileCount, setRelocatedFileCount,
         sendToServer, sendEmails, sentEmailsCount, selectedFiles, setSelectedFiles, setSentEmailsCount,
         setLoadingDelete, setDeletedFilesCount, loadingDelete, deletedFilesCount,
         currentFiles, setCurrentFiles, showCurrentFiles, setShowModal }}>
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