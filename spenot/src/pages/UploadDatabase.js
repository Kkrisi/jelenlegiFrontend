import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { myAxios } from '../api/axios';
import useButtonContext from "../contexts/ButtonContext";


// !!!2x nem lehet ugyanazt a csv. megnyitni, -> válassz ki egy másikat, majd ujra azt amelyiket akarod

export default function UploadDatabase() {

  const { sendToServer } = useButtonContext();
  const [jsonOutput, setJsonOutput] = useState("");
  const [fileName, setFileName] = useState("");
  const [workerCount, setWorkerCount] = useState(0);
  const [duplicateWorkers, setDuplicateWorkers] = useState([]);

  const { setShowModal } = useButtonContext();

  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);



  



  
  // -------------------------------------------- Csv fájlválasztás, Jsonba konvertálás, ellenőrzés kezdete --------------------------------------------
  const handleCsvUpload = (event) => {
    setJsonOutput("");
    setWorkerCount(0);
    setDuplicateWorkers([]);
    setUploadSuccessMessage("");
    setErrorCount(0);

    const file = event.target.files[0]; // ellenorizzuk hogytényleg valasztott e ki fajlt
    if (!file) return;


    if (!file.name.endsWith('.csv')) {
        handleUploadResult(false, "Hibás fájlformátum! Kérjük, válasszon CSV fájlt. ❌");
        return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {    // fajlt tartalmat beolvassa az onload, majd szövegként elmentjuk és json formába írjuk át
    const csvText = e.target.result;
    const json = csvToJson(csvText);


    if (!json || json.length === 0) {
        handleUploadResult(false, "A fájl üres vagy érvénytelen adatszerkezetű. ❌");
        return;
    }



    // ------------------------ Ellenőrizzük a oszlopcímeket és hogy mindegyikhez tartozik adat ------------------------------
    const requiredKeys = ["Név", "Email", "BérlapKód"];
    // lekerjuk a json elso rekordjaban(objektumában) talalhato oszlopneveket(rekord kulcsait)
    const fileKeys = Object.keys(json[0]);    
    // mindegyik kötelezőoszlop megvan-e, ha nem, beletszzük a missingKeys-be
    const missingKeys = requiredKeys.filter(key => !fileKeys.includes(key)); // paraméter=key, return->!file.... rövidítve

    /*  
      példa: 
      első rekordban(objektumban):   { "Név": "Bla Bla", "Email": "bla@gmail.com", "BérlapKód": "12345" }  
      akkor a fileKeys tömb:              ["Név", "Email", "BérlapKód"]

    */

    if (missingKeys.length > 0) {
        handleUploadResult(false, `Hiányzó oszlopok a CSV fájlban: ${missingKeys.join(", ")} ❌`);
        return;
    }

    // minden rekordban van e kötelező érték
    const invalidRows = json.filter((rekord, index) =>  //rekord = objektum
        requiredKeys.some(oszlopNev => !rekord[oszlopNev] || rekord[oszlopNev].trim() === "") // some metódus: minden elemen, ha legalább egy van akkor true-t ad vissza
    );

    if (invalidRows.length > 0) {
        handleUploadResult(false, `Hibás adatok találhatók a CSV fájlban! Ellenőrizd a kitöltetlen mezőket. Pl: Email-hez nincs email cím ❌`);
        return;
    }
    //---------------------------------------------------------------------------------------------------------------------------


    // jsonbe alakítás(csak az oszlopneveket)
    const modifiedJson = json.map((item) => ({
        nev: item["Név"],
        email: item["Email"],
        d_azon: item["BérlapKód"],
    }));

    setJsonOutput(JSON.stringify(modifiedJson, null, 2)); //stringify->alaki formázás, null->szűrést lehetne megadni, 2->behuzást szabályozza
    setWorkerCount(modifiedJson.length);
};

  reader.readAsText(file);
};
// -------------------------------------------- Csv fájlválasztás, Jsonba konvertálás, ellenőrzés vége --------------------------------------------










// -------------------------------------------- CSV szöveg JSON-ná konvertálása kezdete --------------------------------------------
const csvToJson = (csv) => {
  const [headerLine, ...dataLines] = csv.trim().split("\n");  // headerLine-al első sort eltároljuk, a többi a dataLines-ba
  const headers = headerLine.split(";").map((h) => h.trim());   // ["Név", "Email", "BérlapKód"]

  return dataLines.map((line) => {  
    const values = line.split(";").map((v) => v.trim());  // ["Jani", "jani@email.com", "12345"]
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || null;  // ha nincs adat akkor null-t kap
    });
    return obj; // eg tömbben az összes sort egyesével adjuk viszsa
  });
};


