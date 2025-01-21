import React from 'react';
import '../App.css';



export default function AdminPage() {

  const navigateToUploadDatabase = () => {
    window.location.href = 'http://localhost:8000/uploaddatabase';
  };

  const navigateToEmailOutSend = () => {
    window.location.href = 'http://localhost:8000/emailoutsend';
  };


  return (
    <div className="adminpage">
      <div className="container">


        {/* Felhasználókezelés szekció */}
        <div className="section" id="user-management">
          <h2>Felhasználókezelés</h2>
          <button className="kuldes">Felhasználók szerkesztése</button>
          <button className="kuldes" onClick={navigateToUploadDatabase}>
            Adatbázis feltöltése
          </button>
        </div>

        {/* E-mail beállítás szekció */}
        <div className="section" id="email-campaigns">
          <h2>E-mail beállítás</h2>
          <button className="kuldes" onClick={navigateToEmailOutSend}>
            Email küldés
          </button>
          <button className="kuldes">Sablon kezelés</button>
        </div>

        {/* Rendszerbeállítások szekció */}
        <div className="section" id="system-settings">
          <h2>Rendszerbeállítások</h2>
          <button className="kuldes">Küldési limitálás</button>
        </div>

        {/* Biztonság és naplózás szekció */}
        <div className="section" id="security-logs">
          <h2>Biztonság és naplózás</h2>
          <button className="kuldes">Tevékenységi naplók</button>
        </div>



      </div>
    </div>
  );
}

