import React, { useState } from "react";
import { myAxios } from '../api/axios';
import { Modal } from 'react-bootstrap';



export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState(""); 

      const [showModal, setShowModal] = useState(false);

    const getCsrfToken = () => {
        return document.cookie.split(';')
            .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


            setShowModal(true);
        
        const adat = {
            name: name,
            email: email,
            password: password,
            password_confirmation: confirmPassword, 
            jogosultsag_azon: 4,
        };


        const csrfToken = getCsrfToken();

        try {
            const response = await myAxios.post("/register", adat, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                }
            });
            console.log("Lyúhúúú! Műgödig");
                setShowModal(false);
            alert("Sikeres regisztráció!\nPár napon belül megkapod az engedélyt.")
            window.location.href = "/"        
        
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.log(error);
            alert(error);
        }
    };

    return (
        <div className="loginpage d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="login-container p-4 rounded shadow">
                <h2 className="text-center">Regisztráció</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            placeholder="Teljes név"
                            name="name"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        {errors.name && <span className="text-danger">{errors.name[0]}</span>}
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            placeholder="Email cím"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        {errors.email && <span className="text-danger">{errors.email[0]}</span>}
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="password"
                            value={password}
                            id="password"
                            className="form-control"
                            placeholder="Jelszó"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        {errors.password && <span className="text-danger">{errors.password[0]}</span>}
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="password"
                            value={confirmPassword}
                            id="confirmPassword"
                            className="form-control"
                            placeholder="Jelszó újra"
                            name="confirmPassword"
                            required
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                    </div>
                    <div>
                        {errors.password_confirmation && (
                            <span className="text-danger">{errors.password_confirmation[0]}</span>
                        )}
                    </div>

                    <div className="actions text-center">
                        <br />
                        <button type="submit" className="btn btn-primary w-100">Regisztrálok</button>
                    </div>

                </form>

            </div>

            <div className="right-corner">
                <img src="favicon2.ico" alt="School Icon"/>
            </div>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Regisztráció folyamatban... 🚀</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>Kérlek, várj egy pillanatot.</p>
                </Modal.Body>
            </Modal>


        </div>
    );
}
