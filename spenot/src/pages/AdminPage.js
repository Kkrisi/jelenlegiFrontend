import React, { useState, useRef } from 'react';

export default function AdminPage() {
  const [fileCount, setFileCount] = useState(0);
  const [relocatedFileCount, setRelocatedFileCount] = useState(0);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setFileCount(files.length);
  };

  const handleMoveFiles = () => {
    setRelocatedFileCount(fileCount);
  };

  const handleRemovePdfs = () => {
    setFileCount(0);
    setRelocatedFileCount(0);
  };

  return (
    <div>
      <main>
        <article>
          <h1>Műveletek</h1>
          <div>
            <button type="button" id="enableUser" onClick={handleButtonClick}>
              Felhasználók engedélyezése
            </button>

            <button type="button" id="athelyezes" onClick={handleMoveFiles}>
              Áthelyezés
            </button>

            <br />

            <button type="button" id="pdftorles" onClick={handleRemovePdfs}>
              Pdf-ek törlése
            </button>
          </div>

          <br />

          <div>
            <p>Fájl kiválasztása:</p>
            <p className="megjelenoAdatok" id="fajlkivalasztasGomb">
              {fileCount > 0 ? `${fileCount} fájlt sikeresen kiválasztottunk ✅` : 'Nincs fájl kiválasztva'}
            </p>

            <p>Áthelyezés:</p>
            <p className="megjelenoAdatok" id="athelyezesGomb">
              {fileCount > 0 && relocatedFileCount === fileCount
                ? `${relocatedFileCount} fájlt sikeresen áthelyeztünk ✅`
                : relocatedFileCount > 0
                ? `${relocatedFileCount} fájl áthelyezve`
                : ''}
            </p>

            <p>Törölt pdf-ek:</p>
            <p className="megjelenoAdatok" id="toroltpdfekGomb"></p>
          </div>
          <br />
        </article>
      </main>
    </div>
  );
}
