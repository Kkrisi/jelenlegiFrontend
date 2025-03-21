import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";





export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { loginReg, errors } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adat = {
      email: email,
      password: password,
    };


    try {
      await loginReg(adat, "/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  
  return (
    <div className="loginpage d-flex justify-content-center align-items-center vh-100 bg-light">
      {loading ? ( // Feltételes megjelenítés
        <div className="center">
          <span className="loader">Betöltés</span> 
        </div>
      ) : (
        <div className="login-container p-4 rounded shadow">
          <h2 className="text-center">Belépés</h2>

          <form onSubmit={handleSubmit} id="loginForm">
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                placeholder="Email cím"
                name="email"
                autoComplete="email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              {errors.email && (
                <span className="text-danger">{errors.email[0]}</span>
              )}
            </div>

            <div className="input-group mb-3">
              <input
                type="password"
                value={password}
                id="password"
                className="form-control"
                placeholder="Jelszó"
                name="password"
                autoComplete="current-password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              {errors.password && (
                <span className="text-danger">{errors.password[0]}</span>
              )}
            </div>

            <div className="actions text-center">
              <button type="submit" className="btn btn-primary w-100">
                Bejelentkezés
              </button>
            </div>
          </form>

          <div className="links text-center mt-3">
            <p>Még nincs regisztrálva?</p>
            <Link className="nav-link text-info" to="/regisztracio">
              Regisztráció
            </Link>

            <p>Elfelejtetted a jelszavad?</p>
            <Link className="nav-link text-info" to="/elfelejtJelszo">
              Elfelejtett jelszó
            </Link>
          </div>
        </div>
      )}

      <div className="right-corner">
        <img src="favicon2.ico" alt="School Icon"/>
      </div>
    </div>
  );
}
