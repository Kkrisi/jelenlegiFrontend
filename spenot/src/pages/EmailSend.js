import React, { useRef, useState } from "react";
import '../App.css';
import { relocateFiles } from "../api/relocateFiles";
import { deletePdfs } from "../api/deletePdfs";
import { myAxios } from "../api/axios";
import { getEmails } from "../api/getEmails";
import { Modal } from 'react-bootstrap';
import useAuthContext from "../contexts/AuthContext";



export default function EmailSend() {


  const fileInputRef = useRef(null);
  const [fileCount,setFileCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);   // ez FileList objektum, nem pedig tömb
  const [relocatedFileCount, setRelocatedFileCount] = useState(0);
  const [getEmailsCount, setGetEmailsCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);










  const handleButtonClick = () => {
    fileInputRef.current.value = "";  // töröljük a korábbi fájlokat
    fileInputRef.current.click();   // fájlválasztó megnyitása
  }


  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
    setFileCount(files.length);
    console.log(`${files.length} fájl lett kiválasztva.`);
  }





  // -------------------------------------------- Fájl áthelyezés kezdete -----------------------------------------
  const handleMoveFiles = async () => {
    if (selectedFiles.length > 0) {
      // fájlok egyesével küldése
      for (const file of selectedFiles) {
        console.log("Fájl a kérésben:", file.name);
  
        try {
            setIsSaving(true);
            setShowModal(true);
          await relocateFiles(file);
          console.log("Fájl sikeresen elküldve!");
          setRelocatedFileCount(prevCount => prevCount + 1);
            setIsSaving(false);
            setShowModal(false);
        } catch (error) {
          console.error("Hiba a fájl áthelyezésekor:", error);
            setIsSaving(false);
            setShowModal(false);
        }
      }
    } else { 
      console.log("Nincs kiválasztott fájl.");
    }
  };
  // -------------------------------------------- Fájl áthelyezés vége --------------------------------------------

  
  






    // -------------------------------------------- Hozzátartozó email keresés kezdete -------------------------------
    const handleAttachEmail = async () => {

      // 1. A kiválasztott fájlokat tömbbé alakítjuk
      const fileDetails = Array.from(selectedFiles)  // átalakítjuk a FileList-t egy tömbbé
      .map(file => {
        const kod = feldolgozFajlNev(file);
        return {kod, fileName: file.name};
      })
      .filter(file => file.kod);  // csak azokat a fájlokat tartjuk meg, amiknek van kódja


      if (fileDetails.length === 0) {
          console.warn("Nincs egyetlen kód sem a kiválasztott fájlokban.");
          return;
      }
      
      try {
          setIsSaving(true);
          setShowModal(true);
        await getEmails(fileDetails);
        //console.log("Sikeres email cím megszerzés!");
        setGetEmailsCount(prevCount => prevCount + 1);
          setIsSaving(false);
          setShowModal(false);
      } catch (error) {
        console.error("Hiba az email cím megszerzésekor:", error);
          setIsSaving(false);
          setShowModal(false);
      }
    };
    
    




    const feldolgozFajlNev = (file) => {
        const fileName = file.name;
        const feldolgozottFajl = fileName.split(" ");
        let kod = "";
    
        for (let index = 0; index < feldolgozottFajl.length; index++) {
            if (feldolgozottFajl[index].includes("(")) {
                kod = feldolgozottFajl[index].replace("(", "").replace(")", "");
                break;  /// ha megvan a kod akkor nem megyunk tovabb
            }
        }
    
        return kod;
    };
    // -------------------------------------------- Hozzátartozó email keresés vége ------------------------------------

    
    






  // -------------------------------------------- Email küldése kezdete ------------------------------------------------
  const handleSendEmails = async () => {
      try {
          setIsSaving(true);
          setShowModal(true);
        const response = await myAxios.post("/api/send-email");
        console.log("Email küldés eredménye:", response.data);
          setIsSaving(false);
          setShowModal(false);
    } catch (error) {
        console.error("Hiba történt az email küldésekor:", error);
        alert("Hiba történt az e-mailek küldésekor.");
          setIsSaving(false);
          setShowModal(false);
    }
  };
  // -------------------------------------------- Email küldése vége ---------------------------------------------------







  // -------------------------------------------- Eltárolt Pdfk törlése kezdete -----------------------------------------
  const handleRemovePdfs = async () => {
      try {
          setIsSaving(true);
          setShowModal(true);
        await deletePdfs();
        console.log('Pdf fájlok sikeresen törölve!');
          setIsSaving(false);
          setShowModal(false);
      } catch (error) {
        console.error("Hiba törléskor:", error);
          setIsSaving(false);
          setShowModal(false);
      }
  };
  // -------------------------------------------- Eltárolt Pdfk törlése vége --------------------------------------------






  return (
    <div className="emailsendpage">

      <main>

        <article>

          <h1>Emailküldő</h1>

          <div>

            {/*<button type="button" id="fajlkivalasztas" onClick={() => { handleButtonClick(); showPopup(); }} >Fájl kiválasztása</button>*/}
            <button type="button" id="fajlkivalasztas" onClick={handleButtonClick} >Fájl kiválasztása</button>
              <input type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="application/pdf"
              multiple
              onChange={handleFileChange} />

            <button type="button" id="athelyezes" onClick={handleMoveFiles} >Áthelyezés</button>

            <button type="button" id="kuldes" onClick={handleAttachEmail} >Küldés /email párt keres</button>
            <br />

            <button type="button" id="emailSend" onClick={handleSendEmails} >Email küldése</button>

            <br />
            <button type="button" id="pdftorles" onClick={handleRemovePdfs}>Pdf-ek törlése</button>

          </div>

          <br />


          <div>
            <p>Fájl kiválasztása: </p>
                <p className="megjelenoAdatok" id="fajlkivalasztasGomb">
                  {fileCount > 0 ? `${fileCount} fájlt sikeresen kiválasztottunk ✅` : "Nincs fájl kiválasztva"}
                </p>

            <p>Áthelyezés: </p>
                <p className="megjelenoAdatok" id="athelyezesGomb">
                  {selectedFiles > 0 && relocatedFileCount === selectedFiles.length
                      ? `${relocatedFileCount} fájlt sikeresen áthelyeztünk ✅`
                      : relocatedFileCount > 0
                      ? `${relocatedFileCount} fájl áthelyezve`
                      : ""}
                </p>


            <p>Emailcím megszerzése: </p>
              <p className="megjelenoAdatok" id="kuldesGomb">
                  {selectedFiles.length > 0 && getEmailsCount === 1 ? `Email cím sikeresen megszerezve ✅` : ""}
              </p>


            {/*<p>Json fájl állapota: </p>
            <p className="megjelenoAdatok" id="jsonAllapotGomb"></p>*/}
            <p>Emailek állapota: </p>
            <p className="megjelenoAdatok" id="emailAllapotGomb"></p>


            <p>Törölt pdf-ek: </p>
            <p className="megjelenoAdatok" id="toroltpdfekGomb"></p>
          </div>
          <br />
        </article>
      </main>
      

      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Dolgozunk rajta... 🚀</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Az adatok feldolgozása folyamatban van. Kérlek, várj egy pillanatot.</p>
          </Modal.Body>
      </Modal>


    </div>
  );
}


