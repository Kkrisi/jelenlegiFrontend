import React, { useRef, useState } from "react";
import '../App.css';



export default function EmailSend() {


  const fileInputRef = useRef(null);
  const [fileCount,setFileCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]); // Kiválasztott fájlok tárolása


  const handleButtonClick = () => {
    fileInputRef.current.value = ""; // Töröljük a korábbi fájlokat
    fileInputRef.current.click(); // Fájlválasztó megnyitása
  }


  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files); // Tároljuk a kiválasztott fájlokat
    setFileCount(files.length); // Beállítjuk a kiválasztott fájlok számát
    console.log(`${files.length} fájl lett kiválasztva.`);
  }




  // -------------------------------------------- Fájl áthelyezés kezdete --------------------------------------------
  const handleMoveFiles = async () => {
    if (selectedFiles.length > 0) {
      try {
        await getCsrfToken();  // CSRF token beállítása
        // Fájlok feltöltése a backendre
        const response = await relocateFiles(selectedFiles);
        console.log(`${response.files.length} fájl sikeresen áthelyezve ✅`);
      } catch (error) {
        console.error("Hiba a fájlok áthelyezésekor:", error);
      }
    } else {
      console.log("Nincs kiválasztott fájl.");
    }
  }
  // -------------------------------------------- Fájl áthelyezés vége --------------------------------------------







  return (
    <div className="emailsendpage">

      <main>

        <article>

          <h1>Emailküldő</h1>

          <div>

            <button type="button" id="fajlkivalasztas" onClick={handleButtonClick} >Fájl kiválasztása</button>
              <input type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="application/pdf" // Csak PDF fájlokat enged
              multiple // Több fájl kiválasztása engedélyezve
              onChange={handleFileChange} />

            <button
              type="button" id="athelyezes" onClick={() => handleButtonClick("")} >Áthelyezés</button>

            <button
              type="button" id="kuldes" onClick={() => handleButtonClick("")} >Küldés</button>
            <br />

            <button
              type="button" id="jsonCreate"
              onClick={() => handleButtonClick("createJson")} >Json fájl elkészítése</button>

            <button
              type="button" id="emailSend"
              onClick={() => handleButtonClick("sendEmail")} >Email küldése</button>

            <br />
            <button
              type="button" id="pdftorles"
              onClick={() => handleButtonClick("deletePdf")} >Pdf-ek törlése</button>

            <button
              type="button" id="torolMailek"
              onClick={() => handleButtonClick("deleteMails")} >Mail_senders tábla adatok törlése</button>
          </div>

          <br />


          <div>
            <p>Fájl kiválasztása: </p>
              <p className="megjelenoAdatok" id="fajlkivalasztasGomb">
                {fileCount > 0 ? `${fileCount} fájlt sikeresen kiválasztottunk ✅` : "Nincs fájl kiválasztva"}
              </p>

            <p>Áthelyezés: </p>
            <p className="megjelenoAdatok" id="athelyezesGomb"></p>
            <p>Küldés: </p>
            <p className="megjelenoAdatok" id="kuldesGomb"></p>


            <p>Json fájl állapota: </p>
            <p className="megjelenoAdatok" id="jsonAllapotGomb"></p>
            <p>Emailek állapota: </p>
            <p className="megjelenoAdatok" id="emailAllapotGomb"></p>


            <p>Törölt pdf-ek: </p>
            <p className="megjelenoAdatok" id="toroltpdfekGomb"></p>
            <p>Törölt mail_senders tábla: </p>
            <p className="megjelenoAdatok" id="toroltmailekGomb"></p>
          </div>
          <br />
        </article>
      </main>
    </div>
  );
}
