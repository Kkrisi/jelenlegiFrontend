import React, { useEffect, useState } from "react";
import { sendToServer } from "../api/sendToServer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from 'react-bootstrap';
import { myAxios } from '../api/axios';




export default function UploadDatabase() {

  const [jsonOutput, setJsonOutput] = useState("");
  const [fileName, setFileName] = useState("");
  const [workerCount, setWorkerCount] = useState(0);
  const [existingDolgozokFromInput, setExistingDolgozokFromInput] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);



  



  
  // -------------------------------------------- Csv fájlválasztás, Jsonba konvertálás, ellenőrzés kezdete --------------------------------------------
  const handleFileChange = (event) => {
    setJsonOutput("");
    setWorkerCount(0);
    setExistingDolgozokFromInput([]);
    setUploadSuccessMessage("");
    setErrorCount(0);

    const file = event.target.files[0];
    if (!file) return;


    if (!file.name.endsWith('.csv')) {
        setUploadErrorMessage("Hibás fájlformátum! Kérjük, válasszon CSV fájlt. ❌");
        return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
    const csvText = e.target.result;
    const json = csvToJson(csvText);


    if (!json || json.length === 0) {
        setUploadErrorMessage("A fájl üres vagy érvénytelen adatszerkezetű. ❌");
        return;
    }


    // ------------------------ Ellenőrizzük a oszlopcímeket és hogy mindegyikhez tartozik adat ------------------------------
    const requiredKeys = ["Név", "Email", "BérlapKód"];
    const fileKeys = Object.keys(json[0]);

    // mindegyik oszlop megvan-e
    const missingKeys = requiredKeys.filter(key => !fileKeys.includes(key));
    if (missingKeys.length > 0) {
        setUploadErrorMessage(`Hiányzó oszlopok a CSV fájlban: ${missingKeys.join(", ")} ❌`);
        return;
    }

    // minden rekordban van e kötelező érték
    const invalidRows = json.filter((item, index) => 
        requiredKeys.some(key => !item[key] || item[key].trim() === "")
    );

    if (invalidRows.length > 0) {
        setUploadErrorMessage(`Hibás adatok találhatók a CSV fájlban! Ellenőrizd a kitöltetlen mezőket. Pl: Email-hez nincs email cím ❌`);
        return;
    }
    //---------------------------------------------------------------------------------------------------------------------------


    // jsonbe alakítás
    const modifiedJson = json.map((item) => ({
        nev: item["Név"],
        email: item["Email"],
        d_azon: item["BérlapKód"],
    }));

    setJsonOutput(JSON.stringify(modifiedJson, null, 2));
    setWorkerCount(modifiedJson.length);
};

  reader.readAsText(file);
};
// -------------------------------------------- Csv fájlválasztás, Jsonba konvertálás, ellenőrzés vége --------------------------------------------










