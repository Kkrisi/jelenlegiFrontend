import React, { useState } from "react";
import { sendToServer } from "../api/sendToServer";





export default function UploadDatabase() {

  const [jsonOutput, setJsonOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  
  // Fájl kezelése és JSON generálás
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;
      const json = csvToJson(csvText);

      // JSON mezőnevek módosítása
      const modifiedJson = json.map((item) => ({
        nev: item["Név"],
        email: item["Email"],
        d_azon: item["BérlapKód"],
      }));

      setJsonOutput(JSON.stringify(modifiedJson, null, 2));
    };
    reader.readAsText(file);
  };




  // Adatok feltöltése 20-asával
  const handleSave = async () => {
    const jsonData = JSON.parse(jsonOutput);
    const chunkSize = 20;
    setIsLoading(true);

    for (let i = 0; i < jsonData.length; i += chunkSize) {
      const chunk = jsonData.slice(i, i + chunkSize);
      await sendToServer(chunk);
    }

    setIsLoading(false);
    alert("Sikeres mentés az adatbázisba!");
  };







  // CSV szöveg JSON-ná konvertálása
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






  return (
    <div className="uploaddatabasepage">
      <div className="container">

        {/* Feltöltés szekció */}
        <div className="email-section">
          <h2>Adatbázisba feltöltés</h2>
          <button
            className="browse-btn tallozas"
            onClick={() => document.getElementById("fileInput").click()}
          >
            CSV fájl feltöltése
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileChange}
          />

          <div className="email-list">
            <textarea
              id="jsonOutput"
              rows="15"
              cols="80"
              placeholder="A JSON itt fog megjelenni..."
              value={jsonOutput}
              readOnly
            ></textarea>
          </div>

          <br />
          <button className="send-btn kuldes" onClick={handleSave} disabled={isLoading}>
            Adatbázisba feltöltés
          </button>

          {/* Betöltő animáció */}
          {isLoading && (
            <div id="loadingSpinner">
              <div className="spinner"></div>
            </div>
          )}

          {/* CSRF token */}
          <input type="hidden" name="_token" value="{{ csrf_token() }}" />
        </div>

        {/* Végeredmény szekció */}
        <div className="error-log">
          <h2>Végeredmény</h2>
          <div className="elkuldottek"></div>
        </div>
      </div>
    </div>
  );
}
