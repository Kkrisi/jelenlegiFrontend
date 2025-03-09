import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";





export default function Navigation() {

    const { user, logout } = useAuthContext();
    const navigate = useNavigate();


      
    const handleLogout = () => {
        logout();
        navigate("/bejelentkezes");
    };

    /*const handleLogout = async () => {
        await logout();  // Várjuk meg a kijelentkezést
        navigate("/bejelentkezes"); // Csak utána navigálunk
    };*/
    




    return (
        <nav className="navigacio navbar navbar-expand-sm">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="navbar-item">
                        <Link className="nav-link" to="/emailKuldes">
                            Email Küldés
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link className="nav-link" to="/naplozas">
                            Naplózás
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link className="nav-link" to="/diakKezeles">
                            Diákok kezelése
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link className="nav-link" to="/abFeltoltes">
                            Új diákok felvitele
                        </Link>
                    </li>

                    {user ? (
                        <>
                            {user.jogosultsag_azon === 2 && (
                                <li className="navbar-item">
                                    <Link className="nav-link" to="/felhKezeles">
                                        Felhasználók kezelése
                                    </Link>
                                </li>
                            )}

                            <li className="navbar-item">
                                <button className="nav-link kijelentkezes" onClick={handleLogout}>
                                    Kijelentkezés
                                </button>
                            </li>
                        </>
                    ) : (
                        <>

                        </>
                    )}
                </ul>
                <p>Személy: {user === null ? "Nincs bejelentkezett felhasználó!" :  <strong>{user.name}</strong>}</p>
            </div>
        </nav>
        
    );
}
