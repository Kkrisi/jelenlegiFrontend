import React, { useRef, useState } from "react";
import '../App.css';
import { myAxios } from "../api/axios";
import { Modal } from 'react-bootstrap';
import useButtonContext from "../contexts/ButtonContext";



export default function EmailSend() {

  const { relocateFiles, getEmails, deletePdfs } = useButtonContext();
  const fileInputRef = useRef(null);
  //const [fileCount,setFileCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);   // ez FileList objektum, nem pedig tömb
  const [relocatedFileCount, setRelocatedFileCount] = useState(0);
  //const [getEmailsCount, setGetEmailsCount] = useState(0);

  const [showModal, setShowModal] = useState(false);


  const [foundEmailsCount, setFoundEmailsCount] = useState(0);
  const [notFoundEmailsCount, setNotFoundEmailsCount] = useState(0);

  const [foundEmails, setFoundEmails] = useState([]);
  const [notFoundEmails, setNotFoundEmails] = useState([]);










  const handleButtonClick = () => {
    fileInputRef.current.value = "";  // töröljük a korábbi fájlokat
    fileInputRef.current.click();   // fájlválasztó megnyitása

    // szöveg kiirások törlése
    //setFileCount(0);
    setRelocatedFileCount(0);
    setLoadingDelete(false);
    //setGetEmailsCount(0);
    setSelectedFiles([]);
    setFoundEmailsCount(0);
    setNotFoundEmailsCount(0);
    setNotFoundEmails([]);
    setSentEmailsCount(0);
    setActiveLog({ title: "", data: [] });
  }


  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
    //setFileCount(files.length);
    console.log(`${files.length} fájl lett kiválasztva.`);
  }





  // -------------------------------------------- Fájl áthelyezés kezdete -----------------------------------------
  const handleMoveFiles = async () => {
    if (selectedFiles.length > 0) {
      // fájlok egyesével küldése
      for (const file of selectedFiles) {
        console.log("Fájl a kérésben:", file.name);
  
        try {
            setShowModal(true);
          await relocateFiles(file);
          console.log("Fájl sikeresen elküldve!");
          setRelocatedFileCount(prevCount => prevCount + 1);
            setShowModal(false);
        } catch (error) {
          console.error("Hiba a fájl áthelyezésekor:", error);
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
          setShowModal(true);
      

          const { sikeresCount, sikertelenCount, sikertelenAdatok, sikeresAdatok } = await getEmails(fileDetails);
      
          console.log(`Sikeres: ${sikeresCount}, Sikertelen: ${sikertelenCount}`);
      
          // eltaroljuk a sikeres és sikertelen email találatokat is
          setNotFoundEmails(sikertelenAdatok);
          setFoundEmails(sikeresAdatok); 
          console.log("sikeresAdatok:",sikeresAdatok)
      
          // ha sikerult megegy akkor frissitjuk
          setFoundEmailsCount(sikeresCount); 
          setNotFoundEmailsCount(sikertelenCount);
      
          //setGetEmailsCount(prevCount => prevCount + 1);
          setShowModal(false);
        } catch (error) {
          console.error("Hiba az email cím megszerzésekor:", error);
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
      if (foundEmailsCount || foundEmailsCount !== 0) {   // azért kell mindenketto, mondjuk ha a foundEmC. = null,undefinied,NaN,""
        try {
          setShowModal(true);

          const response = await myAxios.post("/api/send-email");
          console.log("Email küldés eredménye:", response.data);



          const successfulEmails = response.data.successful_emails || [];

          if (successfulEmails.length > 0) {
            setFoundEmails(successfulEmails);  
          }



          // sikeresen elkuldott emailok szama
          setSentEmailsCount(response.data.sent_count || 0);

          setShowModal(false);
        } catch (error) {
          console.error("Hiba történt az email küldésekor:", error);
          alert("Hiba történt az e-mailek küldésekor.");
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
  // -------------------------------------------- Email küldése vége ---------------------------------------------------







  // -------------------------------------------- Eltárolt Pdfk törlése kezdete -----------------------------------------
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deletedFilesCount, setDeletedFilesCount] = useState(0);
  
  const handleRemovePdfs = async () => {
      try {
          setShowModal(true);
        const response = await deletePdfs();
        if (response && response.deleted_count !== undefined) {
            setDeletedFilesCount(response.deleted_count);
            console.log(`Pdf fájlok sikeresen törölve! ${response.deleted_count} db`);
        } else {
            console.error("Hibás vagy üres válasz a szervertől!", response);
        }
          setShowModal(false);
          setLoadingDelete(true);
      } catch (error) {
        console.error("Hiba törléskor:", error);
          setShowModal(false);
      }
  };
  // -------------------------------------------- Eltárolt Pdfk törlése vége --------------------------------------------





  

  // -------------------------------------------- Választott eredmény mutatása kezdete -----------------------------------------
  const [activeLog, setActiveLog] = useState({ title: "", data: [] });

  // Függvény a kattintott p-elemhez tartozó adatok frissítésére
  const handlePClick = (title, data) => {
    setActiveLog({ title, data });
  };
  // -------------------------------------------- Választott eredmény mutatása vége --------------------------------------------










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
    <div className="emailsendpage">

      <main>

        <article className="grid-container">

          <h1>Emailküldő</h1>

          <div className="top">

            <button type="button" id="fajlkivalasztas" onClick={handleButtonClick} >1. Fájl kiválasztása</button>
              <input type="file"
              ref={fileInputRef}
              accept="application/pdf"
              multiple
              onChange={handleFileChange}/>

            <button type="button" id="athelyezes" onClick={handleMoveFiles} >2. Áthelyezés</button>

            <button type="button" id="kuldes" onClick={handleAttachEmail} >3. Küldés /email párt keres</button>

            <button style={{ marginRight: '100px' }} type="button" id="emailSend" onClick={handleSendEmails} >4. Email küldése</button>

            <button type="button" id="pdftorles" onClick={handleRemovePdfs}>5. Pdf-ek törlése</button>

          </div>




          <div className="bottom">
            {/* BAL OLDAL */}
            <div className="bottom-left">
              <p>1. Fájl kiválasztása:</p>
              <p className="megjelenoAdatok" id="fajlkivalasztasGomb" onClick={() =>
                  handlePClick("Kiválasztott fájlok", 
                    Array.from(selectedFiles).map((file) => file.name)
                  )
                }
              >
                {selectedFiles.length > 0 ? `${selectedFiles.length} fájlt sikeresen kiválasztottunk ✅` : "Nincs fájl kiválasztva"}
              </p>
              <br />




              <p>2. Áthelyezés:</p>
              <p className="megjelenoAdatok" id="athelyezesGomb" onClick={
                async () => {
                  await showCurrentFiles();
                  handlePClick("Jelenleg fájlok az áthelyezett mappában:", currentFiles);
                }}
              >
                {selectedFiles.length > 0 && relocatedFileCount > 0 ? `${relocatedFileCount} fájl áthelyezve ✅` : ""}
              </p>
              <br />




              <p>3. Emailcím megszerzése:</p>
              <p className="megjelenoAdatok" id="kuldesGomb" onClick={() =>
                  handlePClick("Email címek megszerzése",
                    selectedFiles.length > 0 && (foundEmailsCount || notFoundEmailsCount)
                    ? foundEmails.map(({ kod, email }) => `${kod} - ${email}`) : [])}
              >
                {selectedFiles.length > 0 && foundEmailsCount + notFoundEmailsCount > 0
                  ? `${foundEmailsCount} email cím sikeresen megszerzett, ${notFoundEmailsCount} nem található.`
                  : ""}
              </p>
              <br />





              <p>4. Emailek állapota:</p>
              <p className="megjelenoAdatok" id="emailAllapotGomb" onClick={() =>
                  handlePClick("Elküldött emailek",
                    sentEmailsCount > 0 ? foundEmails.map((emailData, index) => (
                          <li key={index}> {emailData.email} </li>
                        ))
                      : []
                  )
                }
              >
                {sentEmailsCount > 0 ? `${sentEmailsCount} email sikeresen elküldve ✅` : ""}
                {/*{!foundEmailsCount || foundEmailsCount === 0 ? "Nem volt email küldés. ❌" : "" ? sentEmailsCount > 0 ? `${sentEmailsCount} email sikeresen elküldve ✅` : ""}*/}
              </p>
              <br />







              <p>5. Törölt pdf-ek:</p>
              <p className="megjelenoAdatok" id="pdftorlesGomb" onClick={async () => {
                  await showCurrentFiles();
                  {/*handlePClick("Törlés után a mappa tartalma:", currentFiles);*/}
                  handlePClick(currentFiles.length === 0 ? "Minden fájl törölve." : "Törlés után a mappa tartalma:", currentFiles.length === 0 ? [] : currentFiles);
                }}
              >
                {loadingDelete === true ? `${deletedFilesCount} fájl törölve ✅` : ""}
              </p>
            </div>






            {/* JOBB OLDAL */}
            <div className="bottom-right">
              <div className="scrollable-container">
                <h3>{activeLog.title}</h3>
                <ul>
                  {activeLog.data.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>




            
          </div>

          <br />
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
