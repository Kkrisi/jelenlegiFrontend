import React, { useState, useEffect } from 'react';
import { myAxios } from '../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Laravel CSRF cookie inicializálása
        myAxios.get('/sanctum/csrf-cookie')
          
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await myAxios.post('/api/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Hiba történt.');
        }
    };

    return (
        <div className="loginpage d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="login-container p-4 rounded shadow">
                <h2 className="text-center">Elfelejtett jelszó esetén</h2>
                <p id="forgotText">Kiküldünk egy emailt önnek amiben kap egy új átmeneti jelszót</p>
                <br />
                <form id="forgotpasswordForm" onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input 
                            type="email" 
                            id="email" 
                            className="form-control" 
                            placeholder="Email cím"  
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="actions text-center">
                        <button type="submit" className="btn btn-primary w-100">Küldés</button>
                    </div>
                </form>
                {message && <p className="text-center mt-3">{message}</p>}
                <div className="links text-center mt-3">
                    <p>Nem érkezett meg?</p>
                    <a href="#" className="d-block">Email újraküldése</a>
                </div>
            </div>

            <div className="right-corner">
                Szalézi Ágazati <br /> Képzőközpont
            </div>
        </div>
    );
}
