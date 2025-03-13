import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { myAxios } from '../api/axios';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';



const ResetPassword = () => {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        myAxios.get('/sanctum/csrf-cookie')
            
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            alert("A jelszónak legalább 8 karakter hosszúnak kell lennie!");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("A két jelszó nem egyezik!");
            return;
        }

        setShowModal(true);

        try {
            const response = await myAxios.post('/api/reset-password', {
                token,
                email,
                password: newPassword,
                password_confirmation: confirmPassword,
            });
            setMessage(response.data.message);
            setShowModal(false);
            alert("Új jelszó sikeresen beállítva.");
            navigate("/bejelentkezes");
        } catch (error) {
            setMessage(error.response?.data?.message || 'Hiba történt.');
            setShowModal(false);
            alert(`Hiba történt: ${error.response?.data?.message || "Ismeretlen hiba."}`);  // ha több dolgot adunk át errorba akkor így kell (message miatt)
        }
    };

    return (
        <div className="resetpasswordpage">
            <article>
                <h2>Jelszó visszaállítása</h2>
                <span>Email:  {email}</span>

                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input
                            type="password"
                            placeholder="Új jelszó"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="form-control" 
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="Jelszó megerősítése"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <br />
                        <button id="resetBtn" type="submit">Jelszó visszaállítása</button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </article>

             <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Visszaállítás folyamatban... 🚀</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Kérlek, várj egy pillanatot.</p>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default ResetPassword;
