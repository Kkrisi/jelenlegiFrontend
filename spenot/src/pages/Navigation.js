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




    return (
        <nav className="navbar navbar-expand-sm bg-light">
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
                                    <Link className="nav-link" to="/admin">
                                        Admin Oldal
                                    </Link>
                                </li>
                            )}

                            {user.jogosultsag_azon === 2 && (
                                <li className="navbar-item">
                                    <Link className="nav-link" to="/felhKezeles">
                                        Felhasználók kezelése
                                    </Link>
                                </li>
                            )}

                            <li className="navbar-item">
                                <button className="nav-link" onClick={handleLogout}>
                                    Kijelentkezés
                                </button>
                            </li>
                        </>
                    ) : (
                        <>

                        </>
                    )}
                </ul>
                <p>Személy: {user === null ? "Nincs bejelentkezett felhasználó!" : user.name}</p>
            </div>
        </nav>
    );
}