// -------------------------------------------- CSV szöveg JSON-ná konvertálása kezdete --------------------------------------------
const csvToJson = (csv) => {
  const [headerLine, ...dataLines] = csv.trim().split("\n");
  const headers = headerLine.split(";").map((h) => h.trim());

  return dataLines.map((line) => {
    const values = line.split(";").map((v) => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || null;
    });
    return obj;
  });
};
// -------------------------------------------- CSV szöveg JSON-ná konvertálása vége --------------------------------------------











  // -------------------------------------------- Adatbázisba küldés és hibakezelés kezdete --------------------------------------------
  const handleSend = async () => {
    if (!jsonOutput || jsonOutput.trim() === "") {
      setUploadErrorMessage("A fájl üres vagy nem tartalmaz adatokat. ❌");
      return;
    }
  
    setIsSaving(true);
    setShowModal(true);
    setIsLoading(true);
  
    try {
      const jsonData = JSON.parse(jsonOutput);
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        setUploadErrorMessage("A fájl formátuma érvénytelen, nem tartalmaz megfelelő adatokat. ❌");
        return;
      }

      // a d_azon-t azt szám típusuvá alakítjuk mert json generáláskor String-lett
      const normalizedJsonData = jsonData.map(d => ({
        ...d,
        d_azon: Number(d.d_azon.replace(/"/g, ''))  // idezojeleket eltavolitjuk
      }));
      console.log("normalizedJsonData: ", normalizedJsonData);
      
  
      // ------------------- Dolgozók, új dolgozók és duplikált dolgozók figyelése -----------------
      const existingDolgozok = await fetchExistingDolgozok();

      const existingIds = new Set(existingDolgozok.map(d => d.d_azon));
      console.log("existingIds: ",existingIds);
  
      const newDolgozok = normalizedJsonData.filter(d => !existingIds.has(d.d_azon));
      console.log("uj dolgozok: ", newDolgozok);

      const existingDolgozokFromInput = normalizedJsonData.filter(d => existingIds.has(d.d_azon));
      console.log("már létező dolgozok: ", existingDolgozokFromInput);
      setExistingDolgozokFromInput(existingDolgozokFromInput);

  
      if (newDolgozok.length === 0) {
        setIsLoading(false);
        setIsSaving(false);
        setShowModal(false);
        setUploadErrorMessage("Minden dolgozó már létezik az adatbázisban.");
        return;
      }
      // --------------------------------------------------------------------------------------------



  
      //------------------- 20-asával küldés, megfogjuk a hibaüzenetet ha van ---------------------
      let success = 0;
      let error = 0;
      let errors = [];
      const chunkSize = 20;
  
      for (let i = 0; i < newDolgozok.length; i += chunkSize) {
        const chunk = newDolgozok.slice(i, i + chunkSize);
        
        try {
          await sendToServer(chunk);
          success += chunk.length;
        } catch (err) {
          console.error("Hiba történt egy csomag feltöltésekor ❌:", err);
          error += chunk.length;

          errors.push(err);
        }
      }
      setErrorMessages(errors);
      // ------------------------------------------------------------------------------------------
  
      
      setSuccessCount(success);
      setErrorCount(error);
  
      if (success > 0 && error === 0) {
        setUploadSuccessMessage(`Sikeres feltöltés! Összesen ${success} új személy lett feltöltve. ✅`);
      } else if (success > 0 && error > 0) {
        setUploadErrorMessage(`Részleges siker! ${success} rekord sikeresen feltöltve, de ${error} sikertelen volt. ⚠️`);
      } else {
        setUploadErrorMessage("Hiba történt a feltöltés során, egyetlen rekord sem lett feltöltve. ❌");
      }
    } catch (error) {
      setUploadErrorMessage("Hiba történt a feltöltés során! ❌");
    } finally {
      setIsLoading(false);
      setIsSaving(false);
      setShowModal(false);
    }
  };  
// -------------------------------------------- Adatbázisba küldés és hibakezelés vége --------------------------------------------








// -------------------------------------------- Meglevő diákok lekérdezése AB-ből kezdete --------------------------------------------
const fetchExistingDolgozok = async () => {
  try {
    const response = await myAxios.get("/api/dolgozok");
    return response.data;
  } catch (error) {
    setUploadErrorMessage("Hiba a dolgozók lekérésekor ❌:", error);
    return [];
  }
};
// -------------------------------------------- Meglevő diákok lekérdezése AB-ből vége --------------------------------------------
  


  





  // -------------------------------------------- Hibaüzenetek megjelenítése kezdete --------------------------------------------
  useEffect(() => {
    if (uploadErrorMessage) {
      alert(uploadErrorMessage);
    }
  }, [uploadErrorMessage]);
  // -------------------------------------------- Hibaüzenetek megjelenítése vége --------------------------------------------





  return (
    <div className="uploaddatabasepage">
      <div className="container">

        {/* Feltöltés szekció */}
        <div className="email-section">
          <h1>Adatbázisba feltöltés</h1>
          <button
            className="browse-btn tallozas"
            onClick={() => document.getElementById("fileInput").click()}
          >
            1. CSV fájl kiválasztása
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileChange}
          />

          <button className="send-btn kuldes" onClick={handleSend} disabled={isLoading}>
            2. Adatbázisba feltöltés
          </button>
          
          <br/>
          <br/>
          <br/>



          <p>1. Választott fájl:</p>
              <p className="megjelenoAdatok">
                  {jsonOutput !== "" ? `"${fileName}" ✅` : "Nincs csv fájl kiválasztva"}<br />
                  {jsonOutput !== "" ? `Diákok száma benne: ${workerCount}` : ""}
              </p>
              <br />


              <p>2. Feltöltés eredménye: </p>

              <div className="megjelenoAdatok">
                {uploadSuccessMessage && (
                  <div className="success-message">
                    <p>{uploadSuccessMessage}</p>
                    <br />
                  </div>
                )}

                {errorCount > 0 && (
                  <div className="hibaContainer">
                    <p>Hibák száma: {errorCount}</p>
                    <div className="scrollable-container">
                      <ul>
                        {errorMessages.map((error, index) => (
                          <li key={index}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {existingDolgozokFromInput.length > 0 && (
                  <div className="letezokContainer">
                    <p>Ők már léteznek az adatbázisban: {existingDolgozokFromInput.length}</p>
                    <div className="scrollable-container">
                      <ul>
                        {existingDolgozokFromInput.map(({ nev, email, d_azon }, index) => (
                          <li key={index}>
                            {nev} - {email} - {d_azon}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>



        </div>
      </div>



      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Feltöltés folyamatban... 🚀</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Az adatok feltöltése folyamatban van. Kérlek, várj egy pillanatot.</p>
        </Modal.Body>
      </Modal>
          
    </div>
  );
}
