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


  // email cím adatok lekérésekor -> gombhoz
  const [foundEmailsCount, setFoundEmailsCount] = useState(0);
  const [notFoundEmailsCount, setNotFoundEmailsCount] = useState(0);

  const [foundEmails, setFoundEmails] = useState([]);// a siekresen elkudotteke
  const [notFoundEmails, setNotFoundEmails] = useState([]); // a sikertelenul elkuldottekete tároljuk










  const handleButtonClick = () => {
    fileInputRef.current.value = "";  // töröljük a korábbi fájlokat
    fileInputRef.current.click();   // fájlválasztó megnyitása

    // szöveg kiirások törlése
    setFileCount(0);
    setRelocatedFileCount(0);
    setGetEmailsCount(0);
    setSelectedFiles([]);
    setFoundEmailsCount(0);
    setNotFoundEmailsCount(0);
    setNotFoundEmails([]);
    setSentEmailsCount(0);
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
      alert("Nincs kiválasztott fájl.");
      console.log("Nincs kiválasztott fájl.");
    }
  };
  // -------------------------------------------- Fájl áthelyezés vége --------------------------------------------

  
  






    // -------------------------------------------- Hozzátartozó email keresés kezdete -------------------------------
    const handleAttachEmail = async () => {
      if (selectedFiles.length > 0) {

        // a kivalaszott fajlokat tombé alakitjuk
        const fileDetails = Array.from(selectedFiles)  // átalakítjuk a FileList-t egy tömbbé
          .map(file => {
            const kod = feldolgozFajlNev(file);
            return { kod, fileName: file.name };
          })
          .filter(file => file.kod);  // csak azokat a fájlokat tartjuk meg, amiknek van kódja
      
        if (fileDetails.length === 0) {
          console.warn("Nincs egyetlen kód sem a kiválasztott fájlokban.");
          return;
        }
      
        try {
          setIsSaving(true);
          setShowModal(true);
      

          const { sikeresCount, sikertelenCount, sikertelenAdatok, sikeresAdatok } = await getEmails(fileDetails);
      
          console.log(`Sikeres: ${sikeresCount}, Sikertelen: ${sikertelenCount}`);
      
          // eltaroljuk a sikeres és sikertelen email találatokat is
          setNotFoundEmails(sikertelenAdatok);
          setFoundEmails(sikeresAdatok); 
      
          // ha sikerult megegy akkor frissitjuk
          setFoundEmailsCount(sikeresCount); 
          setNotFoundEmailsCount(sikertelenCount);
      
          setGetEmailsCount(prevCount => prevCount + 1);
          setIsSaving(false);
          setShowModal(false);
        } catch (error) {
          console.error("Hiba az email cím megszerzésekor:", error);
          setIsSaving(false);
          setShowModal(false);
        }
      } else { 
        alert("Nincs kiválasztott fájl.");
        console.log("Nincs kiválasztott fájl.");
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
  const [sentEmailsCount, setSentEmailsCount] = useState(0);

  const handleSendEmails = async () => {
    if (selectedFiles.length > 0) {
      try {
        setIsSaving(true);
        setShowModal(true);

        const response = await myAxios.post("/api/send-email");
        console.log("Email küldés eredménye:", response.data);

        // sikeresen elkuldott emailok szama
        setSentEmailsCount(response.data.sent_count || 0);

        setIsSaving(false);
        setShowModal(false);
      } catch (error) {
        console.error("Hiba történt az email küldésekor:", error);
        alert("Hiba történt az e-mailek küldésekor.");
        setIsSaving(false);
        setShowModal(false);
      }
    } else { 
      alert("Nincs kiválasztott fájl.");
      console.log("Nincs kiválasztott fájl.");
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



  // -------------------------------------------- Választott eredmény mutatása kezdete --------------------------------------------
  const handlePClick = async () => {
        {Array.from(selectedFiles).map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
  };
  // -------------------------------------------- Választott eredmény mutatása vége --------------------------------------------






  return (
    <div className="emailsendpage">

      <main>

        <article className="grid-container">

          <h1>Emailküldő</h1>

          <div className="top">

            {/*<button type="button" id="fajlkivalasztas" onClick={() => { handleButtonClick(); showPopup(); }} >Fájl kiválasztása</button>*/}
            <button type="button" id="fajlkivalasztas" onClick={handleButtonClick} >1. Fájl kiválasztása</button>
              <input type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="application/pdf"
              multiple
              onChange={handleFileChange} />

            <button type="button" id="athelyezes" onClick={handleMoveFiles} >2. Áthelyezés</button>

            <button type="button" id="kuldes" onClick={handleAttachEmail} >3. Küldés /email párt keres</button>

            <button style={{ marginRight: '100px' }} type="button" id="emailSend" onClick={handleSendEmails} >4. Email küldése</button>

            <button type="button" id="pdftorles" onClick={handleRemovePdfs}>5. Pdf-ek törlése</button>

          </div>

          <br />
          <br />

          <div className="bottom">
            <div className="bottom-left">
              <p>1. Fájl kiválasztása: </p>
                  <p className="megjelenoAdatok" id="fajlkivalasztasGomb"  onClick={handlePClick}>
                    {fileCount > 0 ? `${fileCount} fájlt sikeresen kiválasztottunk ✅` : "Nincs fájl kiválasztva"}
                  </p>
                  <br />


                  <p>2. Áthelyezés:</p>
              <p className="megjelenoAdatok" id="athelyezesGomb">
                {selectedFiles.length > 0 && relocatedFileCount > 0
                  ? `${relocatedFileCount} fájl áthelyezve${relocatedFileCount === selectedFiles.length ? " sikeresen ✅" : ""}`
                  : ""}
              </p>
              <br />



              <p>3. Emailcím megszerzése: </p>
              <p className="megjelenoAdatok" id="kuldesGomb">
                {selectedFiles.length > 0 && foundEmailsCount + notFoundEmailsCount > 0
                  ? `${foundEmailsCount} email cím sikeresen megszerzett, ${notFoundEmailsCount} nem található.`
                  : ""}
              </p>
              <br />

              {/* Sikertelen adatok kiírása */}
              {notFoundEmails.length > 0 && (
                <div className="megjelenoAdatok">
                  <p>Sikertelen találatok:</p>
                  <div className="scrollable-container">
                    <ul>
                      {notFoundEmails.map(({ fileName }, index) => (
                        <li key={index}>{fileName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}




              {/*<p>Json fájl állapota: </p>
              <p className="megjelenoAdatok" id="jsonAllapotGomb"></p>*/}
              <p>4. Emailek állapota: </p>
              <p className="megjelenoAdatok" id="emailAllapotGomb">
                {sentEmailsCount > 0
                  ? `${sentEmailsCount} email sikeresen elküldve ✅`
                  : ""}
              </p>
              <br />


              <p>5. Törölt pdf-ek: </p>
              <p className="megjelenoAdatok" id="toroltpdfekGomb"></p>
            </div>
            




            <div className="bottom-right">

                <div className="scrollable-container">
                  <ul>

                  </ul>
                </div>

            </div>
            
          </div>


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