/*
    visszaadott érték:
  [
    { "Név": "Jani", "Email": "jani@email.com", "BérlapKód": "12345" },
    { "Név": "Pali", "Email": "pali@email.com", "BérlapKód": "67890" }
  ]

*/
// -------------------------------------------- CSV szöveg JSON-ná konvertálása vége --------------------------------------------
















  // -------------------------------------------- Adatbázisba küldés és hibakezelés kezdete --------------------------------------------
  /*const handleSend = async () => {
    if (!jsonOutput || jsonOutput.trim() === "") {
      handleUploadResult(false, "A fájl üres vagy nem tartalmaz adatokat. ❌");
      return;
    }
  
    setShowModal(true);
   
    try {
      const jsonData = JSON.parse(jsonOutput);
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        handleUploadResult(false, "A fájl formátuma érvénytelen, nem tartalmaz megfelelő adatokat. ❌");
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

      const duplicateWorkers = normalizedJsonData.filter(d => existingIds.has(d.d_azon));
      console.log("már létező dolgozok: ", duplicateWorkers);
      setDuplicateWorkers(duplicateWorkers);

  
      if (newDolgozok.length === 0) {
        setShowModal(false);
        handleUploadResult(false, "Minden dolgozó már létezik az adatbázisban.");
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
        handleUploadResult(true, `Sikeres feltöltés! Összesen ${success} új személy lett feltöltve. ✅`);
      } else if (success > 0 && error > 0) {
        handleUploadResult(false, `Részleges siker! ${success} rekord sikeresen feltöltve, de ${error} sikertelen volt. ✅❌`);
      } else {
        handleUploadResult(false, "Hiba történt a feltöltés során, egyetlen rekord sem lett feltöltve. ❌");
      }
    } catch (error) {
      handleUploadResult(false, "Hiba történt a feltöltés során! ❌");
    } finally {
      setShowModal(false);
    }
  };  */


  
  
  
  
  
  
  
  
  
  
    /*  másik probalkozas   */

  /*const handleSend = async () => {
    if (!jsonOutput || jsonOutput.trim() === "") {
      handleUploadResult(false, "A fájl üres vagy nem tartalmaz adatokat. ❌");
      return;
    }

    setShowModal(true);

    try {
      const jsonData = JSON.parse(jsonOutput);
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        handleUploadResult(false, "A fájl formátuma érvénytelen, nem tartalmaz megfelelő adatokat. ❌");
        return;
      }


      const normalizedJsonData = jsonData.map(d => ({
        ...d,
        d_azon: Number(d.d_azon.replace(/"/g, ''))  // d_azon számra alakítása
      }));


      // ------------------- Lépés 1: Még fel nem töltött dolgozók szűrése -------------------
      const existingDolgozok = await fetchExistingDolgozok();
      const existingIds = new Set(existingDolgozok.map(d => d.d_azon));

      // Szűrd ki a duplikált dolgozókat
      const duplicateWorkers = normalizedJsonData.filter(d => existingIds.has(d.d_azon));
      console.log("Már létező dolgozók: ", duplicateWorkers);
      setDuplicateWorkers(duplicateWorkers);  // Ezt továbbra is megjeleníthetjük UI-ban

      // Szűrd ki az új dolgozókat, akik még nem léteznek
      const newDolgozok = normalizedJsonData.filter(d => !existingIds.has(d.d_azon));
      console.log("Új dolgozók: ", newDolgozok);

      // Ha nincs új dolgozó, akkor nem történik feltöltés
      if (newDolgozok.length === 0) {
        setShowModal(false);
        handleUploadResult(false, "Minden dolgozó már létezik az adatbázisban.");
        return;
      }


      // ------------------- Lépés 2: Feltöltés 20-asával -------------------
      let success = 0;
      let error = 0;
      let errors = [];
      const chunkSize = 20;

      for (let i = 0; i < newDolgozok.length; i += chunkSize) {
        const chunk = newDolgozok.slice(i, i + chunkSize);
        
        try {
          await sendToServer(chunk);  // Csak az új dolgozók kerülnek feltöltésre
          success += chunk.length;
        } catch (err) {
          console.error("Hiba történt egy csomag feltöltésekor ❌:", err);
          error += chunk.length;
          errors.push(err);
        }
      }

      setErrorMessages(errors);

      
      // ------------------- Lépés 3: Üzenet -------------------
      setSuccessCount(success);
      setErrorCount(error);

      if (success > 0 && error === 0) {
        handleUploadResult(true, `Sikeres feltöltés! Összesen ${success} új személy lett feltöltve. ✅`);
      } else if (success > 0 && error > 0) {
        handleUploadResult(false, `Részleges siker! ${success} rekord sikeresen feltöltve, de ${error} sikertelen volt. ✅❌`);
      } else {
        handleUploadResult(false, "Hiba történt a feltöltés során, egyetlen rekord sem lett feltöltve. ❌");
      }
    } catch (error) {
      handleUploadResult(false, "Hiba történt a feltöltés során! ❌");
    } finally {
      setShowModal(false);
    }
  };
  */





  const handleSend = async () => { 
    if (!jsonOutput || jsonOutput.trim() === "") {
      handleUploadResult(false, "A fájl üres vagy nem tartalmaz adatokat. ❌");
      return;
    }

    setShowModal(true);

    try {
      const jsonData = JSON.parse(jsonOutput);
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        handleUploadResult(false, "A fájl formátuma érvénytelen, nem tartalmaz megfelelő adatokat. ❌");
        return;
      }

      const normalizedJsonData = jsonData.map(d => ({
        ...d,
        d_azon: Number(d.d_azon.replace(/"/g, ''))
      }));

      
      // ------------------- Még fel nem töltött dolgozók szűrése -------------------
      const existingDolgozok = await fetchExistingDolgozok();
      const existingIds = new Set(existingDolgozok.map(d => d.d_azon));
      
      const duplicateWorkers = normalizedJsonData.filter(d => existingIds.has(d.d_azon));
      console.log("Már létező dolgozók: ", duplicateWorkers);
      setDuplicateWorkers(duplicateWorkers);

      const newDolgozok = normalizedJsonData.filter(d => !existingIds.has(d.d_azon));
      console.log("Új dolgozók: ", newDolgozok);
      // -----------------------------------------------------------------------------


      if (newDolgozok.length === 0) {
        setShowModal(false);
        handleUploadResult(false, "Minden dolgozó már létezik az adatbázisban.");
        return;
      }

      const result = await sendToServer(newDolgozok);
      
      handleUploadResult(result.success > 0, result.message);
    } catch (error) {
      handleUploadResult(false, "Hiba történt a feltöltés során! ❌");
    } finally {
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
    console.log("error message:", error.message);
    handleUploadResult(false, "Hiba a dolgozók lekérésekor ❌:", error);
    return [];
  }
};
// -------------------------------------------- Meglevő diákok lekérdezése AB-ből vége --------------------------------------------
  








// -------------------------------------------- Üzenetkiiratás kezedet (kódduplikáció ellen) --------------------------------------------
const handleUploadResult = (success, message) => {
  if (success) {
      setUploadSuccessMessage(message);
      setUploadErrorMessage("");
  } else {
      setUploadErrorMessage(message);
      setUploadSuccessMessage("");
  }
};
// -------------------------------------------- Üzenetkiiratás vége ------------------------ --------------------------------------------




  





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

        <div className="email-section">
          <h1>Új diákok felvitele</h1>
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
            onChange={handleCsvUpload}
          />

          <button className="send-btn kuldes" onClick={handleSend}>
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

                {duplicateWorkers.length > 0 && (
                  <div className="letezokContainer">
                    <p>Ők már léteznek az adatbázisban: {duplicateWorkers.length}</p>
                    <div className="scrollable-container">
                      <ul>
                        {duplicateWorkers.map(({ nev, email, d_azon }, index) => (
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
    </div>
  );
}
