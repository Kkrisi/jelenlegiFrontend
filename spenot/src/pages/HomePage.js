import React from 'react';
import useAuthContext from "../contexts/AuthContext";

export default function HomePage() {

    const { user, logout } = useAuthContext();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="homepage py-5">
            <main>
                <header className="mb-4">
                    <h1 className="text-center tarolo">Emailküldő Szolgáltatás</h1>
                    <p>Bejelentkezett felhasználó: {user === null ? "Nincs bejelentkezett felhasználó!" : user.name}</p>
                </header>
                <article>
                    <div className="additional-buttons mb-4 text-center">
                        <button type="button" className="btn btn-secondary m-2" id="jsonCreate">Json fájl elkészítése</button>
                        <button type="button" className="btn btn-secondary m-2" id="emailSend">Email küldése</button>
                        <button type="button" className="btn btn-danger m-2" id="pdftorles">Pdf-ek törlése</button>
                        <button type="button" className="btn btn-danger m-2" id="torolMailek">Mail_senders tábla adatok törlése</button>
                        <button className='logout btn btn-warning m-2' onClick={handleLogout}>Kijelentkezés</button>
                    </div>
                    <div className="info-section">
                        <p>Fájl kiválasztása: <span id="fajlkivalasztasGomb"></span></p>
                        <p>Áthelyezés: <span id="athelyezesGomb"></span></p>
                        <p>Küldés: <span id="kuldesGomb"></span></p>
                        <p>Json fájl állapota: <span id="jsonAllapotGomb"></span></p>
                        <p>Emailek állapota: <span id="emailAllapotGomb"></span></p>
                        <p>Törölt pdf-ek: <span id="toroltpdfekGomb"></span></p>
                        <p>Törölt mail_senders tábla: <span id="toroltmailekGomb"></span></p>
                    </div>
                </article>
            </main>
        </div>
    );
}
