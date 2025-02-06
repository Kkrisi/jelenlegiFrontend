import React, { useRef, useState } from "react";
import '../App.css';
import { relocateFiles } from "../api/relocateFiles";
import { deletePdfs } from "../api/deletePdfs";
import { myAxios } from "../api/axios";
import { getEmails } from "../api/getEmails";



export default function EmailSend() {


  const fileInputRef = useRef(null);
  const [fileCount,setFileCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);   // ez FileList objektum, nem pedig tömb
  const [relocatedFileCount, setRelocatedFileCount] = useState(0);
  const [getEmailsCount, setGetEmailsCount] = useState(0);


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
      // Minden fájl egyesével küldése
      for (const file of selectedFiles) {
        console.log("Fájl a kérésben:", file.name);
  
        try {
          await relocateFiles(file);
          console.log("Fájl sikeresen elküldve!");
          setRelocatedFileCount(prevCount => prevCount + 1);    // Az állapot frissítése a korábbi értékhez hozzáadva 1-et
        } catch (error) {
          console.error("Hiba a fájl áthelyezésekor:", error);
        }
      }
    } else { 
      console.log("Nincs kiválasztott fájl.");
    }
  };
  // -------------------------------------------- Fájl áthelyezés vége --------------------------------------------

  
  

/*
      - adatbázisba már leglevő diákok lekérdezése (duplikáció ellen)
      - lekéri a feltöltött Pdf kódok alapján a hozzájuk tartozó email címeket
      - json kreaálás
      - email küldés


        a "Hozzátartozó email keresés kezdete" paragrafus gyorsabb hogy itt hívom az axiost és nem kulon fájlban????
    */

    // -------------------------------------------- Hozzátartozó email keresés kezdete -------------------------------
    const handleAttachEmail = async () => {

      // 1. A kiválasztott fájlokat tömbbé alakítjuk
      const fileDetails = Array.from(selectedFiles)  // átalakítjuk a FileList-t egy tömbbé
      .map(file => {
        const kod = feldolgozFajlNev(file); // kinyerjük a fájlból a kódot
        return {
          kod,
          fileName: file.name
        };
      })
      .filter(file => file.kod);  // Csak azokat a fájlokat tartjuk meg, amiknek van kódja


      if (fileDetails.length === 0) {
          console.warn("Nincs egyetlen kód sem a kiválasztott fájlokban.");
          return;
      }
      
      try {
        await getEmails(fileDetails);
        //console.log("Sikeres email cím megszerzés!");
        setGetEmailsCount(prevCount => prevCount + 1);
      } catch (error) {
        console.error("Hiba az email cím megszerzésekor:", error);
      }
    };
    
    




    const feldolgozFajlNev = (file) => {
        const fileName = file.name;
        const feldolgozottFajl = fileName.split(" ");
        let kod = "";
    
        for (let index = 0; index < feldolgozottFajl.length; index++) {
            if (feldolgozottFajl[index].includes("(")) {
                kod = feldolgozottFajl[index].replace("(", "").replace(")", "");
                break;  // Ha találtunk egy kódot, nem kell tovább menni
            }
        }
    
        return kod;
    };
    // -------------------------------------------- Hozzátartozó email keresés vége ------------------------------------

    
    






  // -------------------------------------------- Email küldése kezdete ------------------------------------------------
  const handleSendEmails = async () => {
      try {
        const response = await myAxios.post("/api/send-email");
        console.log("Email küldés eredménye:", response.data);
        alert(`Sikeres küldés: ${response.data.sent_count} email elküldve.`);
    } catch (error) {
        console.error("Hiba történt az email küldésekor:", error);
        alert("Hiba történt az e-mailek küldésekor.");
    }
  };
  // -------------------------------------------- Email küldése vége ---------------------------------------------------





  // -------------------------------------------- Eltárolt Pdfk törlése kezdete -----------------------------------------
  const handleRemovePdfs = async () => {
      try {
        await deletePdfs();
        console.log('Pdf fájlok sikeresen törölve!');
      } catch (error) {
        console.error("Hiba törléskor:", error);
      }
  };
  // -------------------------------------------- Eltárolt Pdfk törlése vége --------------------------------------------






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
              accept="application/pdf"
              multiple
              onChange={handleFileChange} />

            <button type="button" id="athelyezes" onClick={handleMoveFiles} >Áthelyezés</button>

            <button type="button" id="kuldes" onClick={handleAttachEmail} >Küldés /email párt keres</button>
            <br />

            {/*<button type="button" id="jsonCreate" onClick={() => handleButtonClick("createJson")} >Json fájl elkészítése</button>*/}

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
    </div>
  );
}







/*

 const handleAttachEmail = async () => {
      for (const file of selectedFiles) {

          // Kivesszük a fájlból a kódot
          const kod = feldolgozFajlNev(file);
          if (!kod) {
              console.warn(`Nem található kód ebben a fájlban: ${file}`);
              continue; // Ha nincs kód, ugrik a következő fájlra
          }

          try {
              const response = await myAxios.post("/get-emails", { kodok: [kod] });

              if (response.data.emails.length > 0) {
                  console.log(`Kód: ${kod} -> E-mail: ${response.data.emails[0]}`);
              } else {
                  console.log(`Kód: ${kod} -> Nincs találat az adatbázisban.`);
              }
          } catch (error) {
              console.error(`Hiba történt a(z) ${kod} kódhoz tartozó e-mail lekérésekor:`, error);
          }
      }
  };





    

  // A fájlnevet feldolgozó függvény
  const feldolgozFajlNev = (file) => {
    const feldolgozottFajl = file.split(' ');
    let kod = "";

    for (let index = 0; index < feldolgozottFajl.length; index++) {
      if (feldolgozottFajl[index].includes("(")) {
        kod += feldolgozottFajl[index].slice(1, -1); // Kivágjuk a zárójelek közötti részt
      }
    }
    return kod;
  };


*/